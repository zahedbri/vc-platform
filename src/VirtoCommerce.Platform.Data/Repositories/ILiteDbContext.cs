using LiteDB;

namespace VirtoCommerce.Platform.Data.Repositories
{
    public interface ILiteDbContext
    {
        LiteDatabase Database { get; }
    }
}
