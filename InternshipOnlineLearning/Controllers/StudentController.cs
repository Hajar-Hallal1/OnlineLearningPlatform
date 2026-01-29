using InternshipOnlineLearning.DatabaseContext;
using InternshipOnlineLearning.Dtos;
using InternshipOnlineLearning.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace InternshipOnlineLearning.Controllers
{
    [Authorize(Roles = "Student")]
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly LearnOnlineDBContext _context;

        public StudentController(LearnOnlineDBContext context)
        {
            _context = context;
        }

        [HttpGet("Dashboard")]
        public async Task<IActionResult> GetStudentDashboard()
        {
            var studentId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(studentId))
                return Unauthorized();

            
            // ENROLLMENTS
            
            var enrollments = await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Include(e => e.Course)
                .ToListAsync();

            
            // LESSON COMPLETIONS (ONCE)
            
            var lessonCompletions = await _context.LessonCompletions
                .Include(lc => lc.Lesson)
                .Where(lc => lc.StudentId == studentId)
                .ToListAsync();

            var enrolledCourses = enrollments.Select(e => new StudentCourseDto
            {
                CourseId = e.CourseId,
                Title = e.Course.Title,
                ProgressPercent = e.ProgressPercent,
                LastLessonTitle = lessonCompletions
                    .Where(lc => lc.Lesson.CourseId == e.CourseId)
                    .OrderByDescending(lc => lc.LastAccessed)
                    .Select(lc => lc.Lesson.Title)
                    .FirstOrDefault()
            }).ToList();

            
            // QUIZ ATTEMPTS
            
            var quizAttempts = await _context.QuizAttempts
                .Include(a => a.Quiz)
                .Where(a => a.StudentId == studentId)
                .ToListAsync();

            var scores = new StudentScoreSummaryDto
            {
                AverageScore = quizAttempts.Any()
                    ? quizAttempts.Average(a => a.Score)
                    : 0,
                TotalAttempts = quizAttempts.Count,
                PassedQuizzes = quizAttempts.Count(a => a.IsPassed)
            };

            
            // UPCOMING QUIZZES
            
            var attemptedQuizIds = quizAttempts
                .Select(a => a.QuizId)
                .ToList();

            var upcomingQuizzes = await _context.Quizzes
                .Include(q => q.Course)
                .Where(q =>
                    q.Course.Enrollments.Any(e => e.StudentId == studentId) &&
                    !attemptedQuizIds.Contains(q.Id)
                )
                .Select(q => new UpcomingQuizDto
                {
                    QuizId = q.Id,
                    QuizTitle = q.Title,
                    CourseTitle = q.Course.Title
                })
                .ToListAsync();

            return Ok(new StudentDashboardDto
            {
                EnrolledCourses = enrolledCourses,
                UpcomingQuizzes = upcomingQuizzes,
                Scores = scores
            });
        }

        [Authorize(Roles = "Student")]
        [HttpPost("enroll/{courseId}")]
        public async Task<IActionResult> Enroll(int courseId)
        {
            var email = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(email))
                return Unauthorized();

            // Get the actual StudentId from the database
            var student = await _context.Users
                .FirstOrDefaultAsync(s => s.Email == email);

            if (student == null)
                return Unauthorized();


            var courseExists = await _context.Courses.AnyAsync(c => c.Id == courseId);
            if (!courseExists)
                return NotFound("Course not found");

            var alreadyEnrolled = await _context.Enrollments.AnyAsync(e =>
                e.CourseId == courseId && e.StudentId == student.Id);

            if (alreadyEnrolled)
                return BadRequest("Already enrolled");

            _context.Enrollments.Add(new Enrollment
            {
                CourseId = courseId,
                StudentId = student.Id,
                EnrolledAt = DateTime.UtcNow,
                ProgressPercent = 0
            });

            await _context.SaveChangesAsync();

            return Ok(new { message = "Enrolled successfully" });
        }

        [Authorize(Roles = "Student")]
        [HttpGet("enrolled-courses")]
        public async Task<IActionResult> GetEnrolledCourses()
        {
            var studentEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(studentEmail))
                return Unauthorized();

            var student = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == studentEmail);

            if (student == null)
                return Unauthorized();

            var courses = await _context.Enrollments
                .Where(e => e.StudentId == student.Id)
                .Include(e => e.Course)
                .Select(e => new GetCourseDto
                {
                    Id = e.Course.Id,
                    Title = e.Course.Title,
                    ShortDescription = e.Course.ShortDescription,
                    Description = e.Course.Description,
                    Level = e.Course.Level,
                    Category = e.Course.Category,
                    ImageUrl = e.Course.ImageUrl,
                    Duration = e.Course.Duration,
                    Price = e.Course.Price,
                    Instructor = e.Course.Instructor.UserName
                })
                .ToListAsync();

            return Ok(courses);
        }



        //Get lessons for enrolled course
        [Authorize(Roles = "Student")]
        [HttpGet("course/{courseId}/lessons")]
        public async Task<IActionResult> GetLessons(int courseId)
        {
            var studentEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(studentEmail))
                return Unauthorized();

            var student = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == studentEmail);

            if (student == null)
                return Unauthorized();

            var enrolled = await _context.Enrollments.AnyAsync(e =>
                e.CourseId == courseId && e.StudentId == student.Id);

            if (!enrolled)
                return Unauthorized();

            var lessons = await _context.Lessons
                .Where(l => l.CourseId == courseId)
                .OrderBy(l => l.LessonOrder)
                .ToListAsync();

            return Ok(lessons);
        }

        //check enrollment
        [Authorize(Roles = "Student")]
        [HttpGet("course/{courseId}/is-enrolled")]
        public async Task<IActionResult> IsEnrolled(int courseId)
        {
            var studentEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(studentEmail))
                return Unauthorized();

            var student = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == studentEmail);

            if (student == null)
                return Unauthorized();

            var enrolled = await _context.Enrollments.AnyAsync(e =>
                e.CourseId == courseId && e.StudentId == student.Id);

            return Ok(enrolled);
        }


        //save lesson progress
        [Authorize(Roles = "Student")]
        [HttpPost("lesson/{lessonId}/complete")]
        public async Task<IActionResult> CompleteLesson(int lessonId)
        {
            var studentEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(studentEmail))
                return Unauthorized();

            var student = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == studentEmail);

            if (student == null)
                return Unauthorized();

            var existing = await _context.LessonCompletions
                .FirstOrDefaultAsync(lp => lp.LessonId == lessonId && lp.StudentId == student.Id);

            if (existing != null)
            {
                existing.IsCompleted = true;
            }
            else
            {
                _context.LessonCompletions.Add(new LessonCompletion
                {
                    LessonId = lessonId,
                    StudentId = student.Id,
                    IsCompleted = true
                });
            }

            await _context.SaveChangesAsync();
            return Ok();
        }



        //  Get all quizzes for a course (without showing correct answers)
        [HttpGet("course/{courseId}/quizzes")]
        public async Task<IActionResult> GetCourseQuizzes(int courseId)
        {
            var quizzes = await _context.Quizzes
                .Where(q => q.CourseId == courseId)
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Answers)
                .Select(q => new
                {
                    q.Id,
                    q.Title,
                    q.PassingScore,
                    q.TimeLimit,
                    Questions = q.Questions.Select(quest => new
                    {
                        quest.Id,
                        quest.QuestionText,
                        Answers = quest.Answers.Select(a => new
                        {
                            a.Id,
                            a.AnswerText
                            // no IsCorrect here
                        })
                    })
                })
                .ToListAsync();

            return Ok(quizzes);
        }

        // Submit a quiz attempt
        [HttpPost("quiz/{quizId}/attempt")]
        public async Task<IActionResult> SubmitQuiz(int quizId, [FromBody] List<QuizAnswerDto> answers)
        {
            var studentEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var student = await _context.Users.FirstOrDefaultAsync(s => s.Email == studentEmail);

            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.Id == quizId);

            if (quiz == null)
                return NotFound("Quiz not found");

                bool enrolled = await _context.Enrollments.AnyAsync(e =>
                    e.CourseId == quiz.CourseId && e.StudentId == student.Id);

                if (!enrolled)
                    return Unauthorized("You are not enrolled in this course");


                int score = 0;

            foreach (var answer in answers)
            {
                var question = quiz.Questions.FirstOrDefault(q => q.Id == answer.QuestionId);
                if (question != null)
                {
                    var correctAnswer = question.Answers.FirstOrDefault(a => a.IsCorrect);
                    if (correctAnswer != null && correctAnswer.Id == answer.AnswerId)
                        score++;
                }
            }

            int totalQuestions = quiz.Questions.Count;
            int percentage = totalQuestions == 0 ? 0 : (score * 100 / totalQuestions);

            var attempt = new QuizAttempt
            {
                QuizId = quizId,
                StudentId = student.Id,
                Score = percentage,
                IsPassed = percentage >= quiz.PassingScore,
                AttemptDate = DateTime.UtcNow
            };

            _context.QuizAttempts.Add(attempt);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Quiz submitted successfully",
                Score = percentage,
                Passed = attempt.IsPassed
            });
        }

        // View student's quiz attempts for a course
        [HttpGet("course/{courseId}/quiz-attempts")]
        public async Task<IActionResult> GetQuizAttempts(int courseId)
        {
            var studentEmail = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var student = await _context.Users.FirstOrDefaultAsync(s => s.Email == studentEmail);

            var attempts = await _context.QuizAttempts
                .Include(a => a.Quiz)
                .Where(a => a.StudentId == student.Id && a.Quiz.CourseId == courseId)
                .Select(a => new
                {
                    a.Id,
                    a.QuizId,
                    a.Quiz.Title,
                    a.Score,
                    a.IsPassed,
                    a.AttemptDate
                })
                .ToListAsync();

            return Ok(attempts);
        }
    }

    // DTO for submitting quiz answers
    public class QuizAnswerDto
    {
        public int QuestionId { get; set; }
        public int AnswerId { get; set; }
    }


}









               

       








