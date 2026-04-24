using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LandslideMonitor.Migrations
{
    /// <inheritdoc />
    public partial class addsensortype : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SensorType",
                table: "Thresholds",
                newName: "SensorTypeId");

            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Sensors",
                newName: "SensorTypeId");

            migrationBuilder.CreateTable(
                name: "SensorTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataKey = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SensorTypes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Thresholds_SensorTypeId",
                table: "Thresholds",
                column: "SensorTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Sensors_SensorTypeId",
                table: "Sensors",
                column: "SensorTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_SensorTypes_DataKey",
                table: "SensorTypes",
                column: "DataKey",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Sensors_SensorTypes_SensorTypeId",
                table: "Sensors",
                column: "SensorTypeId",
                principalTable: "SensorTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Thresholds_SensorTypes_SensorTypeId",
                table: "Thresholds",
                column: "SensorTypeId",
                principalTable: "SensorTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sensors_SensorTypes_SensorTypeId",
                table: "Sensors");

            migrationBuilder.DropForeignKey(
                name: "FK_Thresholds_SensorTypes_SensorTypeId",
                table: "Thresholds");

            migrationBuilder.DropTable(
                name: "SensorTypes");

            migrationBuilder.DropIndex(
                name: "IX_Thresholds_SensorTypeId",
                table: "Thresholds");

            migrationBuilder.DropIndex(
                name: "IX_Sensors_SensorTypeId",
                table: "Sensors");

            migrationBuilder.RenameColumn(
                name: "SensorTypeId",
                table: "Thresholds",
                newName: "SensorType");

            migrationBuilder.RenameColumn(
                name: "SensorTypeId",
                table: "Sensors",
                newName: "Type");
        }
    }
}
