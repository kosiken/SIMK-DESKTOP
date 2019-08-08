import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-selector-league',
  templateUrl: './selector-league.component.html',
  styleUrls: ['./selector-league.component.scss']
})
export class SelectorLeagueComponent implements OnInit {
  private flashing = false;
  message = '';
  error = false;

  constructor(private store: Store<{ message: any }>) {}

  ngOnInit() {
    let self = this;
    this.store.pipe(map(value => value.message)).subscribe({
      next(v) {
        self.error = v.error;
        self.flash(v.current);
      }
    });
  }

  setFlash() {
    return {
      open: this.flashing,
      'bg-secondary': true,
      'p-4': true
    };
  }

  flash(m: string) {
    this.message = m;
    const self = this;
    self.flashing = true;

    setTimeout(() => {
      self.flashing = false;
    }, 2000);
  }
}
