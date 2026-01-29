namespace InternshipOnlineLearning.Dtos.Course
{
    public class CourseListDto
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = null!;
        public string InstructorName { get; set; } = null!;
        public string Description { get; set; } = null!;
    }
}
