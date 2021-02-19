using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.EntityFrameworkCore;
using MorskoGram.Web.API.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MorskoGram.Web.API
{
    using System;
    using System.Reflection;
    using System.Text.RegularExpressions;
    using Dropbox.Api;
    using MorskoGram.Data.Common.Repositories;
    using MorskoGram.Data.Models;
    using MorskoGram.Services;
    using MorskoGram.Services.Implementations;
    using MorskoGram.Services.Mapping;
    using MorskoGram.Web.API.Data.Repositories;
    using MorskoGram.Web.API.Data.Seeding;
    using MorskoGram.Web.ViewModels;
    using MorskoGram.Web.ViewModels.Posts;

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                var uriRegex =
                    new Regex(
                        @"^(?:(?<protocol>[^:\/?#\s]+):\/{2})?(?<username>([^@\/?#\s]+))?:(?<password>([^@\/?#\s]+))?@(?<host>[^\/?#\s]+)?:(?<port>\d{1,5})?\/(?<database>([^?#\s]*))?\S*$");
                var uri = Environment.GetEnvironmentVariable("DATABASE_URL") is not null
                    ? Environment.GetEnvironmentVariable("DATABASE_URL")
                    : this.Configuration.GetConnectionString("Postgres");
                var match = uriRegex.Match(uri);
                var connectionString = $"server={match.Groups["host"]};" +
                                       $"username={match.Groups["username"]};" +
                                       $"password={match.Groups["password"]};" +
                                       $"port={match.Groups["port"]};" +
                                       $"database={match.Groups["database"]};" +
                                       $"sslmode=Require;" +
                                       $"Trust Server Certificate=true";
                options.UseNpgsql(connectionString);
            });

            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
                .AddEntityFrameworkStores<ApplicationDbContext>();

            services.AddIdentityServer()
                .AddApiAuthorization<ApplicationUser, ApplicationDbContext>();

            services.AddAuthentication()
                .AddIdentityServerJwt();

            services.AddControllersWithViews()
                .AddRazorRuntimeCompilation();
            services.AddRazorPages();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/build"; });

            services.AddSingleton(this.Configuration);

            // Data Repositories
            services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));

            services.AddScoped(_ => new DropboxClient(Environment.GetEnvironmentVariable("DROPBOX_ACCESS_TOKEN") is not null
                ? Environment.GetEnvironmentVariable("DROPBOX_ACCESS_TOKEN")
                : this.Configuration.GetSection("DropboxAccessToken").Value));

            // Data Services
            services.AddTransient<IDropboxService, DropboxService>();
            services.AddTransient<IPostsService, PostsService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            AutoMapperConfig.RegisterMappings(
                typeof(ListPostsViewModel).GetTypeInfo().Assembly // Get the view models assembly
            );

            // Seed data on application startup
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var dbContext = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                dbContext.Database.Migrate();
                new ApplicationDbContextSeeder()
                    .SeedAsync(dbContext, serviceScope.ServiceProvider)
                    .GetAwaiter()
                    .GetResult();
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            if (Environment.GetEnvironmentVariable("USE_HTTPS_REDIRECTION") is not null)
            {
                app.UseHttpsRedirection();
            }
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseIdentityServer();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
