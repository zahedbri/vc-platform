using System.Linq;
using VirtoCommerce.Platform.Data.Infrastructure;
using VirtoCommerce.Platform.Data.Repositories;
using VirtoCommerce.Platform.Security.Model;

namespace VirtoCommerce.Platform.Security.Repositories
{
    public class SecurityLiteDBRepository : LiteDBRepositoryBase, ISecurityRepository
    {
        public SecurityLiteDBRepository(ILiteDbContext dbContext) : base(dbContext)
        {
        }

        public virtual IQueryable<UserApiKeyEntity> UserApiKeys => DbContext.Database.GetCollection<UserApiKeyEntity>().FindAll().AsQueryable(); 
    }
}
