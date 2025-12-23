using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace InternshipOnlineLearning.Entities
{
    [PrimaryKey("Id")]
    public class Course
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Title { get; set; }
        public string ShortDescription { get; set; }
        public string LongDescription { get; set; }
        public string Category { get; set; }
        public string Difficulty { get; set; }
        public string Thumbnail { get; set; }
        public bool IsPublished { get; set; }
        public int EnrollmentCount { get; set; }
        public DateTime CreatedAt { get; set; }

        //[ForeignKey("User")]
        //public int CreatedBy { get; set; }

        //public virtual User User { get; set; }
    }
}
