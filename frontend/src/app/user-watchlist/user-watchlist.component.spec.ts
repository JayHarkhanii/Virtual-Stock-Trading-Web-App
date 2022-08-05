import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWatchlistComponent } from './user-watchlist.component';

describe('UserWatchlistComponent', () => {
  let component: UserWatchlistComponent;
  let fixture: ComponentFixture<UserWatchlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWatchlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWatchlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
