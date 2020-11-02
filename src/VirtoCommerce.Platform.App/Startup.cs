using System.Diagnostics;
using System.IO;
using System.IO.Abstractions;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using VirtoCommerce.Platform.Core;
using VirtoCommerce.Platform.Core.Bus;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Events;
using VirtoCommerce.Platform.Core.Modularity;
using VirtoCommerce.Platform.Core.TransactionFileManager;
using VirtoCommerce.Platform.Core.ZipFile;
using VirtoCommerce.Platform.File;
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
            //Get platform version from GetExecutingAssembly
            PlatformVersion.CurrentVersion = SemanticVersion.Parse(FileVersionInfo.GetVersionInfo(Assembly.GetExecutingAssembly().Location).ProductVersion);

            services.AddOptions<PlatformOptions>().Bind(Configuration.GetSection("VirtoCommerce")).ValidateDataAnnotations();
            var mvcBuilder = services.AddMvc();

            //Events
            var inProcessBus = new InProcessBus();
            services.AddSingleton<IHandlerRegistrar>(inProcessBus);
            services.AddSingleton<IEventPublisher>(inProcessBus);

            //TODO File services
            services.AddSingleton<ITransactionFileManager, TransactionFileManager>();
            services.AddSingleton<IFileSystem, FileSystem>();
            services.AddTransient<IZipFileWrapper, ZipFileWrapper>();

            services.AddModules(Configuration, WebHostEnvironment.IsDevelopment(), x => mvcBuilder.AddApplicationPart(x));
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/", async context =>
                {
                    await context.Response.WriteAsync($"Version of the Platform is {PlatformVersion.CurrentVersion}");
                });
            });

            app.UseModules();
        }
    }
}
