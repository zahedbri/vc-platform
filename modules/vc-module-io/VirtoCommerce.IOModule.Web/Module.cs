
using System.IO.Abstractions;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using VirtoCommerce.Platform.Core.Modularity;
using VirtoCommerce.Platform.Core.TransactionFileManager;
using VirtoCommerce.Platform.Core.ZipFile;

namespace VirtoCommerce.IOModule.Web
{
    public class Module : IModule
    {
        public ManifestModuleInfo ModuleInfo { get; set; }

        public void Initialize(IServiceCollection services)
        {
            services.AddSingleton<ITransactionFileManager, TransactionFileManager>();
            services.AddSingleton<IFileSystem, FileSystem>();
            services.AddTransient<IZipFileWrapper, ZipFileWrapper>();
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
