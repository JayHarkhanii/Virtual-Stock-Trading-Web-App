import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSearchNavbarComponent } from './stock-search-navbar.component';

describe('StockSearchNavbarComponent', () => {
  let component: StockSearchNavbarComponent;
  let fixture: ComponentFixture<StockSearchNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockSearchNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockSearchNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
