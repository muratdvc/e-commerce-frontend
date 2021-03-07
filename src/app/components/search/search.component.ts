import { keyframes } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router, private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  doSearch(value: string) {
    
    this.router.navigate(['/search', value])
  }

}
