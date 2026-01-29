using InternshipOnlineLearning.Dtos.Lesson;

namespace InternshipOnlineLearning.Dtos.Instructor
{
    public class InstructorCourseDetailsDto
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = null!;
        public List<LessonDto> Lessons { get; set; } = new();
        public List<QuizResultDto> QuizResults { get; set; } = new();
    }
}
