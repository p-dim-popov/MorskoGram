namespace MorskoGram.Data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using MorskoGram.Data.Common;
    using MorskoGram.Data.Common.Models;

    public class Message: BaseModel<Guid>, IAuditInfo
    {
        [Required, MaxLength(450)]
        public string Content { get; set; }

        public Guid ConversationId { get; set; }
        public virtual Conversation Conversation { get; set; }

        [Required]
        public string SenderId { get; set; }
        public virtual ApplicationUser Sender { get; set; }
    }
}
