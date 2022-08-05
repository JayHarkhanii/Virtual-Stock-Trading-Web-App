import { Component, OnInit } from '@angular/core';
import { AppServiceService } from './app-service.service';
// import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }

  isSaved: boolean;
  ticker_symbol: any;

  public collapsed = true;
  public searched_ticker: boolean;

  // constructor(private route: ActivatedRoute, private router: Router) { }  
  constructor(private service: AppServiceService) {  }
	
	ngOnInit(): void { 
    // this.searched_ticker = false;
    
    // If the user_wallet is not present on the wallet then add it to localStorage and set the money at 25000
    if(!localStorage.getItem("user_wallet")){
      localStorage.setItem("user_wallet", (25000.00).toString());
    }
    this.service.ticker_status.subscribe((res) => {
      this.ticker_symbol = res;
    })
    this.service.savedStatus.subscribe((res) => {
      this.isSaved = res;
    })
    
  }

  // navigate_to(api_endpt: string, event: Event) {
  //   event.preventDefault();
  //   this.router.navigate([api_endpt], {relativeTo: this.route});
  //   this.collapsed = true;
  // }
}