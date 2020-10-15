using System;
using Microsoft.Extensions.Logging;

namespace VirtoCommerce.Platform.Core.Extensions
{
    public static class LoggerExtensions
    {
        readonly static DateTime StartedAt = DateTime.Now;

        public static void HardLog(this ILogger Logger, string text)
        {
            var msg = $@"-----------------Thr [{System.Threading.Thread.CurrentThread.ManagedThreadId}] --------------- [{DateTime.Now.Subtract(StartedAt)}]-----{text}";
            Logger.LogInformation(msg);
        }
    }
}
