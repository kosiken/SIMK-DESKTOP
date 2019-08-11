import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import Fixture from '../../models/Fixture';

@Component({
  selector: 'app-fixture',
  templateUrl: './fixture.component.html',
  styleUrls: ['./fixture.component.scss']
})
export class FixtureComponent implements OnInit {
  @Input() fixture: Fixture;
  @Output() bild: EventEmitter<Fixture> = new EventEmitter();
  mode = false;
  location: string;

  constructor() {}

  ngOnInit() {
    this.location = `?location=${window.location.pathname}`;
  }

  setClass() {
    return {
      modal: true,
      shows: this.mode
    };
  }

  gitIt(num: number) {
    let ans;
    if (this.fixture.score) {
      ans = this.fixture.score.home > this.fixture.score.away;
      if (num < 1) {
        return {
          'text-success': ans,
          'text-danger': !ans
        };
      } else {
        return {
          'text-success': !ans,
          'text-danger': ans
        };
      }
    } else {
      return {
        span: true
      };
    }
  }

  emitClick(f: Fixture) {
    this.bild.emit(f);
  }
}
