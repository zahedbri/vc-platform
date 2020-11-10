using System.Diagnostics;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using VirtoCommerce.Platform.Core;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.JsonConverters;
using VirtoCommerce.Platform.Modules;
using VirtoCommerce.Platform.Modules.Extensions;

namespace VirtoCommerce.Platform.App
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
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            //Get platform version from GetExecutingAssembly
            PlatformVersion.CurrentVersion = SemanticVersion.Parse(FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location).ProductVersion);

            services.AddOptions<PlatformOptions>().Bind(Configuration.GetSection("VirtoCommerce")).ValidateDataAnnotations();

            var mvcBuilder = services.AddMvc(mvcOptions =>
            {
                //Disable 204 response for null result. https://github.com/aspnet/AspNetCore/issues/8847
                var noContentFormatter = mvcOptions.OutputFormatters.OfType<HttpNoContentOutputFormatter>().FirstOrDefault();
                if (noContentFormatter != null)
                {
                    noContentFormatter.TreatNullValueAsNoContent = false;
                }
            })
            .AddNewtonsoftJson(options =>
            {
                //Next line needs to represent custom derived types in the resulting swagger doc definitions. Because default SwaggerProvider used global JSON serialization settings
                //we should register this converter globally.
                options.SerializerSettings.ContractResolver = new PolymorphJsonContractResolver();
                //Next line allow to use polymorph types as parameters in API controller methods
                options.SerializerSettings.Converters.Add(new StringEnumConverter());
                options.SerializerSettings.Converters.Add(new PolymorphJsonConverter());
                options.SerializerSettings.Converters.Add(new ModuleIdentityJsonConverter());
                options.SerializerSettings.PreserveReferencesHandling = PreserveReferencesHandling.None;
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                options.SerializerSettings.Formatting = Formatting.None;
            });

            services.AddSingleton(js =>
            {
                var serv = js.GetService<IOptions<MvcNewtonsoftJsonOptions>>();
                return JsonSerializer.Create(serv.Value.SerializerSettings);
            });

            services.AddModules(Configuration, WebHostEnvironment.IsDevelopment(), x => mvcBuilder.AddApplicationPartWithRelatedAssembly(x));
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

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });

            app.UseModules();
        }
    }
}
