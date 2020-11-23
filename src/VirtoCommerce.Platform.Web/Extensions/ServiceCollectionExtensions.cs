using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using VirtoCommerce.Platform.Core.JsonConverters;
using VirtoCommerce.Platform.Core.Security;
using VirtoCommerce.Platform.Modules;
using VirtoCommerce.Platform.Security;

namespace VirtoCommerce.Platform.Web.Extensions
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

        public static IServiceCollection ConfigureServer(this IServiceCollection services)
        {
            // Enable synchronous IO if using Kestrel:
            services.Configure<KestrelServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });

            // Enable synchronous IO if using IIS:
            services.Configure<IISServerOptions>(options =>
            {
                options.AllowSynchronousIO = true;
            });

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            return services;
        }
    }
}
