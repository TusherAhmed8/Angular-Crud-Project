import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Sale } from '../models/sale';
import { ImageUploadResponse } from '../models/image-upload-response';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }
  getAll(): Observable<Product[]>{
    return this.http.get<Product[]>(`http://localhost:5081/api/Products`);
  }
  getSales(id:number): Observable<Sale[]>{
    return this.http.get<Sale[]>(`http://localhost:5081/api/Products/Sales/${id}`);
  }
  getById(id:number):Observable<Product>{
    return this.http.get<Product>(`http://localhost:5081/api/Products/${id}`);
  }
  save(data:Product):Observable<Product>{
    return this.http.post<Product>(`http://localhost:5081/api/Products`, data);
  }
  update(data:Product):Observable<any>{
    return this.http.put<any>(`http://localhost:5081/api/Products/${data.productId}`, data);
  }
  delete(id:number):Observable<any>{
    return this.http.delete<any>(`http://localhost:5081/api/Products/${id}`);
  }
  uploadImage(f: File): Observable<ImageUploadResponse> {
    const formData = new FormData();

    formData.append('pic', f);
    //console.log(f);
    return this.http.post<ImageUploadResponse>(`http://localhost:5081/api/Products/Image/Upload`, formData);
  }
}
