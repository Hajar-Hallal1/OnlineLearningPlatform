using InternshipOnlineLearning.DatabaseContext;
using InternshipOnlineLearning.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InternshipOnlineLearning.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly LearnOnlineDBContext _context;

        public AdminController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, LearnOnlineDBContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
        }

        // GET: api/Admin/Instructors
        [HttpGet("Instructors")]
        public async Task<IActionResult> GetAllInstructors()
        {
            var instructors = await _userManager.GetUsersInRoleAsync("Instructor");

            var instructorDtos = new List<InstructorStatsDto>();

            foreach (var instructor in instructors)
            {
                // Fetch courses created by this instructor
                var courses = await _context.Courses
                    .Where(c => c.InstructorId == instructor.Id)
                    .Include(c => c.Enrollments)
                    .Include(c => c.Quizzes)
                       .ThenInclude(q => q.QuizAttempts)
                    .ToListAsync();

                var totalCourses = courses.Count;
                var totalStudents = courses.Sum(c => c.Enrollments.Count);
                var allQuizAttempts = courses
                   .SelectMany(c => c.Quizzes)            // all quizzes for all courses
                   .SelectMany(q => q.QuizAttempts)       // all attempts for all quizzes
                   .ToList();

                var quizAverage = allQuizAttempts.Any()
                    ? allQuizAttempts.Average(a => a.Score)
                    : 0;

                string topQuizTitle = null;
                string lowQuizTitle = null;

                if (allQuizAttempts.Any())
                {
                    var topAttempt = allQuizAttempts.OrderByDescending(a => a.Score).First();
                    var lowAttempt = allQuizAttempts.OrderBy(a => a.Score).First();

                    topQuizTitle = topAttempt.Quiz.Title;
                    lowQuizTitle = lowAttempt.Quiz.Title;
                }

               


                instructorDtos.Add(new InstructorStatsDto
                {
                    Id = instructor.Id,
                    FullName = instructor.UserName,
                    Email = instructor.Email,
                    TotalCourses = totalCourses,
                    TotalStudents = totalStudents,
                    QuizAverageScore = quizAverage,
                    TopQuizTitle = topQuizTitle ?? "N/A",
                    LowQuizTitle = lowQuizTitle ?? "N/A"
                });
            }

            return Ok(instructorDtos);
        }

        // POST: api/Admin/Instructors
        [HttpPost("Instructors")]
        public async Task<IActionResult> AddInstructor([FromBody] AddInstructorDto model)
        {
            if (await _userManager.FindByEmailAsync(model.Email) != null)
                return BadRequest("Email already exists.");

            if (await _userManager.FindByNameAsync(model.FullName) != null)
                return BadRequest("Username already exists.");

            var newInstructor = new IdentityUser
            {
                UserName = model.FullName,
                Email = model.Email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(newInstructor, model.Password);

            if (!result.Succeeded)
                return BadRequest(result.Errors);

            // Assign "Instructor" role
            if (!await _roleManager.RoleExistsAsync("Instructor"))
            {
                await _roleManager.CreateAsync(new IdentityRole("Instructor"));
            }

            await _userManager.AddToRoleAsync(newInstructor, "Instructor");

            return Ok(new
            {
                message = "Instructor created successfully",
                instructor = new { newInstructor.Id, newInstructor.UserName, newInstructor.Email }
            });
        }
    }
}
