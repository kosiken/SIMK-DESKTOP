import { newMessage } from '../store/actions';
import ElectronService from './electron.service';
import { Injectable } from '@angular/core';
import { League, Player, Team, Util, Fixture, IAAState } from '../models';
import { Store } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';

//

@Injectable()
export default class LeagueService {
  constructor(
    private util: Util,
    private store: Store<{
      league: any;
      messages: string[];
    }>
  ) {}

  private isElectron() {
    return window && window.process && window.process.type;
  }

  starts(name: string, api: ElectronService) {
    let self = this;
    let teams: Team[] = [];
    let players: Player[] = [];

    return api.getPeeps().pipe(
      map(v => {
        players = v.players;

        teams = v.teams;

        teams = teams.map(team => Team.fromJSON(team));
        players = players.map((player: Player) => Player.fromJSON(player));

        const ConferenceObject = self.util.populateConferencesAndTeams(
          teams,
          players
        );
        const fixturesAll = self.util.generateFixtures(ConferenceObject);

        const nL = new League();

        nL.ConfObj = ConferenceObject;
        // nL.fixtureMap = fixturesAll.fixturesList;
        nL.fixtures = fixturesAll.fixtures.map(Fixture.fromJSON);
        nL.teams = teams;
        nL.players = players;
        nL.name = name;
        nL.doColors();
        nL.redoFixtures();
        console.log(nL);
        self.save(name, nL, api).subscribe(value => self._log('saved ' + name));
        return nL;
      })
    );
  }

  save(name: string, data: League, api: ElectronService) {
    let self = this;
    let obs = api.save(name, {
      teams: data.teams,
      fixtures: self._flattenDeep(data.fixtureMap),
      players: data.players,
      count: data.count
    });

    return obs;
  }

  checkLeagueExists(name: string, api: ElectronService) {
    return api.getXML(name, true);
  }
  load(name, api: ElectronService) {
    const self = this;
    const obs = api.getXML(name + '/league.json').pipe(
      tap(() => {
        console.log('Loading ' + name + ' 95%');
      }),
      map((v: IAAState) => {
        let players = v.players;

        let teams = v.teams;
        let fixtures = v.fixtures;
        teams = teams.map(team => Team.fromJSON(team));
        players = players.map((player: Player) => Player.fromJSON(player));
        fixtures = fixtures.map(Fixture.fromJSON);
        let nL = new League();
        const ConferenceObject = self.util.populateConferencesAndTeams(
          teams,
          players
        );
        nL.count = v.count || 0;
        nL.name = name;
        nL.ConfObj = ConferenceObject;
        nL.teams = teams;
        nL.players = players;
        nL.fixtures = fixtures;
        //  self._log('Loaded ' + name + ' ' + new Date(Date.now()).toString());

        nL.doColors();
        nL.redoFixtures();

        return nL;
      })
    );

    return obs;
  }
  private _log(d: string) {
    this.store.dispatch(
      newMessage({
        message: d.toString(),
        error: false
      })
    );
  }
  private _flattenDeep(arr: Array<Fixture[]>): Fixture[] {
    function strller(array) {
      let strlled = [];
      for (let i of array) {
        if (Array.isArray(i)) {
          let sub = strller(i);
          strlled = strlled.concat(sub);
        } else {
          strlled.push(i);
        }
      }

      return strlled;
    }
    return strller(arr);
  }
}
