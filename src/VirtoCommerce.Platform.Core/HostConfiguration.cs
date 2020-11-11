using System;
using System.IO;

namespace VirtoCommerce.Platform.Core
{
    public static class HostConfiguration
    {
        public static string WebRootPath { get; set; }

        public static string ContentRootPath { get; set; }

        public static bool IsDevelopment { get; set; }


        public static string GetRelativePath(string basePath, string path)
        {
            var basePathuri = new Uri(MapPath(basePath));
            var pathUri = new Uri(path);
            return "/" + basePathuri.MakeRelativeUri(pathUri).ToString();
        }

        public static string MapPath(string path)
        {
            var result = WebRootPath;

            if (path.StartsWith("~/"))
            {
                result = Path.Combine(result, path.Replace("~/", string.Empty).Replace('/', Path.DirectorySeparatorChar));
            }
            else if (Path.IsPathRooted(path))
            {
                result = path;
            }

            return result;
        }
    }
}
