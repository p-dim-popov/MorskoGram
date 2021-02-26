namespace MorskoGram.Services
{
    using System;
    using System.Threading.Tasks;
    using MorskoGram.Data.Models;
    using MorskoGram.Services.Mapping;

    public interface IUsersService
    {
        Task<bool> IsExistent(string id);
        Task<T> GetByEmail<T>(string email)
            where T : IMapFrom<ApplicationUser>;
    }
}
