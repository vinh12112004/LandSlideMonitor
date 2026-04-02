using LandslideMonitor.Models;
using Microsoft.EntityFrameworkCore;

namespace LandslideMonitor.Data;

public class AppDbContext : DbContext
{
    public DbSet<SensorData> SensorDatas { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
        
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SensorData>()
            .HasKey(x => x.id);
    }
}