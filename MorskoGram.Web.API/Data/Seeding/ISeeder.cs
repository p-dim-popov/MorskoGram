namespace MorskoGram.Data.Seeding
{
    using System;
    using System.Threading.Tasks;
    using MorskoGram.Web.API.Data;

    public interface ISeeder
    {
        Task SeedAsync(ApplicationDbContext dbContext, IServiceProvider serviceProvider);
    }
}
