using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Domain;
using VirtoCommerce.Platform.Data.Repositories;

namespace VirtoCommerce.Platform.Data.Infrastructure
{
    public class LiteDBRepositoryBase
    {
        public LiteDBRepositoryBase(ILiteDbContext dbContext, IUnitOfWork unitOfWork = null)
        {
            DbContext = dbContext;
            UnitOfWork = unitOfWork ?? new LiteDbContextUnitOfWork(dbContext);
        }

        public IUnitOfWork UnitOfWork { get; private set; }
        protected ILiteDbContext DbContext;

        public void Add<T>(T item) where T : class
        {
            DbContext.Database.GetCollection<T>().Insert(item);
        }

        public void Attach<T>(T item) where T : class
        {
            DbContext.Database.GetCollection<T>().Upsert(item);
        }

        // The bulk of the clean-up code is implemented in Dispose(bool)
        public void Dispose()
        {
            //if (DbContext != null)
            //{
            //    DbContext.Database.Dispose();
            //    DbContext = null;
            //    //UnitOfWork = null;
            //}
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
