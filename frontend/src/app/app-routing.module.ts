import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StockSearchComponent } from "./stock-search/stock-search.component";
import { UserPorfolioComponent } from "./user-porfolio/user-porfolio.component";
import { UserWatchlistComponent } from "./user-watchlist/user-watchlist.component";
import { FinnhubFooterComponent } from "./finnhub-footer/finnhub-footer.component";
import { CompanyInfoComponent } from './company-info/company-info.component';
import { StockSearchNavbarComponent } from './stock-search-navbar/stock-search-navbar.component';

const routes: Routes = [
    { path: 'stocksearch/home', pathMatch: 'full', component: StockSearchComponent },
    { path: 'watchlist', component: UserWatchlistComponent },
    { path: 'portfolio', component: UserPorfolioComponent },
    { path: 'search/:ticker', component: CompanyInfoComponent },
    { path: '**', redirectTo: '/stocksearch/home' },
  ];

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [CompanyInfoComponent, StockSearchComponent, UserPorfolioComponent, UserWatchlistComponent, FinnhubFooterComponent, StockSearchNavbarComponent]
  