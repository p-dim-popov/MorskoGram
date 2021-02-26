namespace MorskoGram.Services.Implementations
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using MorskoGram.Data.Common.Repositories;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

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

        public Task<T> GetByIdAsync<T>(Guid id)
            where T : IMapFrom<ApplicationUser>
            => this.usersRepository
                .AllAsNoTracking()
                .Where(x => x.Id == id.ToString())
                .To<T>()
                .FirstOrDefaultAsync();
    }
}
