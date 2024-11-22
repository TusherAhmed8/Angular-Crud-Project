import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NavBarComponent } from './components/common/nav-bar/nav-bar.component';

import { HomeComponent } from './components/common/home/home.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService } from './services/product.service';
import { NotifyService } from './services/notify.service';
import { MatImportModule } from './modules/mat-import/mat-import.module';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductCreateComponent } from './components/product/product-create/product-create.component';
import { ProductEditComponent } from './components/product/product-edit/product-edit.component';
import { ConfirmDeleteComponent } from './components/common/confirm-delete/confirm-delete.component';
import { SaleDialogComponent } from './components/common/sale-dialog/sale-dialog.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    ProductListComponent,
    ProductCreateComponent,
    ProductEditComponent,
    ConfirmDeleteComponent,
    SaleDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatImportModule,
    MatNativeDateModule,
    ReactiveFormsModule
    
  ],
  providers: [
    provideAnimationsAsync(),DatePipe, HttpClient, ProductService, NotifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
