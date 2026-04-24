using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LandslideMonitor.Migrations
{
    /// <inheritdoc />
    public partial class AddThresholdDataKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DataKey",
                table: "Thresholds",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataKey",
                table: "Thresholds");
        }
    }
}
