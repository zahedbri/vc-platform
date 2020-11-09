
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using VirtoCommerce.Platform.Core.Modularity;

namespace VirtoCommerce.UXModule.Web
{
    public class Module : IModule
    {
        public ManifestModuleInfo ModuleInfo { get; set; }

        public void Initialize(IServiceCollection services)
        {
        }

        public void PostInitialize(IApplicationBuilder app)
        {
            var webHostEnvironment = app.ApplicationServices.GetService<IWebHostEnvironment>();
            webHostEnvironment.WebRootPath = ModuleInfo.FullPhysicalPath;

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(webHostEnvironment.MapPath("~/Content")),
                RequestPath = new PathString("")
            });

            // Add default MimeTypes with additional bindings
            var fileExtensionsBindings = new Dictionary<string, string>()
            {
                { ".liquid", "text/html"},
                { ".md", "text/html"}
            };

            // Create default provider (with default Mime types)
            var fileExtensionContentTypeProvider = new FileExtensionContentTypeProvider();

            // Add custom bindings
            foreach (var binding in fileExtensionsBindings)
            {
                fileExtensionContentTypeProvider.Mappings[binding.Key] = binding.Value;
            }

            app.UseStaticFiles(new StaticFileOptions
            {
                ContentTypeProvider = fileExtensionContentTypeProvider
            });

            //Handle all requests like a $(Platform) and Modules/$({ module.ModuleName }) as static files in correspond folder
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(webHostEnvironment.MapPath("~/js")),
                RequestPath = new PathString($"/$(Platform)/Scripts")
            });

            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(webHostEnvironment.MapPath("~/dist")),
                RequestPath = new PathString($"/dist")
            });

            var localModules = app.ApplicationServices.GetRequiredService<ILocalModuleCatalog>().Modules;
            foreach (var module in localModules.OfType<ManifestModuleInfo>())
            {
                app.UseStaticFiles(new StaticFileOptions()
                {
                    FileProvider = new PhysicalFileProvider(module.FullPhysicalPath),
                    RequestPath = new PathString($"/modules/$({ module.ModuleName })")
                });
            }

            app.UseDefaultFiles();


        }

        public void Uninstall()
        {
            // do nothing in here
        }

    }
}
