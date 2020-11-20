using System;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Hangfire;
using VirtoCommerce.Platform.Core.Jobs;

namespace VirtoCommerce.HangfireModule.Web
{
    public class HangfireJobWorker : IJobWorker
    {
        public void Delete(string jobId)
        {
            BackgroundJob.Delete(jobId);
        }

        public string Enqueue(Expression<Func<Task>> methodCall)
        {
            return BackgroundJob.Enqueue(methodCall);
        }

        public string Enqueue(Expression<Action> methodCall)
        {
            return BackgroundJob.Enqueue(methodCall);
        }
    }
}
