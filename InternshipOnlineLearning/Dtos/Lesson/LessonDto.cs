namespace InternshipOnlineLearning.Dtos.Lesson
{
    public class LessonDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public string VideoUrl { get; set; } = null!;
        public int EstimatedDuration { get; set; }
        public int LessonOrder { get; set; }
    }
}
