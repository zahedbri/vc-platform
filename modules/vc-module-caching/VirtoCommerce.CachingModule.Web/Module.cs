using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StackExchange.Redis;
using VirtoCommerce.Platform.Caching;
using VirtoCommerce.Platform.Core.Caching;
using VirtoCommerce.Platform.Core.Modularity;
using VirtoCommerce.Platform.Redis;

namespace VirtoCommerce.CachingModule.Web
{
    public class Module : IModule
    {
        public ManifestModuleInfo ModuleInfo { get; set; }

        public void Initialize(IServiceCollection services)
        {
            services.AddMemoryCache();
            var configuration = services.BuildServiceProvider().GetService<IConfiguration>();

            var redisConnectionString = configuration.GetConnectionString("RedisConnectionString");

            services.AddOptions<CachingOptions>().Bind(configuration.GetSection("Caching")).ValidateDataAnnotations();


            if (!string.IsNullOrEmpty(redisConnectionString))
            {
                services.AddOptions<RedisCachingOptions>().Bind(configuration.GetSection("Caching:Redis")).ValidateDataAnnotations();

                services.AddSingleton<IPlatformMemoryCache, RedisPlatformMemoryCache>();

                var redis = ConnectionMultiplexer.Connect(redisConnectionString);
                services.AddSingleton<IConnectionMultiplexer>(redis);
                services.AddSingleton(redis.GetSubscriber());
            }
            else
            {
                //Use MemoryCache decorator to use global platform cache settings
                services.AddSingleton<IPlatformMemoryCache, PlatformMemoryCache>();
            }
        }

        public void PostInitialize(IApplicationBuilder appBuilder)
        {
        }

        public void Uninstall()
        {
            // do nothing in here
        }
    }
}
