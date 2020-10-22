using System.Linq;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Domain;
using VirtoCommerce.Platform.Security.Model;

namespace VirtoCommerce.Platform.Security.Repositories
{
    public class SecurityLiteDBRepository : ISecurityRepository
    {
        private readonly SecurityLiteDbContext _dbContext;
        public SecurityLiteDBRepository(SecurityLiteDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public virtual IQueryable<UserApiKeyEntity> UserApiKeys { get { return (IQueryable<UserApiKeyEntity>)_dbContext.Database.GetCollection<UserApiKeyEntity>().Query(); } }

        public IUnitOfWork UnitOfWork => throw new System.NotImplementedException();

        public void Add<T>(T item) where T : class
        {
            _dbContext.Database.GetCollection<T>().Insert(item);
        }

        public void Attach<T>(T item) where T : class
        {
            _dbContext.Database.GetCollection<T>().Upsert(item);
        }

        public void Dispose()
        {
            throw new System.NotImplementedException();
        }

        public void Remove<T>(T item) where T : class
        {
            _dbContext.Database.GetCollection<T>().Delete(((IEntity)item).Id);
        }

        public void Update<T>(T item) where T : class
        {
            _dbContext.Database.GetCollection<T>().Update(item);
        }
    }
}
