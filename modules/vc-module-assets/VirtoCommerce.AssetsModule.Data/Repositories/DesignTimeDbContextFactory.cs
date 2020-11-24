using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using VirtoCommerce.AssetsModule.Data.Repositories;

namespace VirtoCommerce.Platform.Data.Repositories
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AssetDbContext>
    {
        public AssetDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<AssetDbContext>();

            builder.UseSqlServer("Data Source=(local);Initial Catalog=VirtoCommerce3;Persist Security Info=True;User ID=virto;Password=virto;MultipleActiveResultSets=True;Connect Timeout=30");

            return new AssetDbContext(builder.Options);
        }
    }
}
