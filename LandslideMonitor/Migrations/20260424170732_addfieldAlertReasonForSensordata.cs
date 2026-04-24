using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LandslideMonitor.Migrations
{
    /// <inheritdoc />
    public partial class addfieldAlertReasonForSensordata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AlertReason",
                table: "SensorDatas",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AlertReason",
                table: "SensorDatas");
        }
    }
}
