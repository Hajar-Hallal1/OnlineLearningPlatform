namespace InternshipOnlineLearning.Dtos
{
    public class AddCourseDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public string Duration { get; set; }
        public string Level { get; set; }
        public decimal Price { get; set; }
        public string Category { get; set; }
        public string ImageUrl { get; set; }

        // 👇 what you need now
        public string Instructor { get; set; }
    }
}
