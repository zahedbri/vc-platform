using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using VirtoCommerce.HangfireModule.Web.Extensions;
using VirtoCommerce.Platform.Core.Jobs;
using VirtoCommerce.Platform.Core.Modularity;

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

            services.Replace(new ServiceDescriptor(typeof(IJobWorker), typeof(HangfireJobWorker), ServiceLifetime.Singleton));
        }

        public void PostInitialize(IApplicationBuilder appBuilder)
        {
            var configuration = appBuilder.ApplicationServices.GetService<IConfiguration>();

            appBuilder.UseHangfire(configuration);
        }

        public void Uninstall()
        {
            // do nothing in here
        }

    }
}
