using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistence.Migrations
{
    /// <inheritdoc />
    public partial class replaced_id_with_username : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FavoriteQuizzes_Users_UserId",
                table: "FavoriteQuizzes");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "FavoriteQuizzes",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "FavoriteQuizzes",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_FavoriteQuizzes_Users_UserId",
                table: "FavoriteQuizzes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FavoriteQuizzes_Users_UserId",
                table: "FavoriteQuizzes");

            migrationBuilder.DropColumn(
                name: "Username",
                table: "FavoriteQuizzes");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "FavoriteQuizzes",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_FavoriteQuizzes_Users_UserId",
                table: "FavoriteQuizzes",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
