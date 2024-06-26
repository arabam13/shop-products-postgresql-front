import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  delay,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from "rxjs";
import { Product } from "../model/product.model.js";
import { ProductService } from "../service/product.service";

@Injectable()
export class ProductFacadeService {
  //BehaviorSubject && Observables
  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }
  private _products$ = new BehaviorSubject<Product[]>([]);
  get products$(): Observable<Product[]> {
    return this._products$.asObservable();
  }
  private _totalProducts$ = new BehaviorSubject<number>(0);
  get totalProducts$(): Observable<number> {
    return this._totalProducts$.asObservable();
  }
  private _productsPerPage$ = new BehaviorSubject<number>(10);
  get productsPerPage$(): Observable<number> {
    return this._productsPerPage$.asObservable();
  }
  private _pageSizeOptions$ = new BehaviorSubject<number[]>([10, 25, 50]);
  get pageSizeOptions$(): Observable<number[]> {
    return this._pageSizeOptions$.asObservable();
  }

  constructor(private productService: ProductService) {}

  private setLoadingStatus(loading: boolean) {
    this._loading$.next(loading);
  }

  getProducts(pageIndex?: number, pageSize?: number): void {
    if (!pageIndex && !pageSize) {
      this.setLoadingStatus(true);
    }
    this.productService
      .getProductsFromServer(pageIndex, pageSize)
      .pipe(
        delay(200),
        tap((dataApi) => {
          this._products$.next(dataApi["products"]);
          this._totalProducts$.next(dataApi["totolProducts"]);
          this._productsPerPage$.next(dataApi["pageSize"]);
          this.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  updateProduct(productARG: Pick<Product, "id" | "name" | "code">): void {
    this.products$
      .pipe(
        take(1),
        map((products) =>
          products.map((product) =>
            product.id === productARG.id
              ? { ...product, code: productARG.code, name: productARG.name }
              : product
          )
        ),
        tap((updatedProducts) => this._products$.next(updatedProducts)),
        switchMap(() => this.productService.updateProductFromServer(productARG))
      )
      .subscribe();
  }

  addProduct(productARG: Pick<Product, "name" | "code">): void {
    // console.log({ productARG });
    // this.setLoadingStatus(true);
    this.productService
      .addProductFromServer(productARG)
      .pipe(
        tap((product) => {
          this._products$.next([product, ...this._products$.value]);
          this._totalProducts$.next(this._totalProducts$.value + 1);
          // this.setLoadingStatus(false);
        })
      )
      .subscribe();
  }

  deleteProduct(productARG: Product): void {
    // this.setLoadingStatus(true);
    this.productService
      .deleteProductFromServer(productARG)
      .pipe(
        switchMap(() => this.products$),
        take(1),
        map((products) =>
          products.filter((product) => product.id !== productARG.id)
        ),
        tap((newProducts) => {
          this._products$.next(newProducts);
          this._totalProducts$.next(this._totalProducts$.value - 1);
          // this.setLoadingStatus(false);
        })
      )
      .subscribe();
  }
}
