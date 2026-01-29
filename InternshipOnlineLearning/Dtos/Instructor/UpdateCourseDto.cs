namespace InternshipOnlineLearning.Dtos.Instructor
{
    public class UpdateCourseDto
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string ShortDescription { get; set; } = null!;
        public string Duration { get; set; } = null!;
        public string Level { get; set; } = "Beginner";
        public decimal Price { get; set; }
        public string Category { get; set; } = null!;
        public string? ImageUrl { get; set; }
    }
}
