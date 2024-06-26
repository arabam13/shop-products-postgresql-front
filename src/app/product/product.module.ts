import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { ProductFacadeService } from "./facade/product-facade.service";
import { ProductRoutingModule } from "./product-routing.module.routes";
import { ProductsAdminComponent } from "./products-admin/products-admin.component";
import { ProductsComponent } from "./products/products.component";
import { ProductService } from "./service/product.service";

@NgModule({
  declarations: [ProductsAdminComponent, ProductsComponent],
  imports: [CommonModule, ProductRoutingModule, SharedModule],
  providers: [ProductService, ProductFacadeService],
})
export class ProductModule {}
