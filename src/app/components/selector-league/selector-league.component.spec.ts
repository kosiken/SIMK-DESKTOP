import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorLeagueComponent } from './selector-league.component';

describe('SelectorLeagueComponent', () => {
  let component: SelectorLeagueComponent;
  let fixture: ComponentFixture<SelectorLeagueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorLeagueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorLeagueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
