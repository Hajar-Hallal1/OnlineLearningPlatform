using InternshipOnlineLearning.DatabaseContext;
using InternshipOnlineLearning.Dtos;
using InternshipOnlineLearning.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace InternshipOnlineLearning.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InstructorController : ControllerBase
    {
        private readonly LearnOnlineDBContext _context;

        public InstructorController(LearnOnlineDBContext context)
        {
            _context = context;
        }

        [HttpPost("AddCourse")]
        public async Task<IActionResult> AddCourse(AddCourseDto dto)
        {
            // 1️⃣ Check instructor exists
            var instructor = await _context.Users
                .FirstOrDefaultAsync(u => u.UserName == dto.Instructor);

            if (instructor == null)
                return BadRequest("Instructor does not exist");

            // 2️⃣ Create course
            var course = new Course
            {
                Title = dto.Title,
                Description = dto.Description,
                ShortDescription = dto.ShortDescription,
                Duration = dto.Duration,
                Level = dto.Level,
                Price = dto.Price,
                Category = dto.Category,
                ImageUrl = dto.ImageUrl,
                InstructorId = instructor.Id
            };

            // 3️⃣ Save
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();

            // 4️⃣ Load instructor for response
            await _context.Entry(course)
                .Reference(c => c.Instructor)
                .LoadAsync();

            return Ok(course);
        }



















        //[HttpPost("AddCourse")]
        //public async Task<IActionResult> AddCourse([FromBody] Course course)
        //{
        //    // Pick an existing instructor (temporary until login is implemented)
        //    var instructor = await _context.Users
        //        .FirstOrDefaultAsync(u => u.UserName == "SAM"); // replace with any existing instructor
        //    if (instructor == null)
        //        return BadRequest("Instructor not found");

        //    // 2️⃣ Assign the instructor ID
        //    course.InstructorId = instructor.Id;

        //    // 3️⃣ Add course to DB
        //    _context.Courses.Add(course);
        //    await _context.SaveChangesAsync();

        //    // 4️⃣ Load navigation property so we can return instructor info
        //    await _context.Entry(course).Reference(c => c.Instructor).LoadAsync();

        //    return Ok(course);
        //}

    }
}
