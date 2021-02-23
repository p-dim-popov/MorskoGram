namespace MorskoGram.Web.API.Controllers
{
    using System.Reflection;
    using Microsoft.AspNetCore.Mvc;

    [ApiController]
    [Route("/api/[controller]")]
    public class VersionController
    {
        [HttpGet]
        public string Get() => Assembly
            .GetEntryAssembly()
            ?.GetCustomAttribute<AssemblyInformationalVersionAttribute>()
            ?.InformationalVersion;
    }
}
