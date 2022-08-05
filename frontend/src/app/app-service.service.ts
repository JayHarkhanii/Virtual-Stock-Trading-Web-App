import { forkJoin } from 'rxjs';	
import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';	
// import { EventEmitter } from 'stream';


@Injectable({
  providedIn: 'root'
})

export class AppServiceService {

	ticker_symbol:string;
	isSaved: boolean;
	resp1: any;
	resp2: any;
	resp3: any;
	resp4: any;
	resp5: any;
	@Output() ticker_status: EventEmitter<any> = new EventEmitter();
	@Output() savedStatus: EventEmitter<any> = new EventEmitter();
	constructor(private http : HttpClient) {}

	// Functions to get the data from Port 3000

	setNavbar(){
		this.ticker_symbol = '';
		this.isSaved = false;
		this.ticker_status.emit('');
		this.savedStatus.emit(this.isSaved);
	}

	saveResponse(resp1, resp2, resp3, resp4, resp5){
		this.resp1 = resp1;
		this.resp2 = resp2;
		this.resp3 = resp3;
		this.resp4 = resp4;
		this.resp5 = resp5;
		this.isSaved = true;
		this.ticker_status.emit(this.ticker_symbol);
		this.savedStatus.emit(this.isSaved);
	}

	// Getting Details abt company
	get_company_details() {	
		const company_peers_data = this.http.get('https://assignment-8-346123.wl.r.appspot.com/company_peers/' + this.ticker_symbol)
		const company_latest_price_data = this.http.get('https://assignment-8-346123.wl.r.appspot.com/latest_price/' + this.ticker_symbol);
		const company_details_data = this.http.get('https://assignment-8-346123.wl.r.appspot.com/company_details/' + this.ticker_symbol);
		
		return forkJoin([company_peers_data, company_latest_price_data, company_details_data]);	}

	get_company_ticker_sym(comp_ticker: string) {	
		this.ticker_symbol = comp_ticker;}
	
	// Autocomplete Func
	get_autocomplete_data(ticker: string) {	
		return this.http.get('https://assignment-8-346123.wl.r.appspot.com/autoComplete/' + ticker);}
	
	// Daily Chart Func
	get_company_daily_chart_data(ts: string) {
		return this.http.get('https://assignment-8-346123.wl.r.appspot.com/company_daily_data/'+this.ticker_symbol + '/' + ts);}

	get_chart_data(timestamp: string) {
		const curr_date = new Date();
		
		// Getting date of 2 years ago 
		let past_mnth = curr_date.getMonth() + 1; 
		let past_year = curr_date.getFullYear() - 2; 
		let past_day = curr_date.getDate();
		
		let past_date: string = past_year.toString()+"-";

		let month = ('0' + past_mnth.toString()).slice(-2)
		let day = ('0' + past_day.toString()).slice(-2)

		past_date = past_date + month + day
		
		console.log(typeof(timestamp))
		const company_daily_data = this.http.get('https://assignment-8-346123.wl.r.appspot.com/company_daily_data/' + this.ticker_symbol + '/' + parseInt(timestamp))
		const company_historical_data = this.http.get('https://assignment-8-346123.wl.r.appspot.com/company_historical_data/'  + this.ticker_symbol)
		const company_news_data = this.http.get('https://assignment-8-346123.wl.r.appspot.com/complete_news/' + this.ticker_symbol);
		
		return forkJoin([company_daily_data, company_historical_data, company_news_data]);	
	}

	// Earnings Func
	get_company_earnings(ticker:string) {	
		return this.http.get('https://assignment-8-346123.wl.r.appspot.com/company_earnings/' + ticker);}

	get_latest_price(ticker: string) {
		return this.http.get('https://assignment-8-346123.wl.r.appspot.com/latest_price/' + ticker).toPromise();}

	// Recommendation Func
	get_company_reco_trends(tickers: string) {
		return this.http.get('https://assignment-8-346123.wl.r.appspot.com/recommendation/' + tickers);}

	// Sentiments Func
	get_company_sentiments(ticker:string) {
		return this.http.get('https://assignment-8-346123.wl.r.appspot.com/sentiments/' + ticker);}

}
