// ReSharper disable VirtualMemberCallInConstructor
namespace MorskoGram.Data.Models
{
    using System;
    using System.Collections.Generic;
    using Microsoft.AspNetCore.Identity;
    using MorskoGram.Data.Common;

    public class ApplicationUser : IdentityUser, IAuditInfo
    {
        public ApplicationUser()
            {
                this.Id = Guid.NewGuid().ToString();
                this.Roles = new HashSet<IdentityUserRole<string>>();
                this.Claims = new HashSet<IdentityUserClaim<string>>();
                this.Logins = new HashSet<IdentityUserLogin<string>>();
            }

            // Audit info
            public DateTime CreatedOn { get; set; }

            public DateTime? ModifiedOn { get; set; }

            public virtual ICollection<IdentityUserRole<string>> Roles { get; set; }

            public virtual ICollection<IdentityUserClaim<string>> Claims { get; set; }

            public virtual ICollection<IdentityUserLogin<string>> Logins { get; set; }

            public virtual ICollection<Post> Posts { get; set; } = new HashSet<Post>();

            public virtual ICollection<Conversation> Conversations { get; set; } = new HashSet<Conversation>();

            public virtual ICollection<Message> SentMessages { get; set; } = new HashSet<Message>();

            public virtual ICollection<Comment> Comments { get; set; } = new HashSet<Comment>();

            public virtual ICollection<Like> Likes { get; set; } = new HashSet<Like>();
            
            public virtual ICollection<Follow> Followers { get; set; } = new HashSet<Follow>();

            public virtual ICollection<Follow> Followings { get; set; } = new HashSet<Follow>();
    }
}
