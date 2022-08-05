import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-stock-search-navbar',
  templateUrl: './stock-search-navbar.component.html',
  styleUrls: ['./stock-search-navbar.component.css']
})
export class StockSearchNavbarComponent implements OnInit {
  searched_ticker: boolean;
  collapsed: boolean;
  @Input() ticker_symbol: any;
  @Input() isSaved: boolean;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.searched_ticker = false;
  }

  navigate_to(api_endpt: string, event: Event) {
    event.preventDefault();
    this.router.navigate([api_endpt], {relativeTo: this.route});
    this.collapsed = true;
  }
}
