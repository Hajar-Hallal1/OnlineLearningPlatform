using InternshipOnlineLearning.DatabaseContext;
using InternshipOnlineLearning.Dtos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InternshipOnlineLearning.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly LearnOnlineDBContext _context;

        public CoursesController(LearnOnlineDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCourses()
        {
            var courses = await _context.Courses
                .Include(c => c.Instructor)
                .Select(c => new GetCourseDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    ShortDescription = c.ShortDescription,
                    Description = c.Description,
                    Level = c.Level,
                    Category = c.Category,
                    ImageUrl = c.ImageUrl,
                    Duration = c.Duration,
                    Price = c.Price,
                    Instructor = c.Instructor.UserName
                })
                .ToListAsync();

            return Ok(courses);
        }
    }
}
