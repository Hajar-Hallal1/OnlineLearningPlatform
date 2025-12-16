using InternshipOnlineLearning.DatabaseContext;
using InternshipOnlineLearning.Entities;
using System.ComponentModel.DataAnnotations;

namespace InternshipOnlineLearning
{
    public class Test
    {
        public static void TestDB()
        {
            var context = new LearnOnlineDBContext();

            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();

            List<User> users = new List<User>()
            {
                new User{FullName= "hallal", Email="hallal@youtube", HashedPassword="hshshs", Role="student"},
                new User{FullName= "hallal", Email="hallal@youtube", HashedPassword="hshshs", Role="instructor"},
                new User{FullName= "hallal", Email="hallal@youtube", HashedPassword="hshshs", Role="admin"},
                new User{FullName= "hallal", Email="hallal@youtube", HashedPassword="hshshs", Role="student"},
                new User{FullName= "hallal", Email="hallal@youtube", HashedPassword="hshshs", Role="student"},
            };
            context.Users.AddRange(users);

            context.SaveChanges();
        }
     }
}
