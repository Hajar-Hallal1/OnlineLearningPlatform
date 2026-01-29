namespace InternshipOnlineLearning.Dtos
{
    public class InstructorStatsDto
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int TotalCourses { get; set; }
        public int TotalStudents { get; set; }
        public double QuizAverageScore { get; set; }
        public string TopQuizTitle { get; set; }
        public string LowQuizTitle { get; set; }
    }
}
