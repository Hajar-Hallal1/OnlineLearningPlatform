using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InternshipOnlineLearning.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentTracking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StudentId",
                table: "QuizAttempts",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudentId",
                table: "LessonCompletions",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuizAttempts_StudentId",
                table: "QuizAttempts",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_LessonCompletions_StudentId",
                table: "LessonCompletions",
                column: "StudentId");

            migrationBuilder.AddForeignKey(
                name: "FK_LessonCompletions_AspNetUsers_StudentId",
                table: "LessonCompletions",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_QuizAttempts_AspNetUsers_StudentId",
                table: "QuizAttempts",
                column: "StudentId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonCompletions_AspNetUsers_StudentId",
                table: "LessonCompletions");

            migrationBuilder.DropForeignKey(
                name: "FK_QuizAttempts_AspNetUsers_StudentId",
                table: "QuizAttempts");

            migrationBuilder.DropIndex(
                name: "IX_QuizAttempts_StudentId",
                table: "QuizAttempts");

            migrationBuilder.DropIndex(
                name: "IX_LessonCompletions_StudentId",
                table: "LessonCompletions");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "QuizAttempts");

            migrationBuilder.DropColumn(
                name: "StudentId",
                table: "LessonCompletions");
        }
    }
}
