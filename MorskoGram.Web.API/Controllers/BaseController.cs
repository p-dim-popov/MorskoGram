namespace MorskoGram.Web.API.Controllers
{
    using System.Net.Mime;
    using System.Security.Claims;
    using System.Text;
    using System.Text.Json;
    using System.Threading.Tasks;
    using IdentityServer4.Extensions;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Mvc;
    using MorskoGram.Services;

    public abstract class BaseController : ControllerBase
    {
        private readonly JsonSerializerOptions jsonSerializerOptions;
        protected readonly IUsersService usersService;

        protected BaseController(JsonSerializerOptions jsonSerializerOptions, IUsersService usersService)
        {
            this.jsonSerializerOptions = jsonSerializerOptions;
            this.usersService = usersService;
        }

        protected string UserId
            => this.User.FindFirstValue(ClaimTypes.NameIdentifier);

        public override string ToString()
            => this.GetType().Name.Replace("Controller", string.Empty);

        protected IActionResult Json<T>(T data) => this.Content(
            JsonSerializer.Serialize(data, jsonSerializerOptions),
            MediaTypeNames.Application.Json,
            Encoding.UTF8);

        protected async Task<bool> IsUserAuthenticated()
            => this.UserId is not null
               && await this.usersService.IsExistent(this.UserId)
               && this.User.IsAuthenticated();

        public async Task<UnauthorizedResult> UnauthorizedWithSignOutAsync()
        {
            await this.HttpContext.SignOutAsync();
            return base.Unauthorized();
        }

        /// <summary>
        /// Creates an OkObjectResult object that produces an Status200OK response.
        /// </summary>
        /// <param name="value">Defaults to null</param>
        /// <returns>OkObjectResult</returns>
        protected new OkObjectResult Ok(object value = null) => base.Ok(value ?? new object());
    }
}
