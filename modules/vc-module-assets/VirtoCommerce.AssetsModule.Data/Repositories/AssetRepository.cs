using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VirtoCommerce.AssetsModule.Data.Model;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Data.Infrastructure;

namespace VirtoCommerce.AssetsModule.Data.Repositories
{
    public class AssetRepository : DbContextRepositoryBase<AssetDbContext>, IAssetRepository
    {
        public AssetRepository(AssetDbContext dbContext)
            : base(dbContext)
        {
        }

        public IQueryable<AssetEntryEntity> AssetEntries => DbContext.Set<AssetEntryEntity>();

        public async Task<AssetEntryEntity[]> GetAssetsByIdsAsync(string[] ids)
        {
            if (ids.IsNullOrEmpty())
            {
                return Array.Empty<AssetEntryEntity>();
            }

            return await AssetEntries.Where(x => ids.Contains(x.Id)).ToArrayAsync();
        }
    }
}
