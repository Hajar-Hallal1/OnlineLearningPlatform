using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace InternshipOnlineLearning.Entities

{
    [PrimaryKey("Id")]
    public class User
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string HashedPassword { get; set; }
        public string Role {  get; set; }
        public DateTime CreatedAt { get; set; }

        public ICollection<Certificate> Certificates { get; set; }
        public ICollection<Enrollment> Enrollments { get; set; }

        public ICollection<LessonCompletion> LessonCompletions { get; set; }

        public ICollection<QuizAttempt> QuizAttempts { get; set; }


    }
}
