namespace MorskoGram.Data.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using MorskoGram.Data.Common;
    using MorskoGram.Data.Common.Models;

    public class Conversation: BaseModel<Guid>, IAuditInfo
    {
        [Required]
        public virtual ICollection<ApplicationUser> Members { get; set; } = new HashSet<ApplicationUser>();

        public virtual ICollection<Message> Messages { get; set; } = new HashSet<Message>();
    }
}
