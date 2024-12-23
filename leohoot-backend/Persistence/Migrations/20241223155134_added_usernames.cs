using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class added_usernames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Count",
                table: "StatisticAnswers");

            migrationBuilder.AddColumn<string>(
                name: "UserNames",
                table: "StatisticAnswers",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UserNames",
                table: "StatisticAnswers");

            migrationBuilder.AddColumn<int>(
                name: "Count",
                table: "StatisticAnswers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
