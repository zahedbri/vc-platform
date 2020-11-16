using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace VirtoCommerce.Platform.Core.Jobs
{
    public interface IJob
    {
        string Enqueue(Expression<Func<Task>> methodCall);
        void Delete(string jobId);
    }
}
