namespace MorskoGram.Services.Implementations
{
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using MorskoGram.Data.Common.Repositories;
    using MorskoGram.Data.Models;

    public class UsersService: IUsersService
    {
        private readonly IRepository<ApplicationUser> usersRepository;

        public UsersService(IRepository<ApplicationUser> usersRepository)
        {
            this.usersRepository = usersRepository;
        }

        public Task<bool> IsExistent(string id)
            => this.usersRepository
                .AllAsNoTracking()
                .AnyAsync(x => x.Id == id);
    }
}
