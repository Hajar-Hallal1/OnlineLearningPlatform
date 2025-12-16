namespace InternshipOnlineLearning.Dtos
{
    public class UserReadDto
    {
        //here we don't add passwords because we can't expose them (even if they're hashed)
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
