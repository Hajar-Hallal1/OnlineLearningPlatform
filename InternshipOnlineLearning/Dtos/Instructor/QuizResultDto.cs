namespace InternshipOnlineLearning.Dtos.Instructor
{
    public class QuizResultDto
    {
        public string StudentName { get; set; } = null!;
        public int Score { get; set; }
        public bool IsPassed { get; set; }
        public DateTime AttemptDate { get; set; }
    }
}
