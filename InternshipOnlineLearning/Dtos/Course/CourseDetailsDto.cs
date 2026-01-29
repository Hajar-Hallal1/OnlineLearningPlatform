namespace InternshipOnlineLearning.Dtos.Course
{
    public class CourseDetailsDto
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string InstructorName { get; set; } = null!;
        public int TotalLessons { get; set; }
        public bool IsEnrolled { get; set; }
    }
}
