using Microsoft.AspNetCore.Identity;
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
        public string Description { get; set; } = null!;
        public string Level { get; set; } = null!;
        public string Category { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;
        public string Duration { get; set; } = null!;
        public decimal Price { get; set; }

        // Identity relation
        public string InstructorId { get; set; } = null!;
        public IdentityUser Instructor { get; set; } = null!;
        
       
        
        
        //public bool IsPublished { get; set; }
        //public int EnrollmentCount { get; set; }
        //public DateTime CreatedAt { get; set; }
        


        //[ForeignKey("User")]
        //public int CreatedBy { get; set; }

        //public virtual User User { get; set; }
    }
}
