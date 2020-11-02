using System.IO;

namespace VirtoCommerce.Platform.File.Operations
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
            if (System.IO.File.Exists(path))
            {
                string temp = TransactionFileUtils.GetTempFileName(Path.GetExtension(path));
                TransactionFileUtils.EnsureTempFolderExists();
                System.IO.File.Copy(path, temp);
                backupPath = temp;
            }

            System.IO.File.Delete(path);
        }
    }
}
