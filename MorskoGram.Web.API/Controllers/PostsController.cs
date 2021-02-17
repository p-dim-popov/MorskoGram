namespace MorskoGram.Web.API.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Net.Mime;
    using System.Text;
    using System.Text.Json;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using MorskoGram.Services;
    using MorskoGram.Web.ViewModels.Posts;

    [Authorize]
    [ApiController]
    [Route("/api/[controller]")]
    [Produces(MediaTypeNames.Application.Json)]
    public class PostsController : BaseController
    {
        private const int PostsShowCount = 5;
        private readonly IPostsService postsService;
        private readonly IDropboxService dropboxService;

        public PostsController(IPostsService postsService, IDropboxService dropboxService)
        {
            this.postsService = postsService;
            this.dropboxService = dropboxService;
        }

        [HttpGet("")]
        [HttpGet("user/{userId}")]
        public async Task<IEnumerable<ListPostsViewModel>> Get(
            [FromHeader] DateTime? referenceDate = null,
            [FromRoute] string userId = null,
            [FromQuery] int count = PostsShowCount
        )
            => userId is not null
                ? await this.postsService.GetFewForUserAsync<ListPostsViewModel>(userId, referenceDate, count)
                : await this.postsService.GetFewForFeed<ListPostsViewModel>(this.UserId, referenceDate, count);

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
                Description = model.Description,
                ImageId = imageId,
                ImageLink = imageLink,
            };
            var post = await this.postsService.CreateAsync<CreatePostDto, PostViewModel>(dto);
            return this.Created($"/api/[controller]/{post.Id}", post);
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

            return this.Content(JsonSerializer.Serialize(post, new JsonSerializerOptions // TODO: add as a singleton
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            }), MediaTypeNames.Application.Json, Encoding.UTF8);
        }

        [HttpPatch("{id:required}")]
        public async Task<IActionResult> Update([FromRoute] Guid? id, [FromForm] EditPostInputModel model)
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
                Id = id.Value,
                Description = model.Description,
                ModifiedOn = DateTime.UtcNow,
            };
            var post = await this.postsService.EditAsync<EditPostDto, PostViewModel>(dto);
            return this.Accepted($"/api/[controller]/{post.Id}", post);
        }

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
