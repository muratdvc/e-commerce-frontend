import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5; // poduct number
  theTotalElements: number = 0;

  previousKeyword: string = null;

  productCard: Product[] = [];
  
  constructor(private productListService: ProductService, private route: ActivatedRoute) { } // injecting dependency

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
    // this.listProduct();
    
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducs();
    } else {
      this.handleListProducts();
    }


  }

  handleSearchProducs() {
    
    const theKeyword = this.route.snapshot.paramMap.get('keyword');

    // if we have a different keyword than previous then set thepagenumber to 1
    
    if (this.previousKeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;


    // search for the products using keyword
    this.productListService.searchProductPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe(this.processResult())
    
  }

  handleListProducts() {
    
    // check if "id" paramteter available
    const hasCategoryId:boolean = this.route.snapshot.paramMap.has('id')
    // route -> use the activated route, snapshot -> state of route at this given moment in time, paramMap -> map of all the route paramters, 'id' -> read the id parameter

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      // console.log(this.currentCategoryId)
    } else {
      // not catagory id available ... default to catagory id 1
      this.currentCategoryId = 1 
    }

    //
    // cHEck if we have a different category than previous
    // then set the pagenumber back to  1 

    // if we have a different category id than previous
    // then set thepagenumber back to 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    
    this.previousCategoryId = this.currentCategoryId; // ???
    

    // now get the products for the given category id 
    this.productListService.getProductListPaginate(this.thePageNumber -1, // spring data rest de 0 dan basliyor angular da 1 den basliyor o fark icin +1
                                                   this.thePageSize,
                                                   this.currentCategoryId).subscribe(this.processResult())

    // this.productListService.getProductList(this.currentCategoryId).subscribe(
    //   data => {
    //     this.products = data;
    //     // console.log(data)
    //     // console.log(hasCategoryId + ' ' +  this.currentCategoryId)
    //   }
    // )
  }

  addToCard(productId: number) {
    this.productListService.getProduct(productId).subscribe(
      product =>{
        this.productCard.push(product)
      } 
    )
    localStorage.setItem('products', JSON.stringify(this.productCard));
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
      // console.log('pagenumber: ' + this.thePageNumber + ' pagesize: ' + this.thePageSize + ' totalelements: ' + this.theTotalElements)
    }
  }

  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 2;
    this.listProducts();
  }

}
