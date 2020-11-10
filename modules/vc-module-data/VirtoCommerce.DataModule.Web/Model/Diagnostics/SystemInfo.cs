using VirtoCommerce.DataModule.Data.Licensing;
using VirtoCommerce.DataModule.Web.Model.Modularity;

namespace VirtoCommerce.DataModule.Web.Model.Diagnostics
{
    public class SystemInfo
    {
        public string PlatformVersion { get; set; }
        public License License { get; set; }
        public ModuleDescriptor[] InstalledModules { get; set; }
        public string Version { get; set; }
        public bool Is64BitOperatingSystem { get; set; }
        public bool Is64BitProcess { get; set; }
    }
}
