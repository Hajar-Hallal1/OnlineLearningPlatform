using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternshipOnlineLearning.Entities
{
    [PrimaryKey("Id")]
    public class Lesson
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Course")]
        public int CourseId { get; set; }

        public virtual Course Course { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public string VideoUrl { get; set; }
        public int LessonOrder { get; set; }
        public int EstimatedDuration { get; set; }
        public string Type { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
