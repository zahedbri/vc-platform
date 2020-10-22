using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Domain;
using VirtoCommerce.Platform.Data.Repositories;

namespace VirtoCommerce.Platform.Data.Infrastructure
{
    public class LiteDBRepositoryBase
    {
        public LiteDBRepositoryBase(ILiteDbContext liteDatabase)
        {
            DbContext = liteDatabase;
        }

        public IUnitOfWork UnitOfWork => throw new System.NotImplementedException();
        protected ILiteDbContext DbContext;

        public void Add<T>(T item) where T : class
        {
            DbContext.Database.GetCollection<T>().Insert(item);
        }

        public void Attach<T>(T item) where T : class
        {
            DbContext.Database.GetCollection<T>().Upsert(item);
        }

        public void Dispose()
        {
            throw new System.NotImplementedException();
        }

        public void Remove<T>(T item) where T : class
        {
            DbContext.Database.GetCollection<T>().Delete(((IEntity)item).Id);
        }

        public void Update<T>(T item) where T : class
        {
            DbContext.Database.GetCollection<T>().Update(item);
        }
    }
}
