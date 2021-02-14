namespace MorskoGram.Data.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using MorskoGram.Data.Common;
    using MorskoGram.Data.Common.Models;

    public class Like: BaseModel<Guid>, IAuditInfo
    {
        [Required]
        public virtual ApplicationUser Giver { get; set; }

        [Required]
        public virtual Post Post { get; set; }
    }
}
