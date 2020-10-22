using System;
using LiteDB;
using Microsoft.Extensions.Configuration;
using VirtoCommerce.Platform.Data.Repositories;

namespace VirtoCommerce.Platform.Security.Repositories
{
    public class SecurityLiteDbContext : ILiteDbContext
    {
        public LiteDatabase Database { get; }

        public SecurityLiteDbContext(IConfiguration configuration)
        {
            string connectionString;
            try
            {
                connectionString = configuration.GetConnectionString("LiteDBConnection");
            }
            catch (NullReferenceException)
            {
                throw new NullReferenceException("No connection string defined in appsettings.json");
            }

            Database = new LiteDatabase(connectionString);
        }

        public SecurityLiteDbContext(LiteDatabase liteDatabase)
        {
            Database = liteDatabase;
        }
    }
}
