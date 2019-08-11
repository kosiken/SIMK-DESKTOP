import { Injectable } from '@angular/core';
import { ConferenceObj } from './../models/Rating';
import ElectronService from './electron.service';

import { League, Player, Team, Util, Fixture, IAAState } from '../models';

import { map, tap } from 'rxjs/operators';


@Injectable()
export class LeagueMainService {


  constructor(   private api: ElectronService, private util: Util) {

   
  }

  private isElectron() {
    return window && window.process && window.process.type;
  }

  starts(name: string) {
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
        console.log(nL);
        self.save(name, nL).subscribe(v=> console.log(v));
        return nL;
      })
    );
  }

  save(name: string, data: League) {
    let self = this;
   let obs = this.api
      .save(name, {
        teams: data.teams,
        fixtures: self._flattenDeep(data.fixtureMap),
        players: data.players,
        count: data.count
      })
      
      return obs
  }


  checkLeagueExists(name: string) {
    return this.api.getXML(name, true);
  }
  load(name) {
    const self = this;
    const obs = this.api.getXML(name + '/league.json').pipe(
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
      //  self._log('Loaded ' + name + ' ' + new Date(Date.now()).toString());

        nL.doColors();
        nL.redoFixtures();

        return nL;
      })
    );

    return obs;
  }

  private _flattenDeep(arr: Array<Fixture[]>): Fixture[] {
    function strller(arr) {
      let strlled = [];
      for (let i of arr) {
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
