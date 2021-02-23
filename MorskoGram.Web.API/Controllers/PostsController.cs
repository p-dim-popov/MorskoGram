namespace MorskoGram.Web.API.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Net.Mime;
    using System.Text;
    using System.Text.Json;
    using System.Threading.Tasks;
    using IdentityServer4.Extensions;
    using Microsoft.AspNetCore.Authentication;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using MorskoGram.Services;
    using MorskoGram.Web.ViewModels.Posts;

    [ApiController]
    [Route("/api/[controller]")]
    [Produces(MediaTypeNames.Application.Json)]
    public class PostsController : BaseController
    {
        private const int PostsShowCount = 5;
        private readonly IPostsService postsService;
        private readonly IDropboxService dropboxService;

        public PostsController(
            IPostsService postsService,
            IDropboxService dropboxService,
            IUsersService usersService,
            JsonSerializerOptions jsonSerializerOptions)
            : base(jsonSerializerOptions, usersService)
        {
            this.postsService = postsService;
            this.dropboxService = dropboxService;
        }

        [HttpGet("")]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> Get(
            [FromQuery] DateTime? referenceDate = null,
            [FromRoute] string userId = null,
            [FromQuery] int count = PostsShowCount
        )
        {
            if (userId is not null)
            {
                return this.Json(await this.postsService.GetFewForUserAsync<ListPostsViewModel>(
                    userId, referenceDate, count
                ));
            }

            if (await this.IsUserAuthenticated())
            {
                return this.Json(await this.postsService.GetFewForFeed<ListPostsViewModel>(
                    this.UserId, referenceDate, count
                ));
            }

            // When db is cleared old accounts are still logged in
            // and cookies need to be cleared in order to work
            // return await this.UnauthorizedWithSignOutAsync();
            return this.Unauthorized();
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] CreatePostInputModel model)
        {
            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            var imageId = Guid.NewGuid();
            var imageLink = await this.dropboxService.UploadAsync(imageId, model.Image.OpenReadStream());
            var dto = new CreatePostDto
            {
                CreatorId = this.UserId,
                Caption = model.Caption,
                ImageId = imageId,
                ImageLink = imageLink,
            };
            var post = await this.postsService.CreateAsync<CreatePostDto, PostViewModel>(dto);
            return this.Created(post.Id.ToString(), post);
        }

        [HttpGet("{id:required}")]
        public async Task<IActionResult> Read(Guid? id = null)
        {
            if (id is null)
            {
                return this.NotFound();
            }

            var post = await this.postsService.GetByIdAsync<PostViewModel>(id.Value);

            if (post is null)
            {
                return this.NotFound();
            }

            return this.Json(post);
        }

        [Authorize]
        [HttpPatch("{id:required}")]
        public async Task<IActionResult> Update([FromRoute] Guid? id, [FromBody] EditPostInputModel model)
        {
            if (id is null)
            {
                return this.BadRequest();
            }

            if (!await this.postsService.IsUserPostOwnerAsync(this.UserId, id.Value))
            {
                return this.Unauthorized();
            }

            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            var dto = new EditPostDto
            {
                Caption = model.Caption,
            };
            var post = await this.postsService.EditAsync<EditPostDto, PostViewModel>(id.Value, dto);
            return this.Accepted(post);
        }

        [Authorize]
        [HttpDelete("{id:required}")]
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id is null)
            {
                return this.BadRequest();
            }

            if (!await this.postsService.IsUserPostOwnerAsync(this.UserId, id.Value))
                // WARN: Enters this case when post is already deleted
            {
                return this.Unauthorized();
            }

            await this.postsService.DeleteAsync(id);
            return this.Ok();
        }
    }
}
