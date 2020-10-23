using System.ComponentModel.DataAnnotations;

namespace VirtoCommerce.Platform.Core.Common
{
    public class NullableUrlAttribute : ValidationAttribute
    {
        /// <summary>
        /// Returns true if url is empty or valid.
        /// </summary>
        public override bool IsValid(object value)
        {
            if (value == null)
            {
                return true;
            }
            if (string.IsNullOrEmpty(value.ToString()))
            {
                return true;
            }
            UrlAttribute url = new UrlAttribute();
            return url.IsValid(value);
        }

    }
}
