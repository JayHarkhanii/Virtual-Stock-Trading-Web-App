// Angular Material Modules
import { MatTabsModule } from '@angular/material/tabs'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { MatAutocompleteModule } from '@angular/material/autocomplete'; 
import { MatButtonModule } from '@angular/material/button'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents } from './app-routing.module';

// HttpClient Module
import { HttpClientModule } from '@angular/common/http';

// HighChats Modules
import { HighchartsChartModule } from 'highcharts-angular';
import {MatPaginatorModule} from '@angular/material/paginator';



@NgModule({
  declarations: [
    AppComponent,
    routingComponents
  ],
  
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule, 
    ReactiveFormsModule, 
    HttpClientModule, 
    MatButtonModule, 
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    CommonModule, 
    NgbModule,
    MatAutocompleteModule, 
    HighchartsChartModule,
    MatPaginatorModule
  ],
  
  exports: [RouterModule, ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }

