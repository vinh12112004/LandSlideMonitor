using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LandslideMonitor.Migrations
{
    /// <inheritdoc />
    public partial class refactorsensorandthreshold : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Sensors_SensorTypes_SensorTypeId",
                table: "Sensors");

            migrationBuilder.DropForeignKey(
                name: "FK_Thresholds_SensorTypes_SensorTypeId",
                table: "Thresholds");

            migrationBuilder.DropIndex(
                name: "IX_Sensors_SensorTypeId",
                table: "Sensors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SensorTypes",
                table: "SensorTypes");

            migrationBuilder.DropColumn(
                name: "ActionType",
                table: "Thresholds");

            migrationBuilder.DropColumn(
                name: "MaxValue",
                table: "Thresholds");

            migrationBuilder.DropColumn(
                name: "SensorTypeId",
                table: "Sensors");

            migrationBuilder.RenameTable(
                name: "SensorTypes",
                newName: "ChannelDefinition");

            migrationBuilder.RenameColumn(
                name: "SensorTypeId",
                table: "Thresholds",
                newName: "channelDefinitionid");

            migrationBuilder.RenameColumn(
                name: "MinValue",
                table: "Thresholds",
                newName: "ThresholdValue");

            migrationBuilder.RenameIndex(
                name: "IX_Thresholds_SensorTypeId",
                table: "Thresholds",
                newName: "IX_Thresholds_channelDefinitionid");

            migrationBuilder.RenameIndex(
                name: "IX_SensorTypes_DataKey",
                table: "ChannelDefinition",
                newName: "IX_ChannelDefinition_DataKey");

            migrationBuilder.AddColumn<byte>(
                name: "Level",
                table: "Thresholds",
                type: "tinyint",
                nullable: false,
                defaultValue: (byte)0);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Thresholds",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ChannelDefinition",
                table: "ChannelDefinition",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "SensorChannels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SensorId = table.Column<int>(type: "int", nullable: false),
                    ChannelDefinitionId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SensorChannels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SensorChannels_ChannelDefinition_ChannelDefinitionId",
                        column: x => x.ChannelDefinitionId,
                        principalTable: "ChannelDefinition",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SensorChannels_Sensors_SensorId",
                        column: x => x.SensorId,
                        principalTable: "Sensors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SensorChannels_ChannelDefinitionId",
                table: "SensorChannels",
                column: "ChannelDefinitionId");

            migrationBuilder.CreateIndex(
                name: "IX_SensorChannels_SensorId_ChannelDefinitionId",
                table: "SensorChannels",
                columns: new[] { "SensorId", "ChannelDefinitionId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Thresholds_ChannelDefinition_channelDefinitionid",
                table: "Thresholds",
                column: "channelDefinitionid",
                principalTable: "ChannelDefinition",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Thresholds_ChannelDefinition_channelDefinitionid",
                table: "Thresholds");

            migrationBuilder.DropTable(
                name: "SensorChannels");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ChannelDefinition",
                table: "ChannelDefinition");

            migrationBuilder.DropColumn(
                name: "Level",
                table: "Thresholds");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "Thresholds");

            migrationBuilder.RenameTable(
                name: "ChannelDefinition",
                newName: "SensorTypes");

            migrationBuilder.RenameColumn(
                name: "channelDefinitionid",
                table: "Thresholds",
                newName: "SensorTypeId");

            migrationBuilder.RenameColumn(
                name: "ThresholdValue",
                table: "Thresholds",
                newName: "MinValue");

            migrationBuilder.RenameIndex(
                name: "IX_Thresholds_channelDefinitionid",
                table: "Thresholds",
                newName: "IX_Thresholds_SensorTypeId");

            migrationBuilder.RenameIndex(
                name: "IX_ChannelDefinition_DataKey",
                table: "SensorTypes",
                newName: "IX_SensorTypes_DataKey");

            migrationBuilder.AddColumn<int>(
                name: "ActionType",
                table: "Thresholds",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double>(
                name: "MaxValue",
                table: "Thresholds",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "SensorTypeId",
                table: "Sensors",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SensorTypes",
                table: "SensorTypes",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Sensors_SensorTypeId",
                table: "Sensors",
                column: "SensorTypeId");

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
    }
}
