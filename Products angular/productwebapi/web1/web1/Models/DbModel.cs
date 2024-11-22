using Microsoft.EntityFrameworkCore;

namespace web1.Models
{
    public enum ProductType { Mens=1, Womens, Kids}
    public class Product
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = default!;
        public ProductType ProductType { get; set;}
        public decimal Price { get; set; }
        public DateTime MfgDate { get; set; }
        public string Picture { get; set; } = default!;
        public bool? Instock { get; set; }
        public virtual ICollection<Sale> Sales { get; set; } = [];
    }
    public class Sale
    { 
    public int SaleId { get; set; }
    public string SellerName { get; set; }=default!;
    public int Quantity { get; set; }
    //fk
    public int ProductId { get; set; }
    public virtual Product? Product { get; set; }
    }
    public class ProductDbContext(DbContextOptions<ProductDbContext> options) : DbContext(options)
    { 
    public DbSet<Product> Products { get; set; }
    public DbSet<Sale> Sales { get; set; }
    }
}
