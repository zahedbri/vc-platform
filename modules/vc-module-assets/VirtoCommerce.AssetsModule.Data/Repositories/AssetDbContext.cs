using EntityFrameworkCore.Triggers;
using Microsoft.EntityFrameworkCore;
using VirtoCommerce.AssetsModule.Data.Model;

namespace VirtoCommerce.AssetsModule.Data.Repositories
{
    public class AssetDbContext : DbContextWithTriggers
    {
        public AssetDbContext(DbContextOptions<AssetDbContext> options)
            : base(options)
        {
        }

        protected AssetDbContext(DbContextOptions options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            #region Assets

            modelBuilder.Entity<AssetEntryEntity>().ToTable("AssetEntry").HasKey(x => x.Id);
            modelBuilder.Entity<AssetEntryEntity>().Property(x => x.Id).HasMaxLength(128).ValueGeneratedOnAdd();
            modelBuilder.Entity<AssetEntryEntity>().Property(x => x.CreatedBy).HasMaxLength(64);
            modelBuilder.Entity<AssetEntryEntity>().Property(x => x.ModifiedBy).HasMaxLength(64);
            modelBuilder.Entity<AssetEntryEntity>().HasIndex(x => new { x.RelativeUrl, x.Name })
                .IsUnique(false)
                .HasName("IX_AssetEntry_RelativeUrl_Name");

            #endregion

            base.OnModelCreating(modelBuilder);
        }

    }


}
