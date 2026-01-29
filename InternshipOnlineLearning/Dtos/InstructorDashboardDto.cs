namespace InternshipOnlineLearning.Dtos
{
    public class InstructorDashboardDto
    {
        public string InstructorId { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }

        public int CoursesCount { get; set; }
        public int EnrolledStudents { get; set; }

        public double QuizAverageScore { get; set; }

        public string? TopQuizTitle { get; set; }
        public double? TopQuizScore { get; set; }

        public string? LowQuizTitle { get; set; }
        public double? LowQuizScore { get; set; }
    }

}
