using LandslideMonitor.Models;
using Microsoft.EntityFrameworkCore;

namespace LandslideMonitor.Data;

public class AppDbContext : DbContext
{
    public DbSet<SensorData> SensorDatas { get; set; }
    public DbSet<Device> Devices { get; set; }
    public DbSet<Province> Provinces { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserProvince> UserProvinces { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Sensor> Sensors { get; set; }
    public DbSet<Threshold> Thresholds { get; set; }
    public DbSet<ChannelDefinition> SensorTypes { get; set; }
    public DbSet<ChannelDefinition> ChannelDefinitions { get; set; }
    public DbSet<SensorChannel> SensorChannels { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
        
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SensorData>()
            .HasKey(x => x.id);

        modelBuilder.Entity<Device>()
            .HasKey(d => d.DeviceId);

        modelBuilder.Entity<Device>()
            .HasOne(d => d.Province)
            .WithMany(p => p.Devices)
            .HasForeignKey(d => d.ProvinceId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<UserProvince>()
            .HasKey(up => new { up.UserId, up.ProvinceId });
        modelBuilder.Entity<SensorData>()
            .HasIndex(sd => new { sd.DeviceId, sd.Timestamp });
        modelBuilder.Entity<Sensor>(entity =>
        {
            entity.HasKey(s => s.Id);

            entity.HasOne(s => s.Device)
                .WithMany(d => d.Sensors)
                .HasForeignKey(s => s.DeviceId)
                .OnDelete(DeleteBehavior.Cascade);
            entity.Property(s => s.SensorCode).IsRequired();
        });
        modelBuilder.Entity<ChannelDefinition>(entity =>
        {
            entity.HasKey(x => x.Id);
            entity.Property(x => x.Name).IsRequired();
            entity.Property(x => x.DataKey).IsRequired();
            entity.HasIndex(x => x.DataKey).IsUnique();
        });
        modelBuilder.Entity<ChannelDefinition>()
            .HasIndex(x => x.DataKey)
            .IsUnique();

        modelBuilder.Entity<SensorChannel>()
            .HasIndex(x => new { x.SensorId, x.ChannelDefinitionId })
            .IsUnique();

        modelBuilder.Entity<Sensor>()
            .HasMany(s => s.SensorChannels)
            .WithOne(sc => sc.Sensor)
            .HasForeignKey(sc => sc.SensorId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Threshold>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.HasOne(t => t.channelDefinition)
                .WithMany()
                .HasForeignKey(t => t.channelDefinitionid)
                .OnDelete(DeleteBehavior.Cascade);
        });
        modelBuilder.Entity<SensorData>()
            .HasOne<Device>()
            .WithMany()
            .HasForeignKey(sd => sd.DeviceId)
            .OnDelete(DeleteBehavior.Restrict);
        modelBuilder.Entity<AuditLog>()
            .HasOne(a => a.User)
            .WithMany()
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.SetNull);
        modelBuilder.Entity<Province>().HasData(
            new Province { Id = 1, Name = "Thành phố Cần Thơ" },
            new Province { Id = 2, Name = "Thành phố Đà Nẵng" },
            new Province { Id = 3, Name = "Thành phố Hà Nội" },
            new Province { Id = 4, Name = "Thành phố Hải Phòng" },
            new Province { Id = 5, Name = "Thành phố Hồ Chí Minh" },
            new Province { Id = 6, Name = "Thành phố Huế" },
            new Province { Id = 7, Name = "Tỉnh An Giang" },
            new Province { Id = 8, Name = "Tỉnh Bắc Ninh" },
            new Province { Id = 9, Name = "Tỉnh Cà Mau" },
            new Province { Id = 10, Name = "Tỉnh Cao Bằng" },
            new Province { Id = 11, Name = "Tỉnh Đắk Lắk" },
            new Province { Id = 12, Name = "Tỉnh Điện Biên" },
            new Province { Id = 13, Name = "Tỉnh Đồng Nai" },
            new Province { Id = 14, Name = "Tỉnh Đồng Tháp" },
            new Province { Id = 15, Name = "Tỉnh Gia Lai" },
            new Province { Id = 16, Name = "Tỉnh Hà Tĩnh" },
            new Province { Id = 17, Name = "Tỉnh Hưng Yên" },
            new Province { Id = 18, Name = "Tỉnh Khánh Hòa" },
            new Province { Id = 19, Name = "Tỉnh Lai Châu" },
            new Province { Id = 20, Name = "Tỉnh Lâm Đồng" },
            new Province { Id = 21, Name = "Tỉnh Lạng Sơn" },
            new Province { Id = 22, Name = "Tỉnh Lào Cai" },
            new Province { Id = 23, Name = "Tỉnh Nghệ An" },
            new Province { Id = 24, Name = "Tỉnh Ninh Bình" },
            new Province { Id = 25, Name = "Tỉnh Phú Thọ" },
            new Province { Id = 26, Name = "Tỉnh Quảng Ngãi" },
            new Province { Id = 27, Name = "Tỉnh Quảng Ninh" },
            new Province { Id = 28, Name = "Tỉnh Quảng Trị" },
            new Province { Id = 29, Name = "Tỉnh Sơn La" },
            new Province { Id = 30, Name = "Tỉnh Tây Ninh" },
            new Province { Id = 31, Name = "Tỉnh Thái Nguyên" },
            new Province { Id = 32, Name = "Tỉnh Thanh Hóa" },
            new Province { Id = 33, Name = "Tỉnh Tuyên Quang" },
            new Province { Id = 34, Name = "Tỉnh Vĩnh Long" }
        );
    }
}