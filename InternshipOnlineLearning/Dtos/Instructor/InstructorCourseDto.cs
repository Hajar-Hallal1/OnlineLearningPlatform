namespace InternshipOnlineLearning.Dtos.Instructor
{
    public class InstructorCourseDto
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int TotalLessons { get; set; }
        public int TotalStudents { get; set; }
    }
}
