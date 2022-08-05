import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'; 
import { AppServiceService } from '../app-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as Highcharts from 'highcharts/highstock'; 
import IndicatorsCore from 'highcharts/indicators/indicators';
import vbp from 'highcharts/indicators/volume-by-price';

IndicatorsCore(Highcharts);
vbp(Highcharts);



let debounce = function (func, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

@Component({
	selector: 'app-company-info',
	templateUrl: './company-info.component.html',
	styleUrls: ['./company-info.component.css']
})
export class CompanyInfoComponent implements OnInit {
	comp_recommendation_charts: any;
	company_news_modal: any;
	twitter_url: any;
	comp_mention_reddit: any;
	comp_hold: any;
	res_close = '';
	comp_negative_reddit: any;
	company_earnings_data: any;
	comp_buy: any;
	comp_negative_twitter: any;
	comp_strongSell: any;
	comp_positive_twitter: any;
	no_input: boolean;

	max_buy_possible: any;
	stock_bought: boolean;
	curr_stock_total = 0.0;
	in_user_watchlist: boolean;
	max_sell_possible: any;
	curr_stock_quantiy: any;
	curr_stock_qty = new FormControl();
	regular_exp = /^\d*$/;

	frmctrl = new FormControl();
	data_loaded: boolean;
	ticker_symbl: string = '';
	ticker_entered: boolean;
	comp: any;
	company_last_price: any;
	market_closed_price: any;
	stock_hist_data: any;
	company_news: any;
	ticker_symbol: string = '';
	company_data: any;
	curr_datetime: any;
	stock_price_change: any;
	market_currtime_diff: any;
	rmv_wtchlist: any; 
	isClosed: boolean;
	market_closed_time: any;
	complete_comp_data: boolean;
	price_chng: any;
	valid_ticker: boolean;
	add_wtchlist: any; 
	close_alert: boolean; 
	stock_daily_chart: any;
	call_api_first: boolean;
	call: any;
	add_prtfl: any; 
	company_peers: any;
	market_ts: any = new Date();
	
	stock_volume: any;
	Highcharts: typeof Highcharts = Highcharts;
	cons_crt: string = 'stockChart';
	past_2_years: any;
	user_wallet: any;
	last_date: any;
	comp_daily_chart: Highcharts.Options;
	stock_ohlc: any;
	comp_charts: Highcharts.Options;
	isHighcharts = typeof Highcharts === 'object';

	company_sent_reddit: any;
	comp_mention_twitter: any;
	comp_positive_reddit: any;
	company_recom_data: any;
	company_sent_twitter: any;
	comp_strongBuy: any;
	comp_sell: any;
	EPScharts_optns: any;

	chartsOption3: Highcharts.Options;
	period: any;
	data1: any;
	

	constructor(
		private service: AppServiceService,
		private route: ActivatedRoute,
		private router: Router,
		private modalService: NgbModal
	) { }

	ngOnInit(): void {
		document.getElementById('add_to_watchlist').style.display = 'none';
		document.getElementById('remove_from_watchlist').style.display = 'none';
		document.getElementById('add_to_portfolio').style.display = 'none';

		// alert(JSON.parse(JSON.stringify(localStorage.getItem("user_wallet"))))
		this.user_wallet = JSON.parse(localStorage.getItem("user_wallet").toString());
		this.ticker_entered = false;
		this.data_loaded = false;

		document.getElementById('comp_ticker').addEventListener('input', this.autocomplete_search);
		
		this.update_act_class();
		this.route.paramMap.subscribe((obs) => {
			this.ticker_symbl = obs.get('ticker');
			localStorage.setItem('ticker_symbl', obs.get('ticker'));
		});
		
		this.stock_bought = false;
		this.call_api_first = true;
		this.curr_stock_quantiy = 0;
		this.valid_ticker = false;
		this.complete_comp_data = false;

		if(this.service.isSaved && this.service.ticker_symbol == this.route.snapshot.params.ticker){
			this.comp = this.service.resp1[2];
			if ( !this.comp.hasOwnProperty('ticker') && this.comp.ticker === '') {
				this.valid_ticker = false;
			} 
			
			else 		
			{
				this.valid_ticker = true;
				
				this.company_peers = this.service.resp1[0];
				this.company_last_price = this.service.resp1[1];
				this.market_closed_price = this.company_last_price.c;
				
				var today = new Date();
				var comp_last_trading_time = new Date(this.company_last_price.t);
				const x = 60000
				this.market_currtime_diff = (today.valueOf() - comp_last_trading_time.valueOf()) / x;

				// If the market difference is greater than 5 then the Market is Closed
				if (this.market_currtime_diff >= 5) {
					this.isClosed = true;
					this.market_ts = this.company_last_price?.t;
				}

				// Getting Charts Data
				this.stock_daily_chart = this.service.resp4[0];
				console.log(this.stock_daily_chart)
				this.company_news = this.service.resp4[2];
				this.stock_hist_data = (this.service.resp4[1]);
				console.log(this.stock_hist_data)
					// Getting Sentiments Data
				this.company_sent_reddit = this.service.resp5['reddit'][0]
				this.company_sent_twitter = this.service.resp5['twitter'][0]
				this.company_earnings_data = this.service.resp3
				// console.log(resp_2, typeof(resp_2))
				this.company_recom_data = (this.service.resp2)	

				this.storing_company_news();
				this.storing_company_summary();
				this.display_comp_daily_charts();
				this.display_comp_historical_charts();
				this.storing_comp_insights();
				this.get_company_earnings();
				this.display_company_recom();

				this.complete_comp_data = true;
			}
		}
		else{
			let input_ticker = this.route.snapshot.params.ticker;

			if (!!input_ticker) {
				this.service.get_company_ticker_sym(input_ticker); 
			} 
			
			
			// Getting the company details
			this.service.get_company_details().subscribe((resp_1) => {
				this.comp = resp_1[2];
				if ( !this.comp.hasOwnProperty('ticker') && this.comp.ticker === '') {
					this.valid_ticker = false;
				} 
				
				else 		
				{
					this.valid_ticker = true;
					
					this.company_peers = resp_1[0];
					this.company_last_price = resp_1[1];
					this.market_closed_price = this.company_last_price.c;
					
					var today = new Date();
					var comp_last_trading_time = new Date(this.company_last_price.t);
					const x = 60000
					this.market_currtime_diff = (today.valueOf() - comp_last_trading_time.valueOf()) / x;

					// If the market difference is greater than 5 then the Market is Closed
					if (this.market_currtime_diff >= 5) {
						this.isClosed = true;
						this.market_ts = this.company_last_price?.t;
					}

					// Getting Charts Data
					this.service.get_chart_data(this.market_ts).subscribe((resp_4) => {
						this.stock_daily_chart = resp_4[0];
						console.log(this.stock_daily_chart)
						this.company_news = resp_4[2];
						this.stock_hist_data = (resp_4[1]);
						console.log(this.stock_hist_data)
						// Getting Sentiments Data
						this.service.get_company_sentiments(input_ticker).subscribe((resp_5) => {
							this.company_sent_reddit = resp_5['reddit'][0]
							this.company_sent_twitter = resp_5['twitter'][0]
							this.service.get_company_earnings(input_ticker).subscribe((resp_3) => {
								this.company_earnings_data = resp_3			
								this.service.get_company_reco_trends(input_ticker).subscribe((resp_2) => {
									// console.log(resp_2, typeof(resp_2))
									this.service.saveResponse(resp_1, resp_2, resp_3, resp_4, resp_5);
									this.company_recom_data = (resp_2)	

									this.storing_company_news();
									this.storing_company_summary();
									this.display_comp_daily_charts();
									this.display_comp_historical_charts();
									this.storing_comp_insights();
									this.get_company_earnings();
									this.display_company_recom();

									this.complete_comp_data = true;
								});
							});
						
						});

						// if (this.market_currtime_diff < 60) {
						// 	this.make_call_at_intervals();
						// }
					});	
					
					
			
					// Getting Earnings Data
					

					// Getting Recommendation Data
					
					
					if (!this.isClosed){
						this.call = setInterval(_ => {
						// Getting the company details
								this.service.get_company_details().subscribe((resp_1) => {
									this.comp = resp_1[2];
									this.company_peers = resp_1[0];
									this.company_last_price = resp_1[1];
									this.market_closed_price = this.company_last_price.c;
									
									var today = new Date();
									var comp_last_trading_time = new Date(this.company_last_price.t);
									const x = 60000
									this.market_currtime_diff = (today.valueOf() - comp_last_trading_time.valueOf()) / x;
				
									// If the market difference is greater than 5 then the Market is Closed
									if (this.market_currtime_diff >= 5) {
										this.isClosed = true;
										this.market_ts = this.company_last_price?.t;
										clearInterval(this.call)
									}
				
									// Getting Charts Data
									this.service.get_chart_data(this.market_ts).subscribe((resp_4) => {
										this.stock_daily_chart = resp_4[0];
										console.log(this.stock_daily_chart)
										this.company_news = resp_4[2];
										this.stock_hist_data = (resp_4[1]);
										console.log(this.stock_hist_data)
				
										this.storing_company_summary();
										this.display_comp_daily_charts();
								});
							});
					}, 15000)
				
				}
		
				}
			});
		}
	}

	disp_form(formIp: any) {
		return formIp ? formIp : undefined;
	}

	autocomplete_search =
		(event) => {
			this.data_loaded = false;
			this.company_data = null;
			var company;
			var resList = [];
			this.ticker_symbol = event.target.value;
			if (this.ticker_symbol !== '') {
				this.service.get_autocomplete_data(this.ticker_symbol).subscribe((response) => {
					company = response;
					company = company.result;
					var len = company.length;
					for (var i = 0; i < len; i++) {
						if (company[i].type == 'Common Stock' && !company[i].displaySymbol.includes('.')) {
							resList.push(company[i]);
						}
					}
					this.company_data = resList;
					console.log(this.company_data);
					this.data_loaded = true;
					this.ticker_symbol = '';
				});
			}
		};


	

	callAutocomplete() {
		this.data_loaded = false;
		document.getElementById('comp_ticker').addEventListener('input', this.autocomplete_search);
	}

	async updateData(ticker){

		this.data_loaded = false;
		this.ticker_entered = false;
		this.valid_ticker = true;
		this.stock_bought = false;
		this.complete_comp_data = false;
		this.curr_stock_quantiy = 0;

		// Getting the company details
		this.service.get_company_details().subscribe((resp_1) => {
			this.comp = resp_1[2];
			console.log(this.comp)
			console.log(this.comp)
			if ( !this.comp.hasOwnProperty('ticker') && this.comp.ticker === '') {
				this.valid_ticker = false;
			} 

			else if(Object.keys(this.comp).length === 0){
				this.valid_ticker = false;
				console.log('invaliddddddd')
				// document.getElementById('invalid-ticker').style.display = 'block';
			}
			else {
				this.valid_ticker = true;
				// document.getElementById('invalid-ticker').style.display = 'none';
				console.log(this.comp);
				this.company_last_price = resp_1[1];
				this.company_peers = resp_1[0];
				this.market_closed_price = this.company_last_price.c;
				var today = new Date();
				var comp_last_trading_time = new Date(this.company_last_price?.t);
				this.market_currtime_diff = (today.valueOf() - comp_last_trading_time.valueOf()) / 60000;
				if (this.market_currtime_diff >= 5) {
					this.isClosed = true;
					this.market_ts = this.company_last_price?.t;
				}

				// Getting Charts Data 
				this.service.get_chart_data(this.market_ts).subscribe((resp_4) => {
					this.stock_daily_chart = resp_4[0];
					this.company_news = resp_4[2];
					console.log(resp_4)
					this.stock_hist_data = (resp_4[1]);
					
					this.storing_company_news();
					this.storing_company_summary();
					this.display_comp_daily_charts();
					this.display_comp_historical_charts();
		

				// Getting Sentiments Data
				this.service.get_company_sentiments(ticker).subscribe((resp_5) => {
					this.company_sent_reddit = resp_5['reddit'][0]
					this.company_sent_twitter = resp_5['twitter'][0]

				// Getting Earnings Data
				this.service.get_company_earnings(ticker).subscribe((resp_3) => {
					this.company_earnings_data = resp_3

				
				// Getting Recommendation Data
				this.service.get_company_reco_trends(ticker).subscribe((resp_2) => {
						
					this.company_recom_data = (resp_2)	

					this.storing_comp_insights();
					this.display_company_recom();
					this.get_company_earnings();

					this.complete_comp_data = true;
					if (this.market_currtime_diff < 60) {
						
						this.make_call_at_intervals();
					}

				});
						
				});

			});
				
		});
			}
			});
	}

	submit_form(event: Event) {
		event.preventDefault();

		if ((<HTMLInputElement>(document.getElementById('comp_ticker'))).value === ''){
			this.no_input = true;
			this.ticker_entered = false;
			console.log('inside', this.no_input, this.ticker_entered)
			document.getElementById('empty_input').style.display = 'block';
			// this.router.navigate(['search/']);
			// return;
		}

		else
		{	
			var input_ticker = (<HTMLInputElement>(document.getElementById('comp_ticker'))).value.toUpperCase();
			console.log(input_ticker, document.getElementById('empty_input'))
			this.service.get_company_ticker_sym(input_ticker);
			this.ticker_entered = true;
			this.no_input = false;
			// document.getElementById('empty_input').style.display = 'none';

			localStorage.setItem("ticker_symbl", input_ticker);
			console.log("AAYA")
			this.updateData(input_ticker).then(_ => {
				this.router.navigate(['search/' + input_ticker], {relativeTo: this.route.parent});
			});

	}
	}

	hideLoadingDiv_invalid() {
		setTimeout(function(){
		  document.getElementById('invalid-ticker').style.display = 'none';
		},1000)
	}

	hideLoadingDiv_empty() {
		alert('Hi')
		setTimeout(function(){
		  document.getElementById('empty_input').style.display = 'none';
		},1000)
	}

	clear_info(){
		console.log('Working Perfectly!!')
		this.router.navigate(['search/']);
	}
	

	ngOnDestroy(): void {
		if (this.market_currtime_diff < 60) {
			clearInterval(this.call);
		}

		clearInterval(this.add_wtchlist);
		clearInterval(this.rmv_wtchlist);
		clearInterval(this.add_prtfl);
	}

	// Make calls to the API endpoints every 15 seconds
	make_call_at_intervals() {
		this.call_api_first = false;
		this.call = setInterval(() => {
			this.valid_ticker = true;
			this.service.get_company_details().subscribe((resp_1) => {
				
				this.comp = resp_1[0];

				if ( this.comp.hasOwnProperty('ticker') && this.comp.detail === '') {
					this.valid_ticker = false;
				} 
				
				else {
					this.valid_ticker = true;
					this.market_closed_price = this.company_last_price?.c;
					let timestamp = this.company_last_price?.t;
					this.company_last_price = resp_1[1][0];
					
					this.service.get_company_daily_chart_data(timestamp).subscribe((resp_5) => {
						this.stock_daily_chart = resp_5[1];
						this.storing_company_summary();
						this.display_comp_daily_charts();
					});
				}
			});
		}, 15000);
	}

	storing_company_summary() {

		// If the Portfolio of the user is empty
		if (localStorage.getItem("portfolio") === null) {
			this.stock_bought = false;
		}

		else {
			let portfolio = JSON.parse(localStorage.getItem('portfolio'));
			if (this.comp.ticker in portfolio) {
				this.stock_bought = true;
			}
			else {
				this.stock_bought = false;
			}
		}

		//Watchlist of the user is empty
		if (localStorage.getItem('user_watchlist') === null) {
			this.in_user_watchlist = false;
		} 
		
		else {
			let user_watchlist = JSON.parse(localStorage.getItem('user_watchlist'));
			if (this.comp.ticker in user_watchlist) {
				this.in_user_watchlist = true;
			} 
			else {
				this.in_user_watchlist = false;
			}
		}

		let today = new Date();
		let day = ('0' + today.getDate().toString()).slice(-2)
		let month = ('0' + (today.getMonth() + 1).toString()).slice(-2)
		// alert(month)

		let year = today.getFullYear();
		
		let seconds = ('0' + today.getSeconds().toString()).slice(-2)
		let minutes = ('0' + today.getMinutes().toString()).slice(-2)
		let hour = ('0' + today.getHours().toString()).slice(-2)
		
		this.curr_datetime = year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;

		if (this.company_last_price?.c && this.company_last_price?.pc) {
			// console.log(this.company_last_price.c, this.company_last_price.pc)
			this.stock_price_change = this.company_last_price?.c - this.company_last_price?.pc;
			// console.log(this.stock_price_change)
			var changePercentage = (this.stock_price_change * 100) / this.company_last_price?.pc;
			this.price_chng = this.company_last_price?.d.toFixed(2) + ' (' + this.company_last_price?.dp.toFixed(2) + '%)';
		}

		// Calculate the value of Stock based on the last price
		this.curr_stock_total = this.curr_stock_quantiy * this.company_last_price?.c;

		var comp_last_trading_time = new Date(this.company_last_price?.t * 1000);
		var x = 60000;
		this.market_currtime_diff = (today.valueOf() - comp_last_trading_time.valueOf()) / x;
		
		// if the time difference is greater than 5 then the Market is Closed
		if (this.market_currtime_diff >= 5) {
			this.isClosed = true;
			
			day = ('0' + comp_last_trading_time.getDate().toString()).slice(-2)
			month = ('0' + (comp_last_trading_time.getMonth() + 1).toString()).slice(-2)
			// alert(month)

			year = comp_last_trading_time.getFullYear();
			
			seconds = ('0' + comp_last_trading_time.getSeconds().toString()).slice(-2)
			minutes = ('0' + comp_last_trading_time.getMinutes().toString()).slice(-2)
			hour = ('0' + comp_last_trading_time.getHours().toString()).slice(-2)

			// format => YYYY-MM-DD HH:MM:SS 
			this.market_closed_time = year + '-' + month +'-' + day + ' ' +hour +':' +minutes + ':' + seconds;
		}
	}

	// Display the daily Price Charts of the Company
	display_comp_daily_charts() {
		this.last_date = []; 
		var i = 0;
		var color_price_chart = 'black';
		
		// console.log(this.stock_price_change)
		var len = this.stock_daily_chart?.c.length;
		
		if (this.stock_price_change < 0) {
			color_price_chart = 'red';
		} 
		else if (this.stock_price_change > 0) {
			color_price_chart = 'green';
		}
		if (len != 0) {
			// if there is chart data in current search
			while (i < len) {
				const date_utc = this.stock_daily_chart?.t[i] * 1000;
				var temp_close = parseFloat(this.stock_daily_chart?.c[i].toFixed(3));
				this.last_date[i] = [date_utc, temp_close];
				i++;
			}

			this.comp_daily_chart = {
				chart: {
					height: 400,
				},

				title: {
					text: this.comp?.ticker + ' Hourly Price Variation',
					style: {
						color: 'grey',
					},
				},
				time: {
					useUTC: false,
				},

				responsive: {
					rules: [
						{ condition: {
								maxWidth: 500,
							},
						},
					],
				},

				scrollbar: {
					enabled: false
				},
				
				rangeSelector: {
					enabled: false,
				},

				series: [
					{
						name: this.comp?.ticker,
						data: this.last_date,
						type: 'line',
						color: color_price_chart,
					},
				],
				xAxis: {
					type: 'datetime',
					zoomEnabled: true,
					units: [
						['minute', [30]],
						['hour', [1]],
					],
				},
				yAxis: [
					{	opposite: true,
						height: '100%',
						offset: 0,
					},
				],
				plotOptions: {
					series: {
						pointPlacement: 'on',
					},
				},
				navigator: {
					enabled: false,
					series: {
						type: 'area',
						fillColor: color_price_chart,
					},
				}
				
			};
		}
	}

	// Display Company Historical Charts
	display_comp_historical_charts() {
		this.stock_ohlc = [];
		this.stock_volume = [];

		console.log(this.stock_hist_data)

		var len: number;
		
		if (this.stock_hist_data?.c.length)
		{
			len = this.stock_hist_data?.c.length; 
		}

		else{
			len = 0;
		}

		// console.log(this.stock_hist_data)

		if (len > 0) {

			var i = 0;

			while (i < len) {
				const date_utc = this.stock_hist_data?.t[i] * 1000;
				var opening_price = this.stock_hist_data?.o[i];
				var high_price = this.stock_hist_data?.h[i];
				var low_price = this.stock_hist_data?.l[i];
				var c = this.stock_hist_data?.c[i];
				var volume_traded = this.stock_hist_data?.v[i];
				this.stock_ohlc.push([date_utc, opening_price, high_price, low_price, c]);

				this.stock_volume.push([date_utc, volume_traded]);
				
				i++;
			}


			this.comp_charts = {
				rangeSelector: {
					selected: 2,
				},

				tooltip: {
					split: true,
				},
				title: {
					text: this.comp?.ticker + ' Historical',
				},

				subtitle: {
					text: 'With SMA and Volume by Price technical indicators',
				},

				yAxis: [
					{   startOnTick: false,
						endOnTick: false,
						labels: {
							align: 'right',
							x: -3,
						},
						title: {
							text: 'stock_ohlc',
						},
						height: '60%',
						lineWidth: 2,
						resize: {
							enabled: true,
						},
					},
					{
						labels: {
							align: 'right',
							x: -3,
						},
						title: {
							text: 'Volume',
						},
						top: '65%',
						height: '35%',
						offset: 0,
						lineWidth: 2,
					},
				],

				plotOptions: {
					series: {
						dataGrouping: {
							units: [
								['day', [1]],
								['week', [1]],
							],
						},
					},
				},

				series: [
					{
						type: 'candlestick',
						name: this.comp.ticker,
						id: 'aapl',
						zIndex: 2,
						data: this.stock_ohlc,
					},
					{
						type: 'column',
						name: 'Volume',
						id: 'volume',
						data: this.stock_volume,
						yAxis: 1,
					},
					{
						type: 'vbp',
						linkedTo: 'aapl',
						params: {
							volumeSeriesID: 'volume',
						},
						dataLabels: {
							enabled: false,
						},
						zoneLines: {
							enabled: false,
						},
					},
					{
						type: 'sma',
						linkedTo: 'aapl',
						zIndex: 1,
						marker: {
							enabled: false,
						},
					},
				],
			};
		}
	}

	// Company Related News
	storing_company_news() {
		var i = 0, articles = 0, arr_len = this.company_news.length;
		var result = [];
		
		while (i < arr_len) {
			
			let news_url = this.company_news[i].hasOwnProperty('url') && !!this.company_news[i].url; 
			let news_source = this.company_news[i].hasOwnProperty('source') && !!this.company_news[i].source; 
			let news_dt = this.company_news[i].hasOwnProperty('datetime') && !!this.company_news[i].datetime; 
			let news_image = this.company_news[i].hasOwnProperty('image') && !!this.company_news[i].image; 
			let news_headline = this.company_news[i].hasOwnProperty('headline') && !!this.company_news[i].headline; 
			let news_summary = this.company_news[i].hasOwnProperty('summary') && !!this.company_news[i].summary; 
			
			// Only Add to the result if all the data is Present
			if (news_headline && news_image && news_source && news_dt && news_summary && news_url) {
				result.push(this.company_news[i]);
				arr_len--;
				articles++;
			}
			i++;

			// Break if we have 20 news articles
			if (articles == 20) {
				break;
			}
		}
		this.company_news = result;
		console.log(this.company_news)
	}

	update_watchlist() {
		let selected_ticker = this.comp?.ticker;

		// If the watchlist is Empty
		if (localStorage.getItem('user_watchlist') === null) {
			let user_watchlist = {};
			user_watchlist[selected_ticker] = { ticker: selected_ticker, name: this.comp?.name };
			localStorage.setItem('user_watchlist', JSON.stringify(user_watchlist));
			this.in_user_watchlist = true;
			this.alert_timeout_disappear('add_to_watchlist');
		} 
		else {
			let user_watchlist = JSON.parse(localStorage.getItem('user_watchlist'));
			localStorage.removeItem('user_watchlist');
			
			// If the ticker is in watchlist then remove it from the watchlist
			if (selected_ticker in user_watchlist) {
				if (Object.keys(user_watchlist).length === 1) {
					this.in_user_watchlist = false;
					this.alert_timeout_disappear('remove_from_watchlist');
					return;
				} 
				else {
					delete user_watchlist[selected_ticker];
				}

				this.in_user_watchlist = false;
				this.alert_timeout_disappear('remove_from_watchlist');
			}

			// Else add the ticker to the Watchlist
			else {
				user_watchlist[selected_ticker] = { ticker: selected_ticker, name: this.comp?.name };
				this.in_user_watchlist = true;
				this.alert_timeout_disappear('add_to_watchlist');
				var ticker_dict = {};
				
				Object.keys(user_watchlist).sort().forEach(function (key) {
					ticker_dict[key] = user_watchlist[key];
					});
				user_watchlist = ticker_dict;
			}
			localStorage.setItem('user_watchlist', JSON.stringify(user_watchlist));
		}
	}

	// Company Insights 
	storing_comp_insights() {
		this.comp_positive_reddit = this.company_sent_reddit?.positiveMention
		this.comp_negative_twitter = this.company_sent_twitter?.negativeMention
		this.comp_mention_twitter = this.company_sent_twitter?.mention
		this.comp_negative_reddit = this.company_sent_reddit?.negativeMention
		this.comp_positive_twitter = this.company_sent_twitter?.positiveMention
		this.comp_mention_reddit = this.company_sent_reddit?.mention

	}

	display_company_recom() {
		console.log(this.company_recom_data.buy)
		let bar_chart_colors = ["#2d473a", "#1d8c54", "#bc8c1d", "#f4585a", "#803131"]
		this.comp_recommendation_charts = {
			chart: {
				type: 'column',
				events: {
					redraw: function () {
						this.Highcharts.reflow();
					},
				},
				
			},
			colors: bar_chart_colors,
			title: {
				text: `Recommendation Trends`
			},

			tooltip: {
				headerFormat: '<b>{point.x}</b><br/>',
				pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
			},

			xAxis: {
				categories: this.company_recom_data?.xcateg
			},

			yAxis: {
				min: 0,
				title: {
					text: 'Analysis'
				},
				stackLabels: {
					enabled: false,
				}
			},

			legend: {
				align: 'center',
				verticalAlign: 'bottom',
				backgroundColor:
					this.Highcharts.defaultOptions.legend.backgroundColor || 'white', shadow: false
			},
			
			plotOptions: {
				column: {
					stacking: 'normal',
					dataLabels: {
						enabled: true
					}
				}
			},

			series: [{
				name: 'Strong Buy',
				data: this.company_recom_data?.strongBuy
			}, {
				name: 'Buy',
				data: this.company_recom_data?.buy
			}, {
				name: 'Hold',
				data: this.company_recom_data?.hold
			}, {
				name: 'Sell',
				data: this.company_recom_data?.sell
			}, {
				name: 'Strong Sell',
				data: this.company_recom_data?.strongSell
			}]
		}

	}

	get_company_earnings() {
		console.log(this.company_earnings_data)
		this.EPScharts_optns = {
			chart: {
				type: 'spline',
				height: 400,
			},
			title: {
				text: 'Historical EPS Surprise'
			},
			
			legend: {
				enabled: true
			},

			plotOptions: {
				spline: {
					marker: {
						enable: false
					}
				}
			},
			xAxis: {
				categories: this.company_earnings_data?.xcateg
			},

			yAxis: {
				title: {
					text: 'Quarterly EPS'
				}
			},
			
			tooltip: {
				shared: true,
				useHTML: true,
				headerFormat: '{point.x}<br>',
			},

			series: [{
				name: 'Actual',
				data: this.company_earnings_data.actual
			}, 
			{
				name: 'Estimate',
				data: this.company_earnings_data.estimate
			}]

		}

	}


	stock_buy(curr_stock_quantiy, latest_total, selected_ticker) {
		// If Portfolio is Empty then create a dictionary and add values to it
		if (localStorage.getItem('portfolio') === null) {
			let portfolio = {};
			
			portfolio[selected_ticker] = {
				ticker: selected_ticker,
				name: this.comp.name,
				stock_quantity: curr_stock_quantiy,
				total_cost: latest_total,
				average_cost: latest_total / parseInt(curr_stock_quantiy),
			};

			localStorage.setItem('portfolio', JSON.stringify(portfolio));
		} 
		else {
			
			let portfolio = JSON.parse(localStorage.getItem('portfolio'));
			localStorage.removeItem('portfolio');
			
			if (selected_ticker in portfolio) 
			{
				portfolio[selected_ticker].stock_quantity = parseInt(portfolio[selected_ticker].stock_quantity) + parseInt(curr_stock_quantiy);
				portfolio[selected_ticker].total_cost = parseFloat(portfolio[selected_ticker].total_cost) + latest_total;
				portfolio[selected_ticker].average_cost = parseFloat(portfolio[selected_ticker].total_cost) / parseInt(portfolio[selected_ticker].stock_quantity);
			} 
			else {
				portfolio[selected_ticker] = {
					ticker: selected_ticker,
					name: this.comp.name,
					stock_quantity: curr_stock_quantiy,
					total_cost: latest_total,
					average_cost: latest_total / parseInt(curr_stock_quantiy),
				};
				
				var portfolio_dict = {};
				
				Object.keys(portfolio).sort().forEach(function (key) {
					portfolio_dict[key] = portfolio[key];
				});
				portfolio = portfolio_dict;
			}
			localStorage.setItem('portfolio', JSON.stringify(portfolio));
		}

		this.user_wallet = this.user_wallet - latest_total;
		localStorage.setItem("user_wallet", this.user_wallet.toString())
		
		if (curr_stock_quantiy > 0)
		{
			this.stock_bought = true;
		}
		
		document.getElementById('stock-sell').style.display = 'inline-block';
		this.alert_timeout_disappear('add_to_portfolio');
	}

	openBuyModal(stock_buy_content) {
		this.curr_stock_qty.setValue(0);
		this.curr_stock_total = 0.0;
		
		this.modalService.open(stock_buy_content, { ariaLabelledBy: 'modal-title' })
			.result.then(
				(result) => {
					this.res_close = `Closed with: ${result}`;
				},
				(reason) => {
					this.res_close = `Dismissed ${this.getDismissReason(reason)}`;
				}
			);

		
		(<HTMLInputElement>document.getElementById('stock_quantity')).setAttribute('type','text');
		(<HTMLInputElement>document.getElementById('stock_quantity')).setSelectionRange(1, 1);
		(<HTMLInputElement>document.getElementById('stock_quantity')).setAttribute('type','number');

		this.max_buy_possible = this.user_wallet;

		document.getElementById('stock_quantity').addEventListener('input', (e) => {
			this.curr_stock_quantiy = (<HTMLTextAreaElement>e.target).value;
			this.curr_stock_total = this.curr_stock_quantiy * this.company_last_price.c;
		});

		(<HTMLInputElement>document.getElementById('finalBuy')).addEventListener(
			'click',
			(e) => {
				this.stock_buy(this.curr_stock_quantiy, this.curr_stock_total, this.comp.ticker);
			}
		);
	}

	openSellModal(sell_stock_content, selected_ticker) {
		this.curr_stock_qty.setValue(0);
		let curr_stock_quantiy;
		
		this.modalService
			.open(sell_stock_content, { ariaLabelledBy: 'modal-title' })
			.result.then((result) => {
				this.res_close = `Closed with: ${result}`;
			}, 
			(reason) => {
				this.res_close = `Dismissed ${this.getDismissReason(reason)}`;
			}
			);

		(<HTMLInputElement>document.getElementById("sellQty")).setAttribute('type', 'text');
		(<HTMLInputElement>document.getElementById("sellQty")).setSelectionRange(1, 1);
		(<HTMLInputElement>document.getElementById("sellQty")).setAttribute('type', 'number');

		this.max_sell_possible = (JSON.parse(localStorage.getItem('portfolio')))[selected_ticker].stock_quantity;

		document.getElementById('sellQty').addEventListener('input', (e) => {
			curr_stock_quantiy = (<HTMLTextAreaElement>e.target).value;
			this.curr_stock_total = curr_stock_quantiy * this.company_last_price.c;
		});

		(<HTMLInputElement>document.getElementById("finalSell")).addEventListener('click', (e) => {
			this.sell_stock(curr_stock_quantiy, this.curr_stock_total, selected_ticker);
		});
	}

	sell_stock(curr_stock_quantiy, latest_total, selected_ticker) {
		let portfolio = JSON.parse(localStorage.getItem('portfolio'));
		localStorage.removeItem('portfolio');
		
		if (parseInt(curr_stock_quantiy) === parseInt(portfolio[selected_ticker].stock_quantity)) {
			this.stock_bought = false;
			document.getElementById('stock-sell').style.display = 'none';
			
			if (Object.keys(portfolio).length === 1) {
				this.user_wallet = this.user_wallet + latest_total;
				localStorage.setItem("user_wallet", this.user_wallet.toString())
				return;
			}
			else {
				delete portfolio[selected_ticker];
			}
		}
		
		else {
			portfolio[selected_ticker].stock_quantity = parseInt(portfolio[selected_ticker].stock_quantity) - parseInt(curr_stock_quantiy);
			portfolio[selected_ticker].total_cost = parseFloat(portfolio[selected_ticker].total_cost) - (parseFloat(portfolio[selected_ticker].average_cost) * parseInt(curr_stock_quantiy));
		}
		this.user_wallet = this.user_wallet + latest_total;
		localStorage.setItem("user_wallet", this.user_wallet.toString())
		localStorage.setItem('portfolio', JSON.stringify(portfolio));
	}

	// Company News Modal
	comp_news_modal(news: any, news_article: any) {
		this.company_news_modal = news_article;
		console.log(this.company_news_modal)
		
		var news_date = new Date(this.company_news_modal.datetime*1000);
		
		this.company_news_modal.datetime =
			news_date.toLocaleDateString('en-US', { month: 'long', day: '2-digit' }) + ', ' + news_date.toLocaleDateString('en-US', { year: 'numeric' });
		
			this.modalService
			.open(news, { ariaLabelledBy: 'modal-basic-title' })
			.result.then(
				(result) => {
					this.res_close = `Closed with: ${result}`;
				},
				(reason) => {
					this.res_close = `Dismissed ${this.getDismissReason(reason)}`;
				}
			);
	}

	twitterURL() {
		this.twitter_url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(this.company_news_modal?.title) + '&url=' + encodeURIComponent(this.company_news_modal?.url);
	}

	alert_timeout_disappear(id: string) {
		this.close_alert = false;
		document.getElementById(id).style.display = 'block';
		
		if (id === 'remove_from_watchlist') {
			this.rmv_wtchlist = setTimeout(function () {
				if (!this.close_alert) {
					document.getElementById(id).style.display = 'none';
				}
			}, 5000);
		}

		else if (id === 'add_to_watchlist') {
			this.add_wtchlist = setTimeout(function () {
				if (!this.close_alert) {
					document.getElementById(id).style.display = 'none';
				}
			}, 5000);
		}

		else if (id === 'add_to_portfolio') {
			this.add_prtfl = setTimeout(function () {
				if (!this.close_alert) {
					document.getElementById(id).style.display = 'none';
				}
			}, 5000);
		}
	}

	dismiss_alert(id) {
		this.close_alert = true;
		document.getElementById(id).style.display = 'none';
	}

	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else {
			return `with: ${reason}`;
		}
	}


	update_act_class() { 
		document.querySelectorAll('.nav-item').forEach(item => {
			item.classList.remove('active');
		});
		document.getElementById('search').classList.add('active');
	}
}


// function int_clr(call: any) {
// 	throw new Error('Function not implemented.');
// }

