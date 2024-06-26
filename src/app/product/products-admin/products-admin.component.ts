import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { Observable } from "rxjs";
import { ProductFacadeService } from "../facade/product-facade.service";
import { Product } from "../model/product.model";

@Component({
  selector: "app-products-admin",
  templateUrl: "./products-admin.component.html",
  styleUrls: ["./products-admin.component.scss"],
  providers: [ConfirmationService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsAdminComponent implements OnInit {
  loading$!: Observable<boolean>;
  products$: Observable<Product[]>;
  totalProducts$: Observable<number>;
  productsPerPage$: Observable<number>;
  pageSizeOptions$!: Observable<number[]>;

  productDialog: boolean = false;
  product: Pick<Product, "id" | "name" | "code">;
  selectedProducts!: Product[] | null;
  submitted: boolean = false;
  mode: "add" | "edit" = "add";

  constructor(
    private productFacade: ProductFacadeService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initObservables();
    this.productFacade.getProducts();
  }

  private initObservables() {
    this.loading$ = this.productFacade.loading$;
    this.products$ = this.productFacade.products$;
    this.totalProducts$ = this.productFacade.totalProducts$;
    this.productsPerPage$ = this.productFacade.productsPerPage$;
    this.pageSizeOptions$ = this.productFacade.pageSizeOptions$;
  }

  handlePageSizeChange(event: { page: number; rows: number }) {
    // console.log({ event });
    this.productFacade.getProducts(event.page + 1, event.rows);
  }

  openNew() {
    this.mode = "add";
    this.product = { id: 0, name: "", code: "" };
    this.submitted = false;
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct(product: Pick<Product, "id" | "name" | "code">) {
    this.submitted = true;

    if (product.name?.trim() && product.code?.trim() && this.mode !== "add") {
      this.mode = "edit";
      this.productFacade.updateProduct(product);
      this.messageService.add({
        severity: "info",
        summary: "Successful",
        detail: "Product Updated",
        life: 3000,
      });
    } else {
      this.mode = "add";
      if (
        (!product.name && this.submitted) ||
        (!product.code && this.submitted)
      ) {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Name or Code are required",
          life: 3000,
        });
        return;
      }
      this.productFacade.addProduct({
        code: product.code,
        name: product.name,
      });
      this.messageService.add({
        severity: "success",
        summary: "Successful",
        detail: "Product Created",
        life: 3000,
      });
    }

    this.productDialog = false;
  }

  editProduct(product: Product) {
    // console.log({ product });
    this.mode = "edit";
    this.product = { id: product.id, name: product.name, code: product.code };
    this.productDialog = true;
  }

  deleteProduct(product: Product) {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete " + product.name + "?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.productFacade.deleteProduct(product);
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Product Deleted",
          life: 3000,
        });
      },
    });
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: "Are you sure you want to delete the selected products?",
      header: "Confirm",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.selectedProducts.map((product) =>
          this.productFacade.deleteProduct(product)
        );
        this.selectedProducts = null;
        this.messageService.add({
          severity: "success",
          summary: "Successful",
          detail: "Products Deleted",
          life: 3000,
        });
      },
    });
  }
}
