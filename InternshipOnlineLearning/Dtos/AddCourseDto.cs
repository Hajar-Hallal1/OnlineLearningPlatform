namespace InternshipOnlineLearning.Dtos
{
    public class AddCourseDto
    {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string ShortDescription { get; set; } = null!;
        public string Duration { get; set; } = null!;
        public string Level { get; set; } = null!;
        public decimal Price { get; set; }
        public string Category { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;
    }
}
