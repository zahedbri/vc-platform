using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VirtoCommerce.Platform.Core.Modularity;
using VirtoCommerce.Platform.Web.PushNotifications;
using VirtoCommerce.PushNotificationsModule.Web.PushNotifications;

namespace VirtoCommerce.PushNotificationsModule.Web
{
    public class Module : IModule
    {
        public ManifestModuleInfo ModuleInfo { get; set; }

        public void Initialize(IServiceCollection services)
        {
            var providerSnapshot = services.BuildServiceProvider();
            var configuration = providerSnapshot.GetService<IConfiguration>();
            services.AddSignalR().AddPushNotifications(configuration);
        }

        public void PostInitialize(IApplicationBuilder app)
        {
            app.UseEndpoints(routes =>
            {
                routes.MapHub<PushNotificationHub>("/pushNotificationHub");
            });
        }

        public void Uninstall()
        {
            // do nothing in here
        }

    }
}
