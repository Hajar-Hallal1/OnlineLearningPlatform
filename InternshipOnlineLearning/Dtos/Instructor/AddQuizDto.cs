using InternshipOnlineLearning.Dtos.Quiz;

namespace InternshipOnlineLearning.Dtos.Instructor
{
    public class AddQuizDto
    {
        public string Title { get; set; } = null!;
        public int CourseId { get; set; }
        public int PassingScore { get; set; }
        public int TimeLimit { get; set; }
        public List<QuestionDto> Questions { get; set; }
    }
}
