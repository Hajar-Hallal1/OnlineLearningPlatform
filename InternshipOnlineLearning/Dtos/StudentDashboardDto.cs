namespace InternshipOnlineLearning.Dtos
{
    public class StudentDashboardDto
    {
        public List<StudentCourseDto> EnrolledCourses { get; set; } = new();
        public List<UpcomingQuizDto> UpcomingQuizzes { get; set; } = new();
        public StudentScoreSummaryDto Scores { get; set; } = new();
    }
}
