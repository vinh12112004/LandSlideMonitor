using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LandslideMonitor.Migrations
{
    /// <inheritdoc />
    public partial class addfieldUnitsymbolforsensortype : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "UnitSymbol",
                table: "SensorTypes",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UnitSymbol",
                table: "SensorTypes");
        }
    }
}
