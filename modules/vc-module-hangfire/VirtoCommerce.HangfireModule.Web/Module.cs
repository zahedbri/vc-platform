
using Hangfire;
using Hangfire.MemoryStorage;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using VirtoCommerce.Platform.Core.Bus;
using VirtoCommerce.Platform.Core.Modularity;
using VirtoCommerce.Platform.Core.Settings;
using VirtoCommerce.Platform.Core.Settings.Events;
using VirtoCommerce.Platform.Hangfire;
using VirtoCommerce.Platform.Hangfire.Extensions;
using VirtoCommerce.Platform.Hangfire.Middleware;

namespace VirtoCommerce.HangfireModule.Web
{
    public class Module : IModule
    {
        public ManifestModuleInfo ModuleInfo { get; set; }

        public void Initialize(IServiceCollection services)
        {
            var providerSnapshot = services.BuildServiceProvider();
            var configuration = providerSnapshot.GetService<IConfiguration>();

            var section = configuration.GetSection("VirtoCommerce:Hangfire");
            var hangfireOptions = new HangfireOptions();
            section.Bind(hangfireOptions);
            services.AddOptions<HangfireOptions>().Bind(section).ValidateDataAnnotations();

            GlobalJobFilters.Filters.Add(new AutomaticRetryAttribute { Attempts = hangfireOptions.AutomaticRetryCount });
            if (hangfireOptions.JobStorageType == HangfireJobStorageType.SqlServer)
            {
                services.AddHangfire(c => c.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                // Call UseSqlServerStorage with fake SqlServerStorageOptions to avoid Hangfire tries to apply its migrations because these never do in case of database absence.
                // Real options provided in ApplicationBuilderExtensions.UseHangfire where migrations forced to apply.
                .UseSqlServerStorage(configuration.GetConnectionString("VirtoCommerce"), new SqlServerStorageOptions() { PrepareSchemaIfNecessary = false }));
            }
            else
            {
                services.AddHangfire(config => config.UseMemoryStorage());
            }
        }

        public void PostInitialize(IApplicationBuilder appBuilder)
        {
            var configuration = appBuilder.ApplicationServices.GetService<IConfiguration>();

            // Always resolve Hangfire.IGlobalConfiguration to enforce correct initialization of Hangfire giblets before modules init.
            // Don't remove next line, it will cause issues with modules startup at hangfire-less (UseHangfireServer=false) platform instances.
            var hangfireGlobalConfiguration = appBuilder.ApplicationServices.GetRequiredService<IGlobalConfiguration>();

            // This is an important workaround of Hangfire initialization issues
            // The standard database schema initialization way described at the page https://docs.hangfire.io/en/latest/configuration/using-sql-server.html works on an existing database only.
            // Therefore we create SqlServerStorage for Hangfire manually here.
            // This way we ensure Hangfire schema will be applied to storage AFTER platform database creation.
            var hangfireOptions = appBuilder.ApplicationServices.GetRequiredService<IOptions<HangfireOptions>>().Value;
            if (hangfireOptions.JobStorageType == HangfireJobStorageType.SqlServer)
            {
                var storage = new SqlServerStorage(configuration.GetConnectionString("VirtoCommerce"), hangfireOptions.SqlServerStorageOptions);
                hangfireGlobalConfiguration.UseStorage(storage);
            }

            appBuilder.UseHangfireDashboard("/hangfire", new DashboardOptions { Authorization = new[] { new HangfireAuthorizationHandler() } });

            var mvcJsonOptions = appBuilder.ApplicationServices.GetService<IOptions<MvcNewtonsoftJsonOptions>>();
            GlobalConfiguration.Configuration.UseSerializerSettings(mvcJsonOptions.Value.SerializerSettings);

            var inProcessBus = appBuilder.ApplicationServices.GetService<IHandlerRegistrar>();
            var recurringJobManager = appBuilder.ApplicationServices.GetService<IRecurringJobManager>();
            var settingsManager = appBuilder.ApplicationServices.GetService<ISettingsManager>();
            inProcessBus.RegisterHandler<ObjectSettingChangedEvent>(async (message, token) => await recurringJobManager.HandleSettingChangeAsync(settingsManager, message));

            // Add Hangfire filters/middlewares
            var contextAccessor = appBuilder.ApplicationServices.GetRequiredService<IHttpContextAccessor>();
            GlobalJobFilters.Filters.Add(new HangfireUserContextMiddleware(contextAccessor));

        }

        public void Uninstall()
        {
            // do nothing in here
        }

    }
}
