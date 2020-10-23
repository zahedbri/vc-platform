using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore.Migrations;
using VirtoCommerce.Platform.Core.Common;

namespace VirtoCommerce.Platform.Data.Extensions
{
    public static class DatabaseFacadeExtensions
    {
        public static void MigrateIfNotApplied(this DatabaseFacade databaseFacade, string targetMigration)
        {
            if (databaseFacade.IsRelationalDatabase())
            {
                var connectionTimeout = databaseFacade.GetDbConnection().ConnectionTimeout;
                databaseFacade.SetCommandTimeout(connectionTimeout);

                var platformMigrator = databaseFacade.GetService<IMigrator>();
                var appliedMigrations = databaseFacade.GetAppliedMigrations();
                if (!appliedMigrations.Any(x => x.EqualsInvariant(targetMigration)))
                {
                    platformMigrator.Migrate(targetMigration);
                }
            }
        }

        public static void MigrateIfRelationalDatabase(this DatabaseFacade databaseFacade)
        {
            if (databaseFacade.IsRelationalDatabase())
            {
                databaseFacade.Migrate();
            }
        }
            

        public static bool IsRelationalDatabase(this DatabaseFacade databaseFacade)
        {
            var dependencies = ((IDatabaseFacadeDependenciesAccessor)databaseFacade).Dependencies;

            return dependencies is IRelationalDatabaseFacadeDependencies;
        }
    }
}
