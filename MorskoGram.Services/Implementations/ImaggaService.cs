// ReSharper disable InconsistentNaming
namespace MorskoGram.Services.Implementations
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text;
    using System.Text.Json;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using RestSharp;

    public class ImaggaService : IImageRecognitionService
    {
        private const string BaseUrl = "https://api.imagga.com/v2/";
        private const string Tags = "tags";
        private const string Uploads = "uploads";

        private readonly IRestClient restClient;
        private readonly IServiceProvider serviceProvider;
        private readonly JsonSerializerOptions jsonSerializerOptions;

        public ImaggaService(
            IRestClient restClient,
            IConfiguration configuration,
            IServiceProvider serviceProvider,
            JsonSerializerOptions jsonSerializerOptions)
        {
            this.jsonSerializerOptions = jsonSerializerOptions;
            this.restClient = restClient;
            this.serviceProvider = serviceProvider;
            var imaggaApi = configuration
                .GetSection("Imagga")
                .GetSection("Api");
            var apiKey = imaggaApi.GetSection("Key").Value;
            var apiSecret = imaggaApi.GetSection("Secret").Value;

            this.restClient.Timeout = -1;
            this.restClient.BaseUrl = new Uri(BaseUrl);
            this.restClient.AddDefaultHeader(
                "Authorization",
                $"Basic {Convert.ToBase64String(Encoding.UTF8.GetBytes($"{apiKey}:{apiSecret}"))}"
            );
        }

        private IRestRequest CreateRestRequest(string resource)
        {
            var request = this.serviceProvider.GetService<IRestRequest>();
            if (request is null)
            {
                throw new InvalidOperationException("RestRequest instance not provided!");
            }

            request.Resource = resource;
            return request;
        }

        /// <summary>
        /// Response success:
        /// {
        ///   "result":{
        ///     "tags":[
        ///       {
        ///         "confidence":100,
        ///         "tag":{
        ///           "en":"liner"
        ///         }
        ///       },
        ///       {
        ///         "confidence":100,
        ///         "tag":{
        ///           "en":"passenger ship"
        ///         }
        ///       }
        ///     ]
        ///   },
        ///   "status":{
        ///     "text":"",
        ///     "type":"success"
        ///   }
        /// }
        /// Response error:
        /// {
        ///     "status":{
        ///         "text":"Unexpected error while running the classification job.",
        ///         "type":"error"
        ///     }
        /// }
        /// </summary>
        /// <param name="descriptions"></param>
        /// <param name="image"></param>
        /// <returns></returns>
        /// <exception cref="InvalidOperationException"></exception>
        public async Task<bool> ImageIsDescribedByAsync(IEnumerable<string> descriptions, byte[] image)
        {
            var uploadId = await this.UploadFileAsync(image);

            var request = this.CreateRestRequest(Tags)
                .AddParameter("image_upload_id", uploadId);

            var response = await this.restClient
                .ExecuteAsync<Response>(request);
            return response.Data.result.tags
                .Any(x => x.confidence >= 30 && descriptions.Contains(x.tag["en"]));
        }

        private async Task<string> UploadFileAsync(byte[] image)
        {
            var request = this.CreateRestRequest(Uploads)
                .AddParameter("image_base64", Convert.ToBase64String(image));
            var uploadResponse =
                await this.restClient.ExecutePostAsync<Dictionary<string, Dictionary<string, string>>>(request);
            return uploadResponse.Data["result"]["upload_id"];
        }

        private class Tag
        {
            public double confidence { get; set; }
            public Dictionary<string, string> tag { get; set; }
        }

        private class Result
        {
            public List<Tag> tags { get; set; }
        }

        private class Status
        {
            public string text { get; set; }
            public string type { get; set; }
        }

        private class Response
        {
            public Result result { get; set; }
            public Status status { get; set; }
        }
    }
}
