using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using web1.Models;
using web1.ViewModels;

namespace web1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProductsController(ProductDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env; 
        }

        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.Include(x=> x.Sales).FirstOrDefaultAsync(x=> x.ProductId==id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }
        [HttpGet("Sales/{id}")]
        public async Task<ActionResult<IEnumerable<Sale>>> GetSalesOfProduct(int id)
        {
            return await _context.Sales.Where(x => x.ProductId == id).ToListAsync();
        }
        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.ProductId)
            {
                return BadRequest();
            }

            var op = await _context.Products.FirstOrDefaultAsync(x => x.ProductId == id);
            if (op == null) { return NotFound(); }
            op.ProductName = product.ProductName; 
            op.ProductId = product.ProductId;
            op.ProductType = product.ProductType;
            op.MfgDate = product.MfgDate; 
            op.Price = product.Price;
            op.Instock = product.Instock;
            op.Picture = product.Picture;
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM Sales WHERE ProductId={id}");
            foreach (var s in product.Sales)
            {
                _context.Sales.Add(new Sale {SellerName= s.SellerName, Quantity=s.Quantity, ProductId= id });
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.ProductId }, product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPost("Image/Upload")]
        public async Task<ActionResult<ImageUploadResponse>> Upload(IFormFile pic)
        {
            string ext = Path.GetExtension(pic.FileName);
            string f = Path.GetFileNameWithoutExtension(Path.GetRandomFileName()) + ext;
            string savePath = Path.Combine(_env.WebRootPath, "Pictures", f);
            FileStream fs = new FileStream(savePath, FileMode.Create);
            await pic.CopyToAsync(fs);
            fs.Close();
            return new ImageUploadResponse { NewFileName = f };
        }
        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.ProductId == id);
        }
    }
}
