namespace InternshipOnlineLearning.Dtos
{
    public class UserUpdateDto
    {
        //we separate the password change dto for security reasons

        //public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }
}
