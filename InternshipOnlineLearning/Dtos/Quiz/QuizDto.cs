namespace InternshipOnlineLearning.Dtos.Quiz
{
    public class QuizDto
    {
        public int QuizId { get; set; }
        public string Title { get; set; } = null!;
        public int PassingScore { get; set; }
        public int TimeLimit { get; set; }
    }
}
