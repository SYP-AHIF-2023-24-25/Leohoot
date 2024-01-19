using LeohootBackend;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace leohoot_backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedDatabaseMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                             table: "Users",
                             columns: new[] { "Username", "Password" },
                             values: new object[] { "test", "test" });

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
