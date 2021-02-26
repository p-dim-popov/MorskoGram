namespace MorskoGram.Web.API.Controllers
{
    using System;
    using System.Net.Mime;
    using System.Text.Json;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using MorskoGram.Services;
    using MorskoGram.Web.ViewModels.Users;

    [ApiController]
    [Route("/api/[controller]")]
    [Produces(MediaTypeNames.Application.Json)]
    public class UsersController : BaseController
    {
        private readonly IFollowsService followsService;

        public UsersController(
            JsonSerializerOptions jsonSerializerOptions,
            IUsersService usersService,
            IFollowsService followsService)
            : base(jsonSerializerOptions, usersService)
        {
            this.followsService = followsService;
        }

        [HttpGet("{email:required}")]
        public async Task<IActionResult> Get(string email)
        {
            if (email is null)
            {
                return this.BadRequest();
            }

            return this.Json(await this.usersService.GetByEmail<UserViewModel>(email));
        }

        [Authorize]
        [HttpPost("follow/{id:required}")]
        public async Task<IActionResult> ToggleFollow(Guid? id)
        {
            if (id is null)
            {
                return this.BadRequest();
            }

            if (id.ToString() == this.UserId)
            {
                return this.BadRequest();
            }

            await this.followsService.ToggleFollowAsync(this.UserId, id.Value);

            return this.Ok();
        }
    }
}
