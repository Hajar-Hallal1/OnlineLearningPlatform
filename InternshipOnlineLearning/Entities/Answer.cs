using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;


//Stores all possible answers for a question , Shared by all users , Does not depend on students
namespace InternshipOnlineLearning.Entities
{
    [PrimaryKey("Id")]
    public class Answer
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Question")]
        public int QuestionId { get; set; }
        public virtual Question? Question { get; set; }

        public string AnswerText { get; set; }
        public bool IsCorrect { get; set; }
    }
}
