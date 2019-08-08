import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureDashboardComponent } from './fixture-dashboard.component';

describe('FixtureDashboardComponent', () => {
  let component: FixtureDashboardComponent;
  let fixture: ComponentFixture<FixtureDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixtureDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
