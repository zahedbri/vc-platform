using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using VirtoCommerce.DataModule.Data.DynamicProperties;
using VirtoCommerce.DataModule.Data.Licensing;
using VirtoCommerce.Platform.Core;
using VirtoCommerce.Platform.Core.ChangeLog;
using VirtoCommerce.Platform.Core.ExportImport;
using VirtoCommerce.Platform.Core.Localizations;
using VirtoCommerce.Platform.Core.Modularity;
using VirtoCommerce.Platform.Core.Notifications;
using VirtoCommerce.Platform.Core.Settings;
using VirtoCommerce.Platform.Data.ChangeLog;
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
            //services.AddDbContext<PlatformDbContext>((sp, options) => options.UseSqlServer(sp.GetRequiredService<IConfiguration>().GetConnectionString("VirtoCommerce")));
            services.AddDbContext<PlatformDbContext>((sp, options) => options.UseInMemoryDatabase("VirtoCommerce"));
            services.AddTransient<IPlatformRepository, PlatformRepository>();
            services.AddTransient<Func<IPlatformRepository>>(provider => () => provider.CreateScope().ServiceProvider.GetService<IPlatformRepository>());

            services.AddSettings();

            services.AddDynamicProperties();

            services.AddTransient<IChangeLogService, ChangeLogService>();
            services.AddTransient<ILastModifiedDateTime, ChangeLogService>();
            services.AddTransient<IChangeLogSearchService, ChangeLogSearchService>();

            services.AddScoped<IPlatformExportImportManager, PlatformExportImportManager>();

            services.AddTransient<IEmailSender, DefaultEmailSender>();

            //Register dependencies for translation
            services.AddOptions<TranslationOptions>().Configure(options =>
            {
                options.PlatformTranslationFolderPath = HostConfiguration.MapPath(options.PlatformTranslationFolderPath);
            });

            services.AddSingleton<ITranslationDataProvider, PlatformTranslationDataProvider>();
            services.AddSingleton<ITranslationDataProvider, ModulesTranslationDataProvider>();
            services.AddSingleton<ITranslationService, TranslationService>();

            services.AddSingleton<LicenseProvider>();


            
        }

        public void PostInitialize(IApplicationBuilder app)
        {
            var settingsRegistrar = app.ApplicationServices.GetRequiredService<ISettingsRegistrar>();
            settingsRegistrar.RegisterSettings(AllSettings, "Platform");
            settingsRegistrar.RegisterSettingsForType(UserProfile.AllSettings, typeof(UserProfile).Name);

            var settingsManager = app.ApplicationServices.GetRequiredService<ISettingsManager>();

            var sendDiagnosticData = settingsManager.GetValue(Setup.SendDiagnosticData.Name, (bool)Setup.SendDiagnosticData.DefaultValue);
            if (!sendDiagnosticData)
            {
                var licenseProvider = app.ApplicationServices.GetRequiredService<LicenseProvider>();
                var license = licenseProvider.GetLicense();

                if (license == null || license.ExpirationDate < DateTime.UtcNow)
                {
                    settingsManager.SetValue(Setup.SendDiagnosticData.Name, true);
                }
            }
        }

        public void Uninstall()
        {
            // do nothing in here
        }

    }
}
