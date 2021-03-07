import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map, tap } from 'rxjs/operators'
import { ProductCategory } from '../common/product-category';


@Injectable({
  providedIn: 'root'
})
export class ProductService {


  private baseUrl = 'http://localhost:8080/api/products'//?size=100'

  private categoryUrl = 'http://localhost:8080/api/product-category'

  private searchUrl = 'http://localhost:8080/api/products/search/findByNameContaining?name=';

  constructor(private httpClient: HttpClient) { }
  
  getProductListPaginate(thePage: number, 
                        thePageSize: number, 
                        theCategoryId: number): Observable<GetResponseProduct> {
    // todo: need to build url based on catagory id ... will come back to this!
    // need to build URL based on category id, paage  size 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
    
  }

  searchProductPaginate(thePage: number, 
                          thePageSize: number, 
                          theKeyword: string): Observable<GetResponseProduct> {
    // todo: need to build url based on catagory id ... will come back to this!
    // need to build URL based on keyword, paage  size 
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  getProductList(theCatagoryId: number): Observable<Product[]> {
    // todo: need to build url based on catagory id ... will come back to this!
    // need to build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCatagoryId}`;

    return this.getProducts(searchUrl);
  }

  // http://localhost:8080/api/product-category/1/products
  getProductCategories(): Observable<ProductCategory[]> {
    // return this.httpClient.get<GetResponseProductCategory>(`${this.categoryUrl}/${categoryId}/productCategory`).pipe(
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(value: string): Observable<Product[]> {
      
    return this.getProducts(this.searchUrl+value);
  }


  getProduct(theProductId: number): Observable<Product> {

    // need to build URL based on product id
    // 
    return this.httpClient.get<Product>(`${this.baseUrl}/${theProductId}`)

  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProduct>(searchUrl).pipe(
        map(response => response._embedded.products)
      );
  }



}

interface GetResponseProduct {
  _embedded: {
    products: Product[];  
    product: Product;
  },
  page: {
    size: number, // size of this page
    totalElements: number, // grand total o all elements in the database. but we are not returning all of the elements. just the count for informatioanl puposes ony
    totalPages: number, // total pages available
    number: number// current page number
  }
}

// unwraps the JSON from Spring Data REST _embedded entry
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];  
  }
}












