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
import { League, Team } from '../../models';
import { ConferenceObj } from '../../models/Rating';
// import from '../../models/Team';
import { Router } from '@angular/router';
@Component({
  selector: 'app-standings',
  templateUrl: './standings.component.html',
  styleUrls: ['./standings.component.scss'],
  animations: [
    trigger('rising', [
      state('void', style({ marginTop: '100vh' })),

      transition('void => *, * => void', [animate(500)])
    ])
  ]
})
export class StandingsComponent implements OnInit, OnDestroy {
  conference: ConferenceObj;
  sus: Subscription;
  viewing = 'Eastern';
  selTeam: Team;
  teamView = false;
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
        self.selTeam = value.league.getTeam(value.league.selectTeam);
        self.conference = value.league.ConfObj;
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
}
