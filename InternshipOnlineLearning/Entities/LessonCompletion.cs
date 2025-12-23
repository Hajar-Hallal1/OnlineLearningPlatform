using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternshipOnlineLearning.Entities
{
    [PrimaryKey("Id")]
    public class LessonCompletion
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Lesson")]
        public int LessonId { get; set; }
        public virtual Lesson Lesson { get; set; }

        //[ForeignKey("User")]
        //public int UserId { get; set; }
        //public virtual User User { get; set; }

        public bool IsCompleted { get; set; }
        public DateTime? CompletedDate { get; set; }
        public DateTime LastAccessed { get; set; }
    }
}
