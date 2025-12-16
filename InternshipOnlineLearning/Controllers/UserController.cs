using InternshipOnlineLearning.Dtos;
using InternshipOnlineLearning.Entities;
using Microsoft.AspNetCore.Mvc;
using InternshipOnlineLearning.DatabaseContext;
using System.Net;

namespace InternshipOnlineLearning.Controllers
{
    [Route("[controller]")]
    public class UserController : Controller
    {
        [Route("GetUsers")]
        [HttpGet]
        public List<UserReadDto> Get()
        {
            var context = new LearnOnlineDBContext();

            
            return context.Users.Select(c => new UserReadDto
            {
                Id = c.Id,
                FullName = c.FullName,
                Email = c.Email,
                Role = c.Role,
                CreatedAt = DateTime.UtcNow

            }).ToList();
        }

        [Route("AddNewUsers")]
        [HttpPost]
        public HttpStatusCode Post(UserCreateDto u)
        {
            var context = new LearnOnlineDBContext();

            var userObj = new User
            {
                FullName = u.FullName,
                Email = u.Email,
                Role = u.Role,
                HashedPassword = BCrypt.Net.BCrypt.HashPassword(u.Password),
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(userObj);
            context.SaveChanges();
            return HttpStatusCode.OK;
        }

        [Route("UpdateUers")]
        [HttpPut]
        public HttpStatusCode Put(UserUpdateDto user)
        {
            var context = new LearnOnlineDBContext();

            var userObj = new User
            {
                Id = user.Id,
                FullName =user.FullName,
                Email = user.Email,
                Role = user.Role,
            };

            context.Users.Update(userObj);
            context.SaveChanges();
            return HttpStatusCode.OK;
        }

        [Route("DeleteCustomers")]
        [HttpDelete]
        public HttpStatusCode Delete(UserUpdateDto user)
        {
            var context = new LearnOnlineDBContext();

            var userObj = context.Users.First(c => c.Id == user.Id);

            context.Users.Remove(userObj);
            context.SaveChanges();
            return HttpStatusCode.OK;
        }

        [Route("GetUserById/{id}")]
        [HttpGet]
        public UserReadDto GetUserById(int id)
        {
            var context = new LearnOnlineDBContext();

            var user = context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null) return null;

            return new UserReadDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        // POST: ChangePassword
        [Route("ChangePassword/{id}")]
        [HttpPost]
        public HttpStatusCode ChangePassword(int id, UserChangePasswordDto dto)
        {
            var context = new LearnOnlineDBContext();

            var user = context.Users.FirstOrDefault(u => u.Id == id);
            if (user == null) return HttpStatusCode.NotFound;

            if (!BCrypt.Net.BCrypt.Verify(dto.OldPassword, user.HashedPassword))
                return HttpStatusCode.BadRequest;

            user.HashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
            context.SaveChanges();

            return HttpStatusCode.OK;
        }
    }
}