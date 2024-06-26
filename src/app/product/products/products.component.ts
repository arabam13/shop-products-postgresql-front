import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import { combineLatest, map, Observable, startWith } from "rxjs";
import { ProductSearchType } from "../enums/product-search-type.enum";
import { ProductFacadeService } from "../facade/product-facade.service";
import { Product } from "../model/product.model";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {
  loading$!: Observable<boolean>;
  products$: Observable<Product[]>;
  totalProducts$!: Observable<number>;
  productsPerPage$: Observable<number>;
  pageSizeOptions$!: Observable<number[]>;

  searchCtrl!: FormControl;
  searchTypeCtrl!: FormControl;
  searchTypeOptions!: {
    value: ProductSearchType;
    label: string;
  }[];

  constructor(
    private productFacade: ProductFacadeService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initObservables();
    this.productFacade.getProducts();
  }

  private initForm() {
    this.searchCtrl = this.formBuilder.control("");
    this.searchTypeCtrl = this.formBuilder.control(ProductSearchType.NAME);
    this.searchTypeOptions = [
      { value: ProductSearchType.NAME, label: "Name" },
      { value: ProductSearchType.CATEGORY, label: "Category" },
      { value: ProductSearchType.INVENTORYSTATUS, label: "Inventory Status" },
    ];
  }

  private initObservables() {
    this.loading$ = this.productFacade.loading$;
    this.totalProducts$ = this.productFacade.totalProducts$;
    this.productsPerPage$ = this.productFacade.productsPerPage$;
    this.pageSizeOptions$ = this.productFacade.pageSizeOptions$;
    // this.products$ = this.productService.products$;
    const search$: Observable<string> = this.searchCtrl.valueChanges.pipe(
      startWith(this.searchCtrl.value),
      map((value) => value.toLowerCase())
    );
    const searchType$: Observable<ProductSearchType> =
      this.searchTypeCtrl.valueChanges.pipe(
        startWith(this.searchTypeCtrl.value)
      );
    this.products$ = combineLatest([
      search$,
      searchType$,
      this.productFacade.products$,
    ]).pipe(
      map(([search, searchType, products]) =>
        products.filter((product) =>
          product[searchType].toLowerCase().includes(search)
        )
      )
    );
  }

  handlePageSizeChange(event: { page: number; rows: number }) {
    // console.log({ event });
    this.productFacade.getProducts(event.page + 1, event.rows);
  }
}
