namespace InternshipOnlineLearning.Dtos.Quiz
{
    public class QuestionDto
    {
        public string Text { get; set; } = null!;
        public List<AnswerDto> Options { get; set; } = new();
    }
}
