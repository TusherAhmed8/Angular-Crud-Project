import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { NotifyService } from '../../../services/notify.service';
import { DatePipe } from '@angular/common';
import { Sale } from '../../../models/sale';
import { ActivatedRoute } from '@angular/router';
import { ProductType } from '../../../models/app-constants';
@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent implements OnInit{
  product:Product = {};
  typeOptions:{label:string, value:number}[] =[];
  picture:File = null!;
  productForm:FormGroup = new FormGroup({
    productName: new FormControl('', Validators.required),
    productType: new FormControl(undefined, Validators.required),
    mfgDate: new FormControl(undefined, Validators.required),
    price:new FormControl(undefined, Validators.required),
    instock:new FormControl(undefined),
    picture: new FormControl('', Validators.required),
    sales: new FormArray([])
  });
  constructor(
    private productSrv: ProductService,
    private notfySrv:NotifyService,
    private activatedRoute:ActivatedRoute,
    private datePipe:DatePipe
  ){}
  
  get f(){
    return this.productForm.controls;
  }
  get sales(){
    return this.productForm.controls['sales'] as FormArray;
  }
  addSale(sale?:Sale){
    this.sales.push(new FormGroup({
        sellerName: new FormControl(sale?.sellerName ?? '', Validators.required),
        quantity: new FormControl(sale?.quantity ?? '', Validators.required)
    })
  );
  }
  removeSale(index:number){
    this.sales.removeAt(index);
  }
  save(){
    if(this.productForm.invalid) return;
    let data:Product = {};
    Object.assign(data, this.productForm.value);
    data.productId=this.product.productId;
    if(data.picture == ''){
      data.picture = this.product.picture;
    }

    console.log(data);
    this.productSrv.update(data)
    .subscribe({
      next:r=>{
        this.notfySrv.message("Data Saved", "DISMISS");
      },
      error: err=>{
        this.notfySrv.message("Failed to update", "DISMISS");
      }
    })

  }
  pictureChanged(event:any){
    
    if(event.target.files.length){
      this.picture = event.target.files[0];
      this.productForm.patchValue({
        picture: this.picture.name
      })
    }
  }
  ngOnInit(): void {
    Object.keys(ProductType).filter(
      (type) => isNaN(<any>type) && type !== 'values'
    ).forEach((v: any, i) => {
      this.typeOptions.push({ label: v, value: Number(ProductType[v]) });
    });
    let id:number = this.activatedRoute.snapshot.params['id'];
    this.productSrv.getById(id)
    .subscribe({
      next: r=>{
        this.product= r;
        this.productForm.patchValue(this.product)
        this.product.sales?.forEach(s=>{
          this.addSale(s);
        });
      },
      error: err=>{
        this.notfySrv.message("Failed to save", "DISMISS");
      }
    })
  }
}
