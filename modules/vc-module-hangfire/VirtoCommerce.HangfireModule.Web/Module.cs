
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VirtoCommerce.Platform.Core.Modularity;
using VirtoCommerce.Platform.Hangfire.Extensions;

namespace VirtoCommerce.HangfireModule.Web
{
    public class Module : IModule
    {
        public ManifestModuleInfo ModuleInfo { get; set; }

        public void Initialize(IServiceCollection services)
        {
            var providerSnapshot = services.BuildServiceProvider();
            var configuration = providerSnapshot.GetService<IConfiguration>();
            services.AddHangfire(configuration);
        }

        public void PostInitialize(IApplicationBuilder app)
        {
            var configuration = app.ApplicationServices.GetService<IConfiguration>();
            app.UseHangfire(configuration);
        }

        public void Uninstall()
        {
            // do nothing in here
        }

    }
}
