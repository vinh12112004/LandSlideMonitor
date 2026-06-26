using System.Text;
using LandslideMonitor.Data;
using LandslideMonitor.Helpers;
using LandslideMonitor.Hubs;
using LandslideMonitor.Models;
using LandslideMonitor.Repositories.Implementations;
using LandslideMonitor.Repositories.Interfaces;
using LandslideMonitor.Services;
using LandslideMonitor.Services.Implementations;
using LandslideMonitor.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
// Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});
//JWT SWAGGER
var jwtKey = builder.Configuration["Jwt:Key"];

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            )
        };
    });
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Nhập token: Bearer {token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});
// DB
builder.Services.AddDbContext<AppDbContext>((sp, options) =>
{
    var auditContext = sp.GetRequiredService<IAuditContext>();

    options.UseSqlServer(
        builder.Configuration.GetConnectionString("Default"),
        sql => sql.EnableRetryOnFailure()
    );

    options.AddInterceptors(
        new AuditInterceptor(auditContext)
    );
});
// Automapper
builder.Services.AddAutoMapper(typeof(MappingProfile));
// MQTT worker
builder.Services.AddHostedService<MqttService>();
builder.Services.AddHostedService<DeviceStatusService>();
// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddHttpContextAccessor();
builder.Services.AddMemoryCache();
//DL
builder.Services.AddScoped<ISensorDataRepository, SensorDataRepository>();
builder.Services.AddScoped<ISensorDataService, SensorDataService>();
builder.Services.AddScoped<IDeviceRepository, DeviceRepository>();
builder.Services.AddScoped<IDeviceService, DeviceService>();
builder.Services.AddScoped<IProvinceRepository, ProvinceRepository>();
builder.Services.AddScoped<IProvinceService, ProvinceService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ISensorRepository, SensorRepository>();
builder.Services.AddScoped<IThresholdRepository, ThresholdRepository>();
builder.Services.AddScoped<IChannelDefinitionRepository, ChannelDefinitionRepository>();
builder.Services.AddScoped<IChannelDefinitionService, ChannelDefinitionService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IAuditContext, AuditContext>();
// builder.Services.AddScoped<AuditInterceptor>();

var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
app.MapHub<SensorHub>("/sensorHub");
app.UseCors("AllowFrontend");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
 
}
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    try 
    {
        Console.WriteLine("Đang chạy Migration...");
        context.Database.Migrate(); 
        Console.WriteLine("Migration xong. Đang kiểm tra dữ liệu Admin...");

        if (!context.Users.Any())
        {
            var admin = new User
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                Role = "Admin"
            };

            context.Users.Add(admin);
            context.SaveChanges();
            Console.WriteLine("Tạo tài khoản Admin thành công!");
        }
    }
    catch (Exception ex)
    {
        // Ép in ra lỗi chi tiết trước khi app bị sập
        Console.WriteLine("=== LỖI NGHIÊM TRỌNG KHI KHỞI ĐỘNG ===");
        Console.WriteLine(ex.Message);
        Console.WriteLine(ex.StackTrace);
        throw; 
    }
}
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
