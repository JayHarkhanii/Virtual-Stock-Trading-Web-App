import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms'; //sb-added - FormControl for autocomplete
import { AppServiceService } from '../app-service.service'; //sb-added
import { ActivatedRoute, Router } from '@angular/router'; //sb-added

// let debounce = function (func, wait, immediate) {
// 	var timeout;
// 	return function () {
// 		var context = this,
// 			args = arguments;
// 		var later = function () {
// 			timeout = null;
// 			if (!immediate) func.apply(context, args);
// 		};
// 		var callNow = immediate && !timeout;
// 		clearTimeout(timeout);
// 		timeout = setTimeout(later, wait);
// 		if (callNow) func.apply(context, args);
// 	};
// };

@Component({
	selector: 'app-stock-search',
	templateUrl: './stock-search.component.html',
	styleUrls: ['./stock-search.component.css'],
})
export class StockSearchComponent implements OnInit {
	
	@Input() ticker_symbol: string;
	comp_ticker_symbol: string = '';
	related_companies: any;
	data_loaded: boolean;
	frm_ctrl = new FormControl();
	inp_entered: boolean;
	close_alert: boolean;

	constructor(  private route: ActivatedRoute, private service: AppServiceService, private router: Router) { }

	ngOnInit(): void {
		this.data_loaded = false;
		this.inp_entered = true;
		this.service.setNavbar();
		// this.service.isSaved = false;
		document.getElementById('comp_ticker').addEventListener('input', this.autocomp_data_search);
		// Remove the current Active Class
		this.removeActiveClass();
	}
	
	removeActiveClass() {
		document.querySelectorAll('.nav-item').forEach((item) => {
			item.classList.remove('active');
		});
	}

	form_submit(event: Event) {
		event.preventDefault();

		if ((<HTMLInputElement>(document.getElementById('comp_ticker'))).value === ''){
			this.inp_entered = false;
			// alert(this.inp_entered)
			// document.getElementById('empty_input').style.display = 'block';
			// this.router.navigate(['search/']);
			//  return;
		}

		else
		{
		this.inp_entered = true;
		var input_ticker = (<HTMLInputElement>(document.getElementById('comp_ticker'))).value.toUpperCase();
		// document.getElementById('empty_input').style.display = 'none';
		this.service.get_company_ticker_sym(input_ticker);
		localStorage.setItem("ticker_symbol", input_ticker)
		this.router.navigate(['search/' + input_ticker], {relativeTo: this.route.parent});
		}
	}
	
	// Get the data of the related companies
	autocomp_data_search = (event) => {
			var auto_comp_result = [];
			this.related_companies = null;
			var companies;
			this.data_loaded = false;
			this.comp_ticker_symbol = event.target.value;


			if (this.comp_ticker_symbol !== '') {
				this.service.get_autocomplete_data(this.comp_ticker_symbol).subscribe((res) => {
					companies = res;
					companies = companies.result;
					var arr_len = companies.length;
					for (var i = 0; i < arr_len; i++) {
						// Only add to the result if the Company has a Common Stock
						if (companies[i].type == 'Common Stock' && !companies[i].displaySymbol.includes('.')) {
							auto_comp_result.push(companies[i]);
						}
					}
					
					this.data_loaded = true;
					this.related_companies = auto_comp_result;
					console.log(this.related_companies);
					this.comp_ticker_symbol = '';
				});
			}
		}


	disp_form(input: string) {
		return input ? input.toUpperCase() : undefined;
	}
	
	dismiss_alert(id) {
		this.close_alert = true;
		document.getElementById(id).style.display = 'none';
	}

}
