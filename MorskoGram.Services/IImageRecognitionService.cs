namespace MorskoGram.Services
{
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    public interface IImageRecognitionService
    {
        Task<bool> ImageIsDescribedByAsync(IEnumerable<string> descriptions, byte[] image);

        public class AllowedImageTags
        {
            public ICollection<string> List { get; init; }
        }
    }
}
