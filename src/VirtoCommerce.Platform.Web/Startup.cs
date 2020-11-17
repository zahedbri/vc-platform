using System.Diagnostics;
using System.Reflection;
using Microsoft.ApplicationInsights.DependencyCollector;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using VirtoCommerce.Platform.App;
using VirtoCommerce.Platform.App.Extensions;
using VirtoCommerce.Platform.Caching;
using VirtoCommerce.Platform.Core;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Modules;
using VirtoCommerce.Platform.Modules.Extensions;
using VirtoCommerce.Platform.Web.Extensions;
using VirtoCommerce.Platform.Web.Middleware;
using VirtoCommerce.Platform.Web.PushNotifications;
using VirtoCommerce.Platform.Web.Swagger;
using VirtoCommerce.Platform.Web.Telemetry;

namespace VirtoCommerce.Platform.Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IWebHostEnvironment hostingEnvironment)
        {
            Configuration = configuration;
            WebHostEnvironment = hostingEnvironment;
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment WebHostEnvironment { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            HostConfiguration.WebRootPath = WebHostEnvironment.WebRootPath;
            HostConfiguration.ContentRootPath = WebHostEnvironment.ContentRootPath;
            HostConfiguration.IsDevelopment = WebHostEnvironment.IsDevelopment();

            //Get platform version from GetExecutingAssembly
            PlatformVersion.CurrentVersion = SemanticVersion.Parse(FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location).ProductVersion);

            services.AddOptions<PlatformOptions>().Bind(Configuration.GetSection("VirtoCommerce")).ValidateDataAnnotations();

            var mvcBuilder = services.AddCustomizedMvc();
            services.AddModules(Configuration, HostConfiguration.IsDevelopment, x => mvcBuilder.AddApplicationPartWithRelatedAssembly(x))
                .AddIOServices()
                .AddSwagger()
                .AddEvents()
                .AddCaching(Configuration);

            // The following line enables Application Insights telemetry collection.
            services.AddAppInsightsTelemetry(Configuration);

            services.AddSignalR().AddPushNotifications(Configuration);

            if (Configuration["VirtoCommerce:ApplicationInsights:EnableLocalSqlCommandTextInstrumentation"]?.ToLower() == "true")
            {
                // Next line allows to gather detailed SQL info for AI in the local run.
                // See instructions here: https://docs.microsoft.com/en-us/azure/azure-monitor/app/asp-net-dependencies#advanced-sql-tracking-to-get-full-sql-query
                services.ConfigureTelemetryModule<DependencyTrackingTelemetryModule>((module, o) => { module.EnableSqlCommandTextInstrumentation = true; });
            }
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseCookiePolicy();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseCustomizedEndpoints();

            // Use app insights telemetry 
            app.UseAppInsightsTelemetry();
            app.UseModules();
            app.UseSwagger();

            //Return all errors as Json response
            app.UseMiddleware<ApiErrorWrappingMiddleware>();
        }
    }
}
