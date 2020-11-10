
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VirtoCommerce.Platform.Assets.AzureBlobStorage;
using VirtoCommerce.Platform.Assets.AzureBlobStorage.Extensions;
using VirtoCommerce.Platform.Assets.FileSystem;
using VirtoCommerce.Platform.Assets.FileSystem.Extensions;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Modularity;

namespace VirtoCommerce.AssetsModule.Web
{
    public class Module : IModule
    {
        public ManifestModuleInfo ModuleInfo { get; set; }

        public void Initialize(IServiceCollection services)
        {
            var providerSnapshot = services.BuildServiceProvider();
            var configuration = providerSnapshot.GetService<IConfiguration>();
            var webHostEnvironment = providerSnapshot.GetService<IWebHostEnvironment>();

            //Assets
            var assetsProvider = configuration.GetSection("Assets:Provider").Value;
            if (assetsProvider.EqualsInvariant(AzureBlobProvider.ProviderName))
            {
                services.AddOptions<AzureBlobOptions>().Bind(configuration.GetSection("Assets:AzureBlobStorage")).ValidateDataAnnotations();
                services.AddAzureBlobProvider();
            }
            else
            {
                services.AddOptions<FileSystemBlobOptions>().Bind(configuration.GetSection("Assets:FileSystem"))
                      .PostConfigure(options =>
                      {
                          options.RootPath = webHostEnvironment.MapPath(options.RootPath);
                      }).ValidateDataAnnotations();

                services.AddFileSystemBlobProvider();
            }
        }

        public void PostInitialize(IApplicationBuilder app)
        {
        }

        public void Uninstall()
        {
            // do nothing in here
        }

    }
}
