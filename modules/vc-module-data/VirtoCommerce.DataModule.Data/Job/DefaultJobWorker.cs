using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using VirtoCommerce.Platform.Core.Jobs;

namespace VirtoCommerce.DataModule.Data.Job
{
    public class DefaultJobWorker : IJobWorker
    {
        public void Delete(string jobId)
        {
            //Nothing
        }

        public string Enqueue(Expression<Func<Task>> methodCall)
        {
            var func = methodCall.Compile();
            func.Invoke();
            return string.Empty;
        }

        public string Enqueue(Expression<Action> methodCall)
        {
            var action = methodCall.Compile();
            action.Invoke();
            return string.Empty;
        }
    }
}
