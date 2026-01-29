namespace InternshipOnlineLearning.Dtos.Instructor
{
    public class AddLessonDto
    {
        public string Title { get; set; } = null!;
        public string VideoUrl { get; set; } = null!;
        public int EstimatedDuration { get; set; }
        public int LessonOrder { get; set; }
        public string Content { get; set; }
    }
}
