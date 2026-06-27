using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace LandslideMonitor.Migrations
{
    /// <inheritdoc />
    public partial class dataprovince : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Provinces",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Thành phố Cần Thơ" },
                    { 2, "Thành phố Đà Nẵng" },
                    { 3, "Thành phố Hà Nội" },
                    { 4, "Thành phố Hải Phòng" },
                    { 5, "Thành phố Hồ Chí Minh" },
                    { 6, "Thành phố Huế" },
                    { 7, "Tỉnh An Giang" },
                    { 8, "Tỉnh Bắc Ninh" },
                    { 9, "Tỉnh Cà Mau" },
                    { 10, "Tỉnh Cao Bằng" },
                    { 11, "Tỉnh Đắk Lắk" },
                    { 12, "Tỉnh Điện Biên" },
                    { 13, "Tỉnh Đồng Nai" },
                    { 14, "Tỉnh Đồng Tháp" },
                    { 15, "Tỉnh Gia Lai" },
                    { 16, "Tỉnh Hà Tĩnh" },
                    { 17, "Tỉnh Hưng Yên" },
                    { 18, "Tỉnh Khánh Hòa" },
                    { 19, "Tỉnh Lai Châu" },
                    { 20, "Tỉnh Lâm Đồng" },
                    { 21, "Tỉnh Lạng Sơn" },
                    { 22, "Tỉnh Lào Cai" },
                    { 23, "Tỉnh Nghệ An" },
                    { 24, "Tỉnh Ninh Bình" },
                    { 25, "Tỉnh Phú Thọ" },
                    { 26, "Tỉnh Quảng Ngãi" },
                    { 27, "Tỉnh Quảng Ninh" },
                    { 28, "Tỉnh Quảng Trị" },
                    { 29, "Tỉnh Sơn La" },
                    { 30, "Tỉnh Tây Ninh" },
                    { 31, "Tỉnh Thái Nguyên" },
                    { 32, "Tỉnh Thanh Hóa" },
                    { 33, "Tỉnh Tuyên Quang" },
                    { 34, "Tỉnh Vĩnh Long" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "Provinces",
                keyColumn: "Id",
                keyValue: 34);
        }
    }
}
