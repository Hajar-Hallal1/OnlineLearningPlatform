using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternshipOnlineLearning.Migrations
{
    /// <inheritdoc />
    public partial class quizUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QuestionType",
                table: "Questions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "QuestionType",
                table: "Questions",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
