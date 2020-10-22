using System;
using LiteDB;
using Microsoft.Extensions.Configuration;

namespace VirtoCommerce.Platform.Security.Repositories
{
    public class SecurityLiteDbContext
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

            LiteDatabase = new LiteDatabase(connectionString);
        }

        public SecurityLiteDbContext(LiteDatabase liteDatabase)
        {
            LiteDatabase = liteDatabase;
        }

        public LiteDatabase LiteDatabase { get; protected set; }
    }
}
