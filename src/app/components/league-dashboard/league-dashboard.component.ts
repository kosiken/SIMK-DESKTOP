import { Component, HostListener, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
// import {TimelineMax, Expo, Elastic} from 'gsap';
import { LeagueService } from '../../providers';
import { Store, select } from '@ngrx/store';
import { loadLeague, newMessage } from '../../store/actions';
import { Subscription, interval, from } from 'rxjs';
import { map, debounce, mergeMap, take } from 'rxjs/operators';
import { League, Fixture, IAAState } from '../../models';

interface Settings {
  games: number;
  conferences: number;
  conferenceNames: string[];
}
@Component({
  selector: 'app-league-dashboard',
  templateUrl: './league-dashboard.component.html',
  styleUrls: ['./league-dashboard.component.scss']
})
export class LeagueDashboardComponent implements OnInit {
  league: string;
  settings: Settings;
  LeagueObj: League;
  urlTeam = './league-assets/teams.json';
  urlPlayers = './league-assets/players.json';
  private team = false;
  protected setTeam: string;
  private playing = false;
  private playSuscription: Subscription;

  constructor(
    // private api: ElectronService,
    private route: ActivatedRoute,
    private io: LeagueService,
    private store: Store<{
      league: any;
    }>
  ) {}

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    this.league = name;
    const self = this;
    this.store.pipe(map(value => value.league)).subscribe(leag => {
      if (leag.set) {
        self.LeagueObj = leag.league;
      } else {
        self.io.checkLeagueExists(name).subscribe((v: IAAState) => {
          if (!v.exists) {
            self.io.starts(name).subscribe(ve => {
              self.LeagueObj = ve;

              self.store.dispatch(
                loadLeague({
                  league: ve
                })
              );
            });
          } else {
            self.io.load(name).subscribe(ve => {
              self.setTeam = ve.selectTeam || '';

              self.LeagueObj = ve;

              self.store.dispatch(
                loadLeague({
                  league: ve
                })
              );
            });
          }
        });
      }
    });
  }
  selectTeam(shortName: string) {
    this.LeagueObj.selectATeam(shortName);
    this.setTeam = shortName;
    this.io.save(this.league, this.LeagueObj);
  }

  bite() {
    let men = interval(3000).pipe(mergeMap(() => interval(1000)));
    // men.subscribe(console.log);
  }

  selectATeam(name) {
    this.LeagueObj.selectATeam(name);

    this.team = true;
  }
  delay(v, n) {
    let obs = new Promise(resolve => {
      resolve({
        fix: n[v],
        n: v
      });
    });
    return from(obs);
  }
  doAction(name: string) {
    console.log(name);
  }

  play() {
    if (this.playing) {
      this.store.dispatch(
        newMessage({
          error: true,
          message: 'Playing Fixtures'
        })
      );
      return;
    }
    if (this.playSuscription) {
      console.log('Replay');
      this.playSuscription.unsubscribe();
    }
    this.playing = true;
    const self = this;
    let e = this.LeagueObj.playObs();
    let obs = interval(1500).pipe(
      take(15),
      mergeMap(v => self.delay(v, e))
    );

    this.playSuscription = obs.subscribe({
      next(value: { fix: Fixture; n: number }) {
        if (value.fix) {
          value.fix.play(self.LeagueObj.getTeam, self.LeagueObj.teams);
        }
        console.log(value);

        if (value.n > 13) {
          self.io.save(self.league, self.LeagueObj);

          self.playing = false;
        }
      }
    });
  }
}
// async saveS() {
//   this._loading = true;
//   const { ConfObj, teams, fixtures, players } = this.LeagueObj;
//   const b = [
//     { data: ConfObj, url: 'conferences.json' },
//     { data: fixtures, url: 'fixtures.json' },
//     { data: teams, url: 'teams.json' },
//     { data: players, url: 'players.json' }
//   ];

//   const p = await Promise.all(
//     b.map(async e => await this.io.save(this._league, e))
//   );
//   this._loading = false;
//   this.flash(p[0] + '👍');
// }
