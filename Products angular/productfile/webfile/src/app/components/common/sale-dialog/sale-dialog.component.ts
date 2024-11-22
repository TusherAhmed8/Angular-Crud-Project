import { SaleDataModel } from './../../../models/sale-data-model';
import { Component, Inject, OnInit, ViewChild} from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { Sale } from '../../../models/sale';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifyService } from '../../../services/notify.service';

@Component({
  selector: 'app-sale-dialog',
  templateUrl: './sale-dialog.component.html',
  styleUrl: './sale-dialog.component.css'
})
export class SaleDialogComponent implements OnInit{
  sales:Sale[] =[];
  dataSource:MatTableDataSource<Sale> = new MatTableDataSource(this.sales);
  columns=[ 'sellerName','quantity'];
@ViewChild(MatSort,{static:false}) sort!:MatSort;
@ViewChild(MatPaginator, {static:false}) paginator!:MatPaginator;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:SaleDataModel,
    private productSrv :ProductService,
    private notifySrv:NotifyService
  ){}
  ngOnInit(): void  {
    this.productSrv.getSales(<number>this.data.id)
    .subscribe({
      next: r=>{
        console.log(r)
        this.sales = r;
        this.dataSource.data = this.sales;
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
