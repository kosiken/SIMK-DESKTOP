import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgCircleComponent } from './svg-circle.component';

describe('SvgCircleComponent', () => {
  let component: SvgCircleComponent;
  let fixture: ComponentFixture<SvgCircleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgCircleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
