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
    }
}