import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamDashboardNavigatorComponent } from './team-dashboard-navigator.component';

describe('TeamDashboardNavigatorComponent', () => {
  let component: TeamDashboardNavigatorComponent;
  let fixture: ComponentFixture<TeamDashboardNavigatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamDashboardNavigatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamDashboardNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
