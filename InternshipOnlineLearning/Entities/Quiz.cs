using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternshipOnlineLearning.Entities
{
    [PrimaryKey("Id")]
    public class Quiz
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Course")]
        public int CourseId { get; set; }
        public virtual Course Course { get; set; }

        [ForeignKey("Lesson")]
        public int? LessonId { get; set; }
        public virtual Lesson Lesson { get; set; }

        public string Title { get; set; }
        public int PassingScore { get; set; }
        public int TimeLimit { get; set; }

        public ICollection<QuizAttempt> QuizAttempts { get; set; }

    }
}
