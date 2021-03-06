﻿namespace MorskoGram.Web.API.Data.Seeding
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using MorskoGram.Common;
    using MorskoGram.Data.Models;
    using MorskoGram.Data.Seeding;

    public class UsersSeeder : ISeeder
    {
        public async Task SeedAsync(ApplicationDbContext dbContext, IServiceProvider serviceProvider)
        {
            if (await dbContext.Users.AnyAsync())
            {
                return;
            }

            var userManager = serviceProvider.GetService<UserManager<ApplicationUser>>();

            var configuration = serviceProvider.GetService<IConfiguration>();
            var password = configuration?.GetSection("BuiltInProfilesPassword").Value;

            var users = new ApplicationUser[]
                {
                    new()
                    {
                        UserName = "admin@localhost",
                        Email = "admin@localhost",
                    },
                    new()
                    {
                        UserName = "notadmin@localhost",
                        Email = "notadmin@localhost",
                    },
                    new()
                    {
                        UserName = "helper@localhost",
                        Email = "helper@localhost",
                    },
                }
                .Concat(Enumerable.Range(1, 10)
                    .Select(x => new ApplicationUser
                    {
                        UserName = $"air{x}@localhost",
                        Email = $"air{x}@localhost",
                    }))
                .Select(x =>
                {
                    x.EmailConfirmed = true;
                    return x;
                });

            foreach (var user in users)
            {
                // Should not be parallel because throws exception
                // System.InvalidOperationException: A second operation was started on this context before a previous operation completed. This is usually caused by different threads concurrently using the same instance of DbContext. For more information on how to avoid threading issues with DbContext, see https://go.microsoft.com/fwlink/?linkid=2097913.
                await SeedUserAsync(userManager, user, password);
            }
        }

        private static async Task SeedUserAsync(
            UserManager<ApplicationUser> userManager, ApplicationUser user, string password
        )
        {
            var result = await userManager
                .CreateAsync(user, password);

            if (!result.Succeeded)
            {
                Console.WriteLine(result);
            }
        }
    }
}
