import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "app/environments/environment.prod";
import { Observable } from "rxjs";
import { Product } from "../model/product.model";

@Injectable()
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductsFromServer(
    pageIndex?: number,
    pageSize?: number
  ): Observable<Product[] | []> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`, {
      params: {
        _page: pageIndex?.toString(),
        _limit: pageSize?.toString(),
      },
    });
  }

  updateProductFromServer(productARG: Pick<Product, "id" | "name" | "code">) {
    return this.http.patch(`${environment.apiUrl}/products/${productARG.id}`, {
      code: productARG.code,
      name: productARG.name,
    });
  }

  addProductFromServer(productARG: Pick<Product, "name" | "code">) {
    return this.http.post<Product>(`${environment.apiUrl}/products`, {
      code: productARG.code,
      name: productARG.name,
    });
  }

  deleteProductFromServer(productARG: Product) {
    return this.http.delete(`${environment.apiUrl}/products/${productARG.id}`);
  }
}
