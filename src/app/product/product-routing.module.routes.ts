import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ProductsAdminComponent } from "./products-admin/products-admin.component";
import { ProductsComponent } from "./products/products.component";

const routes: Routes = [
  {
    path: "products",
    component: ProductsComponent,
  },
  {
    path: "admin",
    children: [
      {
        path: "products",
        component: ProductsAdminComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
