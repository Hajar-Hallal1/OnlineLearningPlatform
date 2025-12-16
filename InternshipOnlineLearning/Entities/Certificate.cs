using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternshipOnlineLearning.Entities
{
    [PrimaryKey("Id")]
    public class Certificate
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Course")]
        public int CourseId { get; set; }
        public virtual Course Course { get; set; }

        [ForeignKey("User")]
        public int UserId { get; set; }
        public virtual User User { get; set; }

        public string DownloadUrl { get; set; }
        public DateTime GeneratedAt { get; set; }
    }
}
