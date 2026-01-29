namespace InternshipOnlineLearning.Dtos
{
    public class StudentCourseDto
    {
        public int CourseId { get; set; }
        public string Title { get; set; }
        public double ProgressPercent { get; set; }
        public string? LastLessonTitle { get; set; }
    }
}
