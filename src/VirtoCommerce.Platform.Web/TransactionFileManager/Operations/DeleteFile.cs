using System.IO;
using VirtoCommerce.Platform.Web.TransactionFileManager;

namespace VirtoCommerce.Platform.Web.TransactionFileManager.Operations
{
    /// <summary>
    /// Rollbackable operation which deletes a file. An exception is not thrown if the file does not exist.
    /// </summary>
    sealed class DeleteFile : SingleFileOperation
    {
        /// <summary>
        /// Instantiates the class.
        /// </summary>
        /// <param name="path">The file to be deleted.</param>
        public DeleteFile(string path)
            : base(path)
        {
        }

        public override void Execute()
        {
            if (File.Exists(path))
            {
                var temp = TransactionFileUtils.GetTempFileName(Path.GetExtension(path));
                TransactionFileUtils.EnsureTempFolderExists();
                File.Copy(path, temp);
                backupPath = temp;
            }

            File.Delete(path);
        }
    }
}
