namespace MorskoGram.Data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using MorskoGram.Data.Common;
    using MorskoGram.Data.Common.Models;

    public class Follow: BaseModel<Guid>, IAuditInfo
    {
        [Required]    
        public string FollowerId { get; set; }
        public virtual ApplicationUser Follower { get; set; }


        [Required]
        public string FollowedId { get; set; }
        public virtual ApplicationUser Followed { get; set; }
    }
}
