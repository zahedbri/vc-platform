using System.Linq;
using System.Threading.Tasks;
using VirtoCommerce.AssetsModule.Data.Model;
using VirtoCommerce.Platform.Core.Common;

namespace VirtoCommerce.AssetsModule.Data.Repositories
{
    public interface IAssetRepository : IRepository
    {
        IQueryable<AssetEntryEntity> AssetEntries { get; }

        Task<AssetEntryEntity[]> GetAssetsByIdsAsync(string[] ids);
    }
}
