
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using VirtoCommerce.Platform.Core;
using VirtoCommerce.Platform.Core.Modularity;

namespace VirtoCommerce.FrontendModule.Web
{
    public class Module : IModule
    {
        public ManifestModuleInfo ModuleInfo { get; set; }

        public void Initialize(IServiceCollection services)
        {
        }

        public void PostInitialize(IApplicationBuilder app)
        {
            HostConfiguration.WebRootPath = Path.Combine(ModuleInfo.FullPhysicalPath, "wwwroot");
            HostConfiguration.ContentRootPath = HostConfiguration.MapPath("~/");

            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(HostConfiguration.WebRootPath),
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
                FileProvider = new PhysicalFileProvider(HostConfiguration.MapPath("~/js")),
                RequestPath = new PathString($"/$(Platform)/Scripts")
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
