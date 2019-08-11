import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
// import {TimelineMax, Expo, Elastic} from 'gsap';
import { ElectronService, LeagueService } from '../../providers';
import { Store, select } from '@ngrx/store';
import { loadLeague, newMessage } from '../../store/actions';
import { Subscription, interval, from, Observable } from 'rxjs';
import { map, debounce, mergeMap, take} from 'rxjs/operators';
import { League, Fixture, IAAState } from '../../models';

@Component({
  selector: 'app-league-dashboard',
  templateUrl: './league-dashboard.component.html',
  styleUrls: ['./league-dashboard.component.scss']
})
export class LeagueDashboardComponent implements OnInit {
  league: string;

  LeagueObj: League;
  urlTeam = './league-assets/teams.json';
  urlPlayers = './league-assets/players.json';
  team = false;
  setTeam: string;
  playing = false;
  playSuscription: Subscription;
  margin = 0;
  messages = [
    {
      day: 'Info',
      message: ` Thank you for testing SIMK 😃 you can suggest features by mailing kosikenspears@gmail.com.
       Please note that SIMK is still in development and some functionality would not work without an internet
        connection.`
    }
  ];
  constructor(
    private api: ElectronService,
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
        self.io.checkLeagueExists(name, self.api).subscribe((v: IAAState) => {
          if (!v.exists) {
            self.io.starts(name, self.api).subscribe({
              next(ve) {
                self.LeagueObj = ve;

                self.store.dispatch(
                  loadLeague({
                    league: ve
                  })
                );
              }
            });
          } else {
            self.io.load(name, self.api).subscribe(ve => {
              self.setTeam = ve.selectTeam || '';

              self.LeagueObj = ve;
              self._log('Loaded ' + name);
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
  _log(d: string, error = false) {
    this.store.dispatch(
      newMessage({
        message: d.toString(),
        error: false
      })
    );
  }

  selectTeam(shortName: string) {
    this.LeagueObj.selectATeam(shortName);
    this.setTeam = shortName;
    this.io.save(this.league, this.LeagueObj, this.api);
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

  strafeLeft() {
    if (this.margin < 0) {
      this.margin += document.getElementById('leo').clientHeight / 30;
    }
  }

  strafeRight() {
    let tik = document.getElementById('leo').clientHeight / 30;
    let tok = this.margin * -1;

    if (tok < tik * 29) {
      this.margin -= tik;
    }
  }
  playUns() {
    if (this.playing) {
      this.playSuscription.unsubscribe();
    } else {
      return;
    }
    const self = this;
    self.io
      .save(self.league, self.LeagueObj, self.api)
      .subscribe(v => self._log('League saved'));

    self.playing = false;
  }

  playUntil(f: Fixture) {
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
    let e = this.LeagueObj.playFixes(f);
    let obs = interval(1500).pipe(
      take(e.length + 1),
      mergeMap(v => self.delay(v, e))
    );

    this.playSuscription = obs.subscribe({
      next(value: { fix: Fixture; n: number }) {
        if (value.fix) {
          value.fix.play(self.LeagueObj.getTeam, self.LeagueObj.teams);
          let bigger = value.fix.score.away > value.fix.score.home;
          let message = bigger
            ? `The ${value.fix.away} beat
           the ${value.fix.home} an away team win with a score of ${
                value.fix.score.away
              } to ${value.fix.score.home} oh well`
            : `The ${value.fix.home} beat ${
                value.fix.away
              } a home team win with a score of ${value.fix.score.home}  ${
                value.fix.score.away
              }`;
          self.messages.unshift({
            day: value.fix.veen,
            message
          });
        }
        // console.log(value, e.length);

        if (value.n === e.length) {
          self.playUns();
        }
      }
    });
  }
}
