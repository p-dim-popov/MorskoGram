namespace MorskoGram.Services
{
    using System.Threading.Tasks;

    public interface IUsersService
    {
        Task<bool> IsExistent(string id);
    }
}
