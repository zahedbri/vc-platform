using System.IO.Abstractions;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using VirtoCommerce.Platform.Core.Bus;
using VirtoCommerce.Platform.Core.Events;
using VirtoCommerce.Platform.Core.JsonConverters;
using VirtoCommerce.Platform.Core.Security;
using VirtoCommerce.Platform.Core.TransactionFileManager;
using VirtoCommerce.Platform.Core.ZipFile;
using VirtoCommerce.Platform.Modules;
using VirtoCommerce.Platform.Web.TransactionFileManager;
using VirtoCommerce.Platform.Web.UserResolver;
using VirtoCommerce.Platform.Web.ZipFile;

namespace VirtoCommerce.Platform.App.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IMvcBuilder AddCustomizedMvc(this IServiceCollection services)
        {

            var mvcBuilder = services.AddMvc(mvcOptions =>
            {
                //Disable 204 response for null result. https://github.com/aspnet/AspNetCore/issues/8847
                var noContentFormatter = mvcOptions.OutputFormatters.OfType<HttpNoContentOutputFormatter>().FirstOrDefault();
                if (noContentFormatter != null)
                {
                    noContentFormatter.TreatNullValueAsNoContent = false;
                }
            })
            .AddNewtonsoftJson(options =>
            {
                //Next line needs to represent custom derived types in the resulting swagger doc definitions. Because default SwaggerProvider used global JSON serialization settings
                //we should register this converter globally.
                options.SerializerSettings.ContractResolver = new PolymorphJsonContractResolver();
                //Next line allow to use polymorph types as parameters in API controller methods
                options.SerializerSettings.Converters.Add(new StringEnumConverter());
                options.SerializerSettings.Converters.Add(new PolymorphJsonConverter());
                options.SerializerSettings.Converters.Add(new ModuleIdentityJsonConverter());
                options.SerializerSettings.PreserveReferencesHandling = PreserveReferencesHandling.None;
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                options.SerializerSettings.Formatting = Formatting.None;
            });

            services.AddSingleton(js =>
            {
                var serv = js.GetService<IOptions<MvcNewtonsoftJsonOptions>>();
                return JsonSerializer.Create(serv.Value.SerializerSettings);
            });

            services.AddScoped<IUserNameResolver, HttpContextUserResolver>();
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            return mvcBuilder;
        }

        public static IServiceCollection AddIOServices(this IServiceCollection services)
        {
            services.AddSingleton<ITransactionFileManager, TransactionFileManager>();
            services.AddSingleton<IFileSystem, FileSystem>();
            services.AddTransient<IZipFileWrapper, ZipFileWrapper>();

            return services;
        }

        public static IServiceCollection AddEvents(this IServiceCollection services)
        {
            var inProcessBus = new InProcessBus();
            services.AddSingleton<IHandlerRegistrar>(inProcessBus);
            services.AddSingleton<IEventPublisher>(inProcessBus);

            return services;
        }
    }
}
