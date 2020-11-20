using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace VirtoCommerce.Platform.Core.Jobs
{
    public interface IJobWorker
    {
        string Enqueue(Expression<Func<Task>> methodCall);
        string Enqueue(Expression<Action> methodCall);
        void Delete(string jobId);
    }
}
