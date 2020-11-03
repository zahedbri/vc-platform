using System.IO.Abstractions;
using Microsoft.Extensions.DependencyInjection;
using VirtoCommerce.Platform.Core.TransactionFileManager;
using VirtoCommerce.Platform.Core.ZipFile;

namespace VirtoCommerce.Platform.File
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddFileServices(this IServiceCollection services)
        {
            services.AddSingleton<ITransactionFileManager, TransactionFileManager>();
            services.AddSingleton<IFileSystem, FileSystem>();
            services.AddTransient<IZipFileWrapper, ZipFileWrapper>();

            return services;
        }
    }
}
