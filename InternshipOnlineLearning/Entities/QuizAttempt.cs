using System.ComponentModel.DataAnnotations.Schema;

namespace InternshipOnlineLearning.Entities
{
    public class QuizAttempt
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Quiz")]
        public int QuizId { get; set; }
        public virtual Quiz Quiz { get; set; }

        //[ForeignKey("USer")]
        //public int UserId { get; set; }
        //public virtual User User { get; set; }

        public int Score { get; set; }
        public bool IsPassed { get; set; }
        public DateTime AttemptDate { get; set; }
    }
}
