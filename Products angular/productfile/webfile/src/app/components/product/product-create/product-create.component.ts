import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductType } from '../../../models/app-constants';
import { ProductService } from '../../../services/product.service';
import { NotifyService } from '../../../services/notify.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrl: './product-create.component.css'
})
export class ProductCreateComponent implements OnInit{
  product:Product ={};
  typeOptions:{label:string, value:number}[]=[];
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
    private datePipe:DatePipe
  ){}
  get f(){
    return this.productForm.controls;
  }
  get sales(){
    return this.productForm.controls['sales'] as FormArray;
  }
  addSale(){
    this.sales.push(new FormGroup({
        sellerName: new FormControl('', Validators.required),
        quantity: new FormControl('', Validators.required)
    })
  );
  }
  removeSale(index:number){
    this.sales.removeAt(index);
  }
  save(){
    if(this.productForm.invalid) return;
    Object.assign(this.product, this.productForm.value);
    const reader = new FileReader();
    reader.onload = (e:any)=>{
      this.productSrv.uploadImage(this.picture)
      .subscribe({
        next: r=>{
          this.product.picture = r.newFileName;
          this.insert();
        },
        error: err=>{
          this.notfySrv.message("Failed to upload picture", "DISMISS");
        }
      })
    }
    reader.readAsArrayBuffer(this.picture)
    this.product.mfgDate = <string>this.datePipe.transform(this.product.mfgDate, "yyyy-MM-dd")
    
   
  }
  insert(){
    this.productSrv.save(this.product)
    .subscribe({
      next: r=>{
        this.notfySrv.message("Data Saved", "DISMISS");
        this.product={};
        this.productForm.reset();
        this.productForm.markAsPristine();
        this.productForm.markAsUntouched();
      },
      error: err=>{
        this.notfySrv.message("Failed to save", "DISMISS");
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
    this.addSale();
    Object.keys(ProductType).filter(
      (type) => isNaN(<any>type) && type !== 'quantity'
    ).forEach((v: any, i) => {
      this.typeOptions.push({ label: v, value: Number(ProductType[v]) });
    });
    console.log(this.typeOptions)
  }
}
