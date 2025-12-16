using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

//Stores what a student selected , Linked to a specific quiz attempt , One row per question
namespace InternshipOnlineLearning.Entities
{
    [PrimaryKey("Id")]
    public class QuizAttemptAnswer
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("QuizAttempt")]
        public int QuizAttemptId { get; set; }
        public virtual QuizAttempt QuizAttempt { get; set; }

        [ForeignKey("Question")]
        public int QuestionId { get; set; }
        public virtual Question Question { get; set; }

        [ForeignKey("Answer")]
        public int? AnswerId { get; set; }   
        public virtual Answer Answer { get; set; }

        public string TextAnswer { get; set; } 
    }
}
