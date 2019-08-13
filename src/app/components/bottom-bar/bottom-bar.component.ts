import { Component, Input, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Team, Player, Fixture, League } from '../../models';
// import {animate, state, style, transition, trigger} from '@angular/animations';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.scss']
})
export class BottomBarComponent implements OnInit {
  showOps = {
    wrapper: true,
    comeOut: false
  };
  options = [
    { name: 'MyTeam', icon: 'home', id: 0 },
    { name: 'Standings', icon: 'format_line_spacing', id: 1 },
    { name: 'Stats', icon: 'insert_chart', id: 2 },
    {
      name: 'Trade Finder',
      icon: 'search',
      id: 3
    },
    { name: 'Calender', icon: 'perm_contact_calendar', id: 4 }
  ];
  private sus: Subscription;
  constructor(
    private router: Router,
    private store: Store<{
      league: {
        league: League;
        set: boolean;
      };
    }>
  ) {}

  ngOnInit() {}
  tween() {
    // this.showOps.wrapper = !this.showOps.wrapper;
    this.showOps.comeOut = !this.showOps.comeOut;
  }
  setClass() {
    return {
      wrapper: this.showOps.wrapper,
      comeOut: this.showOps.comeOut,

      'shadow-t': this.showOps.comeOut
    };
  }
  doAction(n) {
    const self = this;
    const obs = this.store.pipe(map(v => v.league));
    if (n === 0) {
      this.sus = obs.subscribe({
        next(value) {
          if (value.set) {
            let team = value.league.selectTeam;
            self.router.navigate(['team/' + team]);
          }
        }
      });
    } else if (n === 1) {
      self.router.navigate(['stands']);
    } else if (n === 2) {
      self.router.navigate(['stats']);
    }
  }
}
