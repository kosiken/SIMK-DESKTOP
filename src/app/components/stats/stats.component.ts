import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { League, Player } from '../../models';

import { Router } from '@angular/router';
@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  animations: [
    trigger('rising', [
      state('void', style({ marginTop: '100vh' })),

      transition('void => *, * => void', [animate(500)])
    ])
  ]
})
export class StatsComponent implements OnInit, OnDestroy {
  players: Player[] = [];
  playersShowing: Player[];
  private sus: Subscription;
  filtering = '*';
  pos = ['*', 'C', 'PF', 'SF', 'SG', 'PG'];

  constructor(
    private store: Store<{
      league: {
        league: League;
        set: boolean;
      };
    }>,
    private router: Router
  ) {}

  ngOnInit() {
    const self = this;
    const obs = this.store.pipe(map(v => v.league));
    this.sus = obs.subscribe(value => {
      if (value.set) {
        self.players = value.league.players;
        self.playersShowing = value.league.players;
      } else {
        self.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy() {
    if (this.sus) {
      this.sus.unsubscribe();
    }
  }

  filterBy(value: string) {
    this.filtering = value;
    this.playersShowing = this.players.filter(
      v => value === '*' || v.position === value
    );
  }
}
