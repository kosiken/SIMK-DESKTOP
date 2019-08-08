import ElectronService from './electron.service';
import { Injectable } from '@angular/core';
import { League, Player, Team, Util, Fixture } from '../models';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import flattenDeep from 'lodash/flatMapDeep';
import { newMessage } from '../store/actions';

//

@Injectable({
  providedIn: 'root'
})
export default class LeagueService {
  url: string;
  util: Util;

  constructor(
    private api: ElectronService,
    private store: Store<{
      league: League;
      set: boolean;
      count?: number;
    }>
  ) {
    if (this.isElectron()) {
      this.url = window.require('is-windows')()
        ? process.env.USERPROFILE.replace(/\\/g, '/') + '/Documents/leagues'
        : './leagues';
    }
    this.util = new Util();
  }

  private isElectron() {
    return window && window.process && window.process.type;
  }

  starts(name) {
    let self = this;
    let teams: Team[] = [];
    let players: Player[] = [];

    return this.api.getPeeps().pipe(
      map(v => {
        players = v.players;

        teams = v.teams;

        teams = teams.map(team => Team.fromJSON(team));
        players = players.map((player: Player) => Player.fromJSON(player));

        const ConferenceObject = this.util.populateConferencesAndTeams(
          teams,
          players
        );
        const fixturesAll = this.util.generateFixtures(ConferenceObject);

        const nL = new League();

        nL.ConfObj = ConferenceObject;
        // nL.fixtureMap = fixturesAll.fixturesList;
        nL.fixtures = fixturesAll.fixtures.map(Fixture.fromJSON);
        nL.teams = teams;
        nL.players = players;
        nL.name = name;
        nL.doColors();
        nL.redoFixtures();
        console.log(this.store);
        self.save(name, nL);
        return nL;
      })
    );
  }

  save(name: string, data: League) {
    let self = this;
    this.api
      .save(name, {
        teams: data.teams,
        fixtures: flattenDeep(data.fixtureMap),
        players: data.players,
        count: data.count
      })
      .subscribe({
        next(v) {
          self._log('Saved ' + name);
        }
      });
  }

  private _log(d: any, error = false) {
    try {
      console.log(JSON.parse(d));
    } catch {
      this.store.dispatch(
        newMessage({
          message: d.toString(),
          error: false
        })
      );
    }
  }

  checkLeagueExists(name: string) {

    return this.api.getXML(name, true);
  }
  load(name) {
    const self = this;
    const obs = this.api.getXML(name + '/league.json').pipe(
      tap(() => {
        self._log('Loading ' + name + ' 95%');
      }),
      map(v => {
        let players = v.players;

        let teams = v.teams;
        let fixtures = v.fixtures;
        teams = teams.map(team => Team.fromJSON(team));
        players = players.map((player: Player) => Player.fromJSON(player));
        fixtures = fixtures.map(Fixture.fromJSON);
        let nL = new League();
        const ConferenceObject = this.util.populateConferencesAndTeams(
          teams,
          players
        );
        nL.count = v.count || 0;
        nL.name = name;
        nL.ConfObj = ConferenceObject;
        nL.teams = teams;
        nL.players = players;
        nL.fixtures = fixtures;
        self._log('Loaded ' + name + ' ' + new Date(Date.now()).toString());

        nL.doColors();
        nL.redoFixtures();

        return nL;
      })
    );

    return obs;
  }
}
