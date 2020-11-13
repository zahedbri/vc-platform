using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Modularity;
using VirtoCommerce.Platform.Web.PushNotifications;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;

namespace VirtoCommerce.Platform.Web.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static IApplicationBuilder UseCustomizedEndpoints(this IApplicationBuilder appBuilder)
        {
            var moduleCatalogs = appBuilder.ApplicationServices.GetRequiredService<IModuleCatalog>();

            appBuilder.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");

                
                if (!moduleCatalogs.Modules.Any(x => x.ModuleName.EqualsInvariant("VirtoCommerce.Front")))
                {
                    endpoints.MapGet("/", async context =>
                    {
                        await context.Response.WriteAsync($"Version of the Platform is {PlatformVersion.CurrentVersion}");
                    });
                }

                endpoints.MapHub<PushNotificationHub>("/pushNotificationHub");
            });

            return appBuilder;
        }
    }
}
