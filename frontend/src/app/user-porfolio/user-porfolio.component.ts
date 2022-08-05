import { Component, OnInit } from '@angular/core';
import { AppServiceService } from '../app-service.service';
import { Router } from '@angular/router'; 
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-user-porfolio',
	templateUrl: './user-porfolio.component.html',
	styleUrls: ['./user-porfolio.component.css'],
})
export class UserPorfolioComponent implements OnInit {
	portfolio: any;
	stock_last_price: any = new Array();
	last: any = {};
	change: any = {};
	marketVal: any = {};
	qty_stock = new FormControl();
	regular_exp = /^\d*$/;
	total_money = 0.0;
	max_stock_sell: any;
	modalMaxBuy: any;
	modalContent: any;
	closeResult = '';
	portfolio_in_localS: boolean;
	tempResp: any;
	user_wallet: any;
	comp_selected: any;
	alert_comp: boolean;
	added_to_pf: any;
	removed_from_pf: any;
	isBought: boolean
	isSold: boolean

	constructor( private router: Router, private service: AppServiceService,  private modalService: NgbModal) { }

	ngOnInit(): void {
		this.isBought = false;
		this.isSold = false;
		document.getElementById('added_to_pf').style.display = 'none';
		document.getElementById('removed_from_pf').style.display = 'none';
		this.user_wallet = JSON.parse(localStorage.getItem('user_wallet'));
		this.set_pf_active();
		
		
		if (localStorage.getItem('portfolio') !== null){
			this.portfolio_in_localS = true;
			document.getElementById('empty-pf').style.display = 'none';

			var user_portfolio = Object.entries(JSON.parse(localStorage.getItem('portfolio')));
			this.show_portfolio(user_portfolio);
		}
		else if (localStorage.getItem('portfolio') === null) {
			this.portfolio_in_localS = false;
			document.getElementById('empty-pf').style.display = 'block';
		} 	
	}
		


	update_pf_page() {
		if (localStorage.getItem('portfolio') !== null){
			this.portfolio_in_localS = true;
			document.getElementById('empty-pf').style.display = 'none';

			var user_portfolio = Object.entries(JSON.parse(localStorage.getItem('portfolio')));
			this.show_portfolio(user_portfolio);
		}
		else if (localStorage.getItem('portfolio') === null) {
			this.portfolio_in_localS = false;
			document.getElementById('empty-pf').style.display = 'block';
		} 	
	}
		

	ngOnDestroy(): void {
		clearInterval(this.added_to_pf);
		clearInterval(this.removed_from_pf);
	}


	show_portfolio(user_portfolio) {
		const arr_len = user_portfolio.length;
		
		for (let i = 0; i < arr_len; i++){
			this.service.get_latest_price(user_portfolio[i][0]).then((res) => {
				this.stock_last_price = res;
				let curr_ticker = user_portfolio[i][0];
				
				if(this.stock_last_price.c){
					this.last[curr_ticker] = this.stock_last_price.c;
					// Calculate the market value and price change
					this.change[curr_ticker] = (parseFloat(this.last[curr_ticker]) - parseFloat(user_portfolio[i][1].average_cost)).toFixed(2);
					this.marketVal[curr_ticker] = (parseFloat(this.last[curr_ticker]) * parseInt(user_portfolio[i][1].stock_quantity)).toFixed(2);
					
					this.last[curr_ticker] = this.last[curr_ticker].toFixed(2);
				}

				else if (!this.stock_last_price.c) {
					this.last[curr_ticker] = ' -';
					this.change[curr_ticker] = ' -';
					this.marketVal[curr_ticker] = ' -';
				}

			});
		}

		console.log(this.last, this.change)
		this.portfolio = user_portfolio
	}


	openDetails(ticker: any) {
		this.router.navigate(['search/' + ticker]);
	}

	buy_modal_open(buycontent: any, stock_ticker: string | number) {
		this.qty_stock.setValue(0);
		let quantity_entered: any;
		this.modalContent = { ticker: stock_ticker, last: this.last[stock_ticker] };
		
		// Open the Buy Modal
		this.modalService.open(buycontent, { ariaLabelledBy: 'modal-title' })
			.result.then(
				(result) => {
					this.closeResult = `Closed with: ${result}`;
				},
				(reason) => {
					this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
				}
			);

		(<HTMLInputElement>document.getElementById('buy_comp_stock')).setAttribute('type', 'text');
		(<HTMLInputElement>document.getElementById('buy_comp_stock')).setSelectionRange(1, 1);
		(<HTMLInputElement>document.getElementById('buy_comp_stock')).setAttribute( 'type', 'number');

		this.modalMaxBuy = this.user_wallet;

		// Listen to the buy stock input field
		document.getElementById('buy_comp_stock').addEventListener('input', (event) => {
			quantity_entered = (<HTMLTextAreaElement>event.target).value;
			this.total_money = quantity_entered * this.last[stock_ticker];
		});

		// When the Buy Button inside the Modal is clicked then call the buy_comp_Stock function
		(<HTMLInputElement>document.getElementById('buy_button')).addEventListener( 'click',
			(e) => { this.buy_stock( this.total_money, stock_ticker, quantity_entered); }
		);
	}

	sell_modal_open(sellcontent: any, stock_ticker: string | number) {
		this.qty_stock.setValue(0);
		let quantity_entered;
		this.modalContent = { ticker: stock_ticker, last: this.last[stock_ticker] };
		
		// Open the Sell Modal using modalService
		this.modalService.open(sellcontent, { ariaLabelledBy: 'modal-title' })
			.result.then(
				(result) => {
					this.closeResult = `Closed with: ${result}`;
				},
				(reason) => {
					this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
				}
			);

		(<HTMLInputElement>document.getElementById('sell_comp_stock')).setAttribute( 'type', 'text' );
		(<HTMLInputElement>document.getElementById('sell_comp_stock')).setSelectionRange(1, 1);
		(<HTMLInputElement>document.getElementById('sell_comp_stock')).setAttribute('type', 'number');

		// Get the Maxium number of stocks we can sell
		this.max_stock_sell = JSON.parse(localStorage.getItem('portfolio'))[stock_ticker].stock_quantity;

		// Add event listener to the input field
		document.getElementById('sell_comp_stock').addEventListener('input', (e) => {
			quantity_entered = (<HTMLTextAreaElement>e.target).value;
			this.total_money = quantity_entered * this.last[stock_ticker];
		});

		// When the Sell Button inside the Modal is clicked then call the sell_stock function
		(<HTMLInputElement>document.getElementById('finalSell')).addEventListener('click',
			(e) => {
				this.sell_stock(this.total_money, stock_ticker, quantity_entered);
			}
		);
	}

	closeAlert(id) {
		this.alert_comp = true;
		document.getElementById(id).style.display = 'none';
	}

	buy_stock(curr_trade, stock_ticker, quantity_entered) {
		this.comp_selected = stock_ticker;
		let portfolio = JSON.parse(localStorage.getItem('portfolio'));
		localStorage.removeItem('portfolio');
		portfolio[stock_ticker].stock_quantity = parseInt(portfolio[stock_ticker].stock_quantity) + parseInt(quantity_entered);
		portfolio[stock_ticker].total_cost = parseFloat(portfolio[stock_ticker].total_cost) + parseFloat(curr_trade);
		portfolio[stock_ticker].average_cost = parseFloat(portfolio[stock_ticker].total_cost) / parseInt(portfolio[stock_ticker].stock_quantity);
		localStorage.setItem('portfolio', JSON.stringify(portfolio));
		this.user_wallet = this.user_wallet - curr_trade;
		localStorage.setItem('user_wallet', this.user_wallet.toString());
		this.alert_disappear('added_to_pf', stock_ticker);
		this.update_pf_page();
	}

	sell_stock(curr_trade, stock_ticker, quantity_entered) {
		console.log('Hi' + stock_ticker)
		let portfolio = JSON.parse(localStorage.getItem('portfolio'));
		localStorage.removeItem('portfolio');

	

		if (parseInt(quantity_entered) === parseInt(portfolio[stock_ticker].stock_quantity) && Object.keys(portfolio).length === 1){
			console.log('Hey there!')
			document.getElementById('pfcard' + stock_ticker).style.display = 'none';
			this.user_wallet = this.user_wallet + curr_trade;
			// portfolio[stock_ticker].stock_quantity = 0
			this.alert_disappear('removed_from_pf', stock_ticker);
			localStorage.setItem('user_wallet', this.user_wallet.toString());
		
			
			// Display Empty Portfolio Warning
			document.getElementById('empty-pf').style.display = 'block';
			// document.getElementById('sell-btn').style.display = 'none';
			return;
		}

		else if (parseInt(quantity_entered) === parseInt(portfolio[stock_ticker].stock_quantity) && Object.keys(portfolio).length > 1){
			delete portfolio[stock_ticker];
			
			this.user_wallet = this.user_wallet + curr_trade;
			// portfolio[stock_ticker].stock_quantity = 0
			localStorage.setItem('user_wallet', this.user_wallet.toString());
			document.getElementById('pfcard' + stock_ticker).style.display = 'none';	
		}

		else {
			
			portfolio[stock_ticker].total_cost = parseFloat(portfolio[stock_ticker].total_cost) - (parseFloat(portfolio[stock_ticker].average_cost) * parseInt(quantity_entered));
			portfolio[stock_ticker].stock_quantity = parseInt(portfolio[stock_ticker].stock_quantity) - parseInt(quantity_entered);
			this.user_wallet = this.user_wallet + curr_trade;
			localStorage.setItem('user_wallet', this.user_wallet.toString());

		}

		localStorage.setItem('portfolio', JSON.stringify(portfolio));
		this.alert_disappear('removed_from_pf', stock_ticker);
		this.comp_selected = stock_ticker;
		this.update_pf_page();
	}


	private getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} 
		else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} 
		else {
			return `with: ${reason}`;
		}
	}

	alert_disappear(id, ticker) {
		this.alert_comp = false;
		
		document.getElementById(id).style.display = 'block';
		
		if (id === 'added_to_pf') {
			// this.isBought = true
			// alert(this.isBought)
			this.added_to_pf = setTimeout(function () {
				if (!this.alert_comp) {
					// this.isBought = false
					document.getElementById(id).style.display = 'none';
				}
			}, 5000);
		}
		if (id === 'removed_from_pf') {
			// this.isSold = true
			this.removed_from_pf = setTimeout(function () {
				if (!this.alert_comp) {
					// this.isSold = false
					document.getElementById(id).style.display = 'none';
				}
			}, 5000);
		}
	}

	set_pf_active() {
		document.querySelectorAll('.nav-item').forEach((item) => { item.classList.remove('active'); });
		document.getElementById('portfolio').classList.add('active');
	}
}
