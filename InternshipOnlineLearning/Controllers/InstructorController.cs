using InternshipOnlineLearning.DatabaseContext;
using InternshipOnlineLearning.Dtos;
using InternshipOnlineLearning.Dtos.Instructor;
using InternshipOnlineLearning.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Options;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InternshipOnlineLearning.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class InstructorController : ControllerBase
    {
        private readonly LearnOnlineDBContext _context;
        private readonly UserManager<IdentityUser> _userManager;

        public InstructorController(UserManager<IdentityUser> userManager, LearnOnlineDBContext context)
        {
            _context = context;
            _userManager = userManager;
        }

        [Authorize(Roles = "Instructor,Admin")]
        [HttpPost("AddCourse")]
        public async Task<IActionResult> AddCourse([FromBody] AddCourseDto dto)
        {
            try
            {
                foreach (var claim in User.Claims)
                {
                    Console.WriteLine($"Claim type: {claim.Type}, value: {claim.Value}");
                }
                var userEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);
                Console.WriteLine(userEmail);
                var instructor = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
                if (instructor == null)
                    return BadRequest("Instructor not found");

                // Create the course
                var course = new Course
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    ShortDescription = dto.ShortDescription,
                    Duration = dto.Duration,
                    Level = dto.Level,
                    Price = dto.Price,
                    Category = dto.Category,
                    ImageUrl = string.IsNullOrEmpty(dto.ImageUrl)
                        ? "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop"
                        : dto.ImageUrl,
                    InstructorId = instructor.Id
                };

                _context.Courses.Add(course);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    course.Id,
                    course.Title,
                    course.ShortDescription,
                    course.Description,
                    course.Duration,
                    course.Level,
                    course.Price,
                    course.Category,
                    course.ImageUrl,
                    instructor = instructor.UserName
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [Authorize(Roles = "Instructor,Admin")]
        [HttpGet("MyCourses")]
        public async Task<IActionResult> GetMyCourses()
        {
            // Email is stored in "sub"
            var email = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(email))
                return Unauthorized("No email found in token");

            var instructor = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (instructor == null)
                return BadRequest("Instructor not found");

            var courses = await _context.Courses
                .Where(c => c.InstructorId == instructor.Id)
                .Select(c => new GetCourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    ShortDescription = c.ShortDescription,
                    Description = c.Description,
                    Duration = c.Duration,
                    Level = c.Level,
                    Price = c.Price,
                    Category = c.Category,
                    ImageUrl = c.ImageUrl,
                    Instructor = instructor.UserName
                })
                .ToListAsync();

            return Ok(courses);
        }

        [Authorize(Roles = "Instructor")]
        [HttpPost("course/{courseId}/lessons")]
        public async Task<IActionResult> AddLesson(int courseId, AddLessonDto dto)
        {

            var instructorEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .FirstOrDefaultAsync(c => c.Id == courseId && c.Instructor.Email == instructorEmail);

            if (course == null)
                return Unauthorized("Not your course");

            var lesson = new Lesson
            {
                CourseId = courseId,
                Title = dto.Title,
                VideoUrl = dto.VideoUrl,
                Content = dto.Content,
                LessonOrder = dto.LessonOrder,
                CreatedAt = DateTime.UtcNow
            };

            _context.Lessons.Add(lesson);
            await _context.SaveChangesAsync();

            return Ok(lesson);
        }

        [Authorize(Roles = "Instructor")]
        [HttpGet("course/{courseId}/lessons")]
        public async Task<IActionResult> GetCourseLessons(int courseId)
        {
            var instructorEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .FirstOrDefaultAsync(c => c.Id == courseId && c.Instructor.Email == instructorEmail);

            if (course == null)
                return Unauthorized();

            var lessons = await _context.Lessons
                .Where(l => l.CourseId == courseId)
                .OrderBy(l => l.LessonOrder)
                .Select(l => new {
                    l.Id,
                    l.Title,
                    l.Content,
                    l.VideoUrl,
                    l.LessonOrder
                })
                .ToListAsync();

            return Ok(lessons);
        }

        [HttpGet("InstructorStudents")]
        [Authorize(Roles = "Instructor")]
        public async Task<IActionResult> GetInstructorStudents()
        {
            var instructorEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(instructorEmail))
                return Unauthorized("Instructor email not found");

            // 2️⃣ Find instructor ID from Users table
            var instructor = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == instructorEmail);

            if (instructor == null)
                return Unauthorized("Instructor not found");

            var instructorId = instructor.Id;

            // 2️⃣ Fetch courses taught by this instructor
            var myCourses = await _context.Courses
                .Where(c => c.InstructorId == instructorId)
                .ToListAsync();

            var courseIds = myCourses.Select(c => c.Id).ToList();

            // 3️⃣ Fetch enrollments for these courses
            var enrollments = await _context.Enrollments
                .Where(e => courseIds.Contains(e.CourseId))
                .ToListAsync();

            var studentIds = enrollments.Select(e => e.StudentId).Distinct().ToList();

            // 4️⃣ Fetch students info from Users table
            var students = await _context.Users
                .Where(u => studentIds.Contains(u.Id))
                .Select(u => new { u.Id, u.UserName, u.Email })
                .ToListAsync();

            // 5️⃣ Map each enrollment to student + course title
            var result = enrollments.Select(e =>
            {
                var student = students.FirstOrDefault(s => s.Id == e.StudentId);
                var course = myCourses.FirstOrDefault(c => c.Id == e.CourseId);

                if (student == null || course == null) return null;

                return new
                {
                    StudentName = student.UserName,
                    StudentEmail = student.Email,
                    CourseTitle = course.Title
                };
            })
            .Where(x => x != null)
            .ToList();

            return Ok(result);
        }



        [Authorize(Roles = "Instructor")]
        [HttpPost("course/{courseId}/quiz")]
        public async Task<IActionResult> AddQuiz(int courseId, AddQuizDto dto)
        {
            var instructorEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .FirstOrDefaultAsync(c => c.Id == courseId && c.Instructor.Email == instructorEmail);

            if (course == null)
                return Unauthorized();

            var quiz = new Quiz
            {
                CourseId = courseId,
                Title = dto.Title,
                PassingScore = dto.PassingScore,
                TimeLimit = dto.TimeLimit,
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();


            // 4️⃣ Add questions and options
            foreach (var q in dto.Questions)
            {
                var question = new Question
                {
                    QuizId = quiz.Id,
                    QuestionText = q.Text
                };
                _context.Questions.Add(question);
                await _context.SaveChangesAsync();

                foreach (var o in q.Options)
                {
                    _context.Answers.Add(new Answer
                    {
                        QuestionId = question.Id,
                        AnswerText = o.Text,
                        IsCorrect = o.IsCorrect
                    });
                }
            }

            await _context.SaveChangesAsync();

            //return Ok(quiz);
            return Ok(new { message = "Quiz added successfully" });

        }

        [Authorize(Roles = "Instructor")]
        [HttpGet("course/{courseId}/quizzes")]
        public async Task<IActionResult> GetCourseQuizzes(int courseId)
        {
            var instructorEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var course = await _context.Courses
                .Include(c => c.Instructor)
                .FirstOrDefaultAsync(c =>
                    c.Id == courseId &&
                    c.Instructor.Email == instructorEmail);

            if (course == null)
                return Unauthorized();

            var quizzes = await _context.Quizzes
                .Where(q => q.CourseId == courseId)
                .Select(q => new { q.Id, q.Title, q.PassingScore, q.TimeLimit })
                .ToListAsync();

            return Ok(quizzes);
        }


        [Authorize(Roles = "Instructor")]
        [HttpGet("course/{courseId}/quiz-results")]
        public async Task<IActionResult> GetQuizResults(int courseId)
        {
            var instructorEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var course = await _context.Courses
                .Include(c => c.Instructor)
                .FirstOrDefaultAsync(c => c.Id == courseId && c.Instructor.Email == instructorEmail);

            if (course == null)
                return Unauthorized();

            var results = await _context.QuizAttempts
                .Where(a => a.Quiz.CourseId == courseId)
                .Select(a => new
                {
                    Student = a.Quiz.Course.Enrollments
                        .First().Student.UserName,
                    a.Score,
                    a.IsPassed,
                    a.AttemptDate
                })
                .ToListAsync();

            return Ok(results);
        }

        [Authorize(Roles = "Instructor,Admin")]
        [HttpPut("EditCourse/{courseId}")]
        public async Task<IActionResult> EditCourse(int courseId, [FromBody] UpdateCourseDto dto)
        {
            var userEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var instructor = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);

            if (instructor == null)
                return Unauthorized("Instructor not found");

            var course = await _context.Courses.FirstOrDefaultAsync(c => c.Id == courseId && c.InstructorId == instructor.Id);

            if (course == null)
                return Unauthorized("Not your course or course does not exist");

            course.Title = dto.Title;
            course.Description = dto.Description;
            course.ShortDescription = dto.ShortDescription;
            course.Duration = dto.Duration;
            course.Level = dto.Level;
            course.Price = dto.Price;
            course.Category = dto.Category;
            course.ImageUrl = string.IsNullOrEmpty(dto.ImageUrl)
                ? course.ImageUrl
                : dto.ImageUrl;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                course.Id,
                course.Title,
                course.ShortDescription,
                course.Description,
                course.Duration,
                course.Level,
                course.Price,
                course.Category,
                course.ImageUrl,
                instructor = instructor.UserName
            });
        }

        [Authorize(Roles = "Instructor,Admin")]
        [HttpDelete("DeleteCourse/{courseId}")]
        public async Task<IActionResult> DeleteCourse(int courseId)
        {
            var userEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var instructor = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);

            if (instructor == null)
                return Unauthorized("Instructor not found");

            var course = await _context.Courses
                .FirstOrDefaultAsync(c => c.Id == courseId && c.InstructorId == instructor.Id);

            if (course == null)
                return Unauthorized("Not your course or course does not exist");

            // Delete related lessons
            var lessons = await _context.Lessons.Where(l => l.CourseId == courseId).ToListAsync();
            _context.Lessons.RemoveRange(lessons);

            // Delete related quizzes
            var quizzes = await _context.Quizzes.Where(q => q.CourseId == courseId).ToListAsync();
            _context.Quizzes.RemoveRange(quizzes);

            // Delete related enrollments
            var enrollments = await _context.Enrollments.Where(e => e.CourseId == courseId).ToListAsync();
            _context.Enrollments.RemoveRange(enrollments);

            // Delete the course itself
            _context.Courses.Remove(course);

            await _context.SaveChangesAsync();

            return Ok(new { message = "Course deleted successfully" });
        }



    }
}






















