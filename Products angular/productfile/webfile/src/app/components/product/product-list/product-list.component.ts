import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Product } from '../../../models/product';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ProductService } from '../../../services/product.service';
import { NotifyService } from '../../../services/notify.service';
import { ProductType } from '../../../models/app-constants';
import { MatDialog } from '@angular/material/dialog';
import { SaleDialogComponent } from '../../common/sale-dialog/sale-dialog.component';
import { ConfirmDeleteComponent } from '../../common/confirm-delete/confirm-delete.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  imgPath = 'http://localhost:5081/Pictures';
  products:Product[] = [];
  dataSource:MatTableDataSource<Product> = new MatTableDataSource(this.products);
  columns=[ 'picture','productName', 'productType', 'mfgDate', 'price', 'instock','sales', 'actions'];
  @ViewChild(MatSort, {static:false}) sort!:MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
  constructor(
    private productSrv:ProductService,
    private notifySrv:NotifyService,
    private matDialog:MatDialog
  ){}
  getProductTypeName(v:number){
    return ProductType[v];
  }
  showsale(id:number){
    this.matDialog.open(SaleDialogComponent, {
      data:{id:id}
    })
  }
  deleteProduct(data:Product){
    this.matDialog.open(ConfirmDeleteComponent, {
      "width":"350px"

    }).afterClosed()
    .subscribe({
      next: result=>{
        if(result) {
          this.productSrv.delete(<number>data.productId)
          .subscribe({
            next: r=>{
              this.dataSource.data = this.dataSource.data.filter(x=> x.productId != data.productId);
            }
          })
        }
      }
    })
  }
  ngOnInit(): void {
    this.productSrv.getAll()
    .subscribe({
      next: r=>{
        this.products=r;
        console.log(this.products)
        this.dataSource.data = this.products;
        this.dataSource.sort=this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error:err=>{
        this.notifySrv.message("Faled to load device", "DISMISS");
        console.log(err.message | err);
      }
    })
  }
}
