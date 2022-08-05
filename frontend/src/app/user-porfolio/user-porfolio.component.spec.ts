import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPorfolioComponent } from './user-porfolio.component';

describe('UserPorfolioComponent', () => {
  let component: UserPorfolioComponent;
  let fixture: ComponentFixture<UserPorfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPorfolioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPorfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
