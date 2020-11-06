using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using VirtoCommerce.Platform.Core.ExportImport;
using VirtoCommerce.Platform.Core.Localizations;
using VirtoCommerce.Platform.Core.Modularity;
using VirtoCommerce.Platform.Core.Settings;
using VirtoCommerce.Platform.Data.ExportImport;
using VirtoCommerce.Platform.Data.Localizations;
using VirtoCommerce.Platform.Data.Repositories;
using VirtoCommerce.Platform.Data.Settings;
using static VirtoCommerce.Platform.Core.PlatformConstants.Settings;

namespace VirtoCommerce.DataModule.Web
{
    public class Module : IModule
    {
        public ManifestModuleInfo ModuleInfo { get; set; }

        public void Initialize(IServiceCollection services)
        {
            services.AddDbContext<PlatformDbContext>(options => options.UseInMemoryDatabase("VirtoCommerce"));
            services.AddTransient<IPlatformRepository, PlatformRepository>();
            services.AddTransient<Func<IPlatformRepository>>(provider => () => provider.CreateScope().ServiceProvider.GetService<IPlatformRepository>());

            services.AddSettings();

            //services.AddDynamicProperties();

            //var inProcessBus = new InProcessBus();
            //services.AddSingleton<IHandlerRegistrar>(inProcessBus);
            //services.AddSingleton<IEventPublisher>(inProcessBus);
            //services.AddTransient<IChangeLogService, ChangeLogService>();
            //services.AddTransient<ILastModifiedDateTime, ChangeLogService>();
            //services.AddTransient<IChangeLogSearchService, ChangeLogSearchService>();

            //services.AddCaching(configuration);

            services.AddScoped<IPlatformExportImportManager, PlatformExportImportManager>();

            //services.AddTransient<IEmailSender, DefaultEmailSender>();


            //Register dependencies for translation
            services.AddSingleton<ITranslationDataProvider, PlatformTranslationDataProvider>();
            services.AddSingleton<ITranslationDataProvider, ModulesTranslationDataProvider>();
            services.AddSingleton<ITranslationService, TranslationService>();
        }

        public void PostInitialize(IApplicationBuilder app)
        {
            var settingsRegistrar = app.ApplicationServices.GetRequiredService<ISettingsRegistrar>();
            settingsRegistrar.RegisterSettings(AllSettings, "Platform");
            settingsRegistrar.RegisterSettingsForType(UserProfile.AllSettings, typeof(UserProfile).Name);
        }

        public void Uninstall()
        {
            // do nothing in here
        }

    }
}
