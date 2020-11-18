using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using VirtoCommerce.Platform.Core.Jobs;

namespace VirtoCommerce.DataModule.Data.Job
{
    public class BackgroundJobWorker : IJob
    {
        public void Delete(string jobId)
        {
            throw new NotImplementedException();
        }

        public string Enqueue(Expression<Func<Task>> methodCall)
        {
            methodCall.Compile();
            return string.Empty;
        }
    }
}
