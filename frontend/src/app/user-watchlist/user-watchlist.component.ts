import { Component, OnInit } from '@angular/core';
import { AppServiceService } from '../app-service.service'; 
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-user-watchlist',
  templateUrl: './user-watchlist.component.html',
  styleUrls: ['./user-watchlist.component.css'],
})

export class UserWatchlistComponent implements OnInit {
  watchlist: any;
  latestPrice: any = new Array();
  last: any = {};
  lpc: any = {};
  change: any = {};
  changeUpdate: any = {};
  isWLinLS: boolean;
  tempResp: any;

  constructor(private service: AppServiceService, private router: Router) { }

  ngOnInit(): void {
    this.changeActiveClass();
    if (localStorage.getItem('user_watchlist') !== null) {
      this.isWLinLS = true;
      document.getElementById('nostock-watchlist').style.display = 'none';
      let wl = Object.entries(JSON.parse(localStorage.getItem('user_watchlist')));
      this.displayWl(wl);
    } else {
      this.isWLinLS = false;
      document.getElementById('nostock-watchlist').style.display = 'block';
    }
  }
  

  async refreshPg() {
    if (localStorage.getItem('user_watchlist') !== null) {
      this.isWLinLS = true;
      document.getElementById('nostock-watchlist').style.display = 'none';
      let wl = Object.entries(JSON.parse(localStorage.getItem('user_watchlist')));
      this.displayWl(wl);
    } else {
      this.isWLinLS = false;
      document.getElementById('nostock-watchlist').style.display = 'block';
    }
  }
  close(ticker) {
    let wl = JSON.parse(localStorage.getItem('user_watchlist'));
    localStorage.removeItem('user_watchlist');
    if (ticker in wl) {
      if (Object.keys(wl).length === 1) {
        document.getElementById('wlcard' + ticker).style.display = 'none';
        document.getElementById('nostock-watchlist').style.display = 'block';
        return;
      } else {
        delete wl[ticker];
      }
      document.getElementById('wlcard' + ticker).style.display = 'none';
    }
    localStorage.setItem('user_watchlist', JSON.stringify(wl));
    this.refreshPg();
  }

  changeActiveClass() {
   
    document.querySelectorAll('.nav-item').forEach((item) => {
      item.classList.remove('active');
    });
    document.getElementById('watchlist').classList.add('active');
  }

  async getLatestPrice(wl){
    await this.service.get_latest_price(wl[0]).then((response) => {
        this.tempResp = response;
        this.latestPrice.push(this.tempResp);
    });
  }

  async displayWl(wl) {
    for(const w of wl){
      await this.service.get_latest_price(w[0]).then((response) => {
        this.latestPrice = response;
          var thisT = w[0];
          this.lpc[thisT] = {
            last: this.latestPrice.c,
            prevClose: this.latestPrice.pc,
          };
          if (!this.lpc[thisT].last) {
            this.last[thisT] = ' -';
          } else {
            this.last[thisT] = this.lpc[thisT].last.toFixed(2);
          }
          if (!this.lpc[thisT].last || !this.lpc[thisT].prevClose) {
            this.changeUpdate[thisT] = ' -';
          } else {
            this.change[thisT] = this.lpc[thisT].last - this.lpc[thisT].prevClose;
            var changePercentage =
              (this.change[thisT] * 100) / this.lpc[thisT].prevClose;
            this.changeUpdate[thisT] =
              ' ' +
              this.change[thisT].toFixed(2) +
              ' (' +
              changePercentage.toFixed(2) +
              '%)';
          }
      });
    }
    this.watchlist = wl;
  }

  openDetails(ticker) {
    this.router.navigate(['search/' + ticker]);
  }
}
