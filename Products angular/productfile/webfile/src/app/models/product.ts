import { ProductType } from "./app-constants";
import { Sale } from "./sale";
export interface Product {
    productId?:number;
    productName?:string;
    productType?:ProductType;
    mfgDate?:Date|string;
    price?:number;
    picture?:string;
    instock?:boolean;
    sales?:Sale[]; 
}
