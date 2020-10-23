using System.Threading.Tasks;
using VirtoCommerce.Platform.Core.Domain;
using VirtoCommerce.Platform.Data.Repositories;

namespace VirtoCommerce.Platform.Data.Infrastructure
{
    public class LiteDbContextUnitOfWork : IUnitOfWork
    {
        public LiteDbContextUnitOfWork(ILiteDbContext context)
        {
            DbContext = context;
        }

        public ILiteDbContext DbContext { get; private set; }

        public int Commit()
        {
            return 1;
        }

        public Task<int> CommitAsync()
        {
            return Task.FromResult(1);
        }
    }
}
