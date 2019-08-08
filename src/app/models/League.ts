/**
 *Copyright (C) 2019 KRC
 *
 *
 * Permission is hereby granted, free of charge, to any
 * person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the
 * Software without restriction, including without
 * limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY
 * OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 *  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH
 * THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
// tslint:disable: semicolon
import Util from './Util';
import Conference from './Conference';
import Team from './Team';
import Player from './Player';
import Fixture from './Fixture';
// import {LeagueService} from '../providers/league.service';

import { ConferenceObj } from './Rating';
import { putTeam } from './helpers';
interface LeagueSettings {
  season: number;
  games: number;
  conferences: number;
  conferenceNames: string[];
  autoSave: boolean;
}

class League {
  util = new Util();

  time: string;
  name: string;
  season: number;
  conferences: ConferenceObj;
  next: Fixture[];
  count = 0;

  fixtures: Fixture[];
  teams: Team[];
  players: Player[];
  selectTeam: string;
  fixtureMap: Array<Fixture[]>;
  nextFixture: Fixture;
  remaining: Fixture[];
  leagues: boolean;
  private selectedTeam: Team;
  played: Fixture[];
  settings: LeagueSettings;

  ConfObj: ConferenceObj;
  private colors = [
    '#65499c',
    '#0069c0',
    '#00cc33',
    '#330000',
    '#333300',
    '#663300',
    '#666600',
    '#666699',
    '#a70dff',
    '#6610f2',
    '#6f42c1',
    '#e83e8c',
    '#dc3224',
    '#fd7e14',
    '#ffb500',
    '#28a745',
    'rgb(67, 75, 145)',
    '#3D41C2',
    '#f39848',
    '#121218',
    '#ff616f',
    '#ff7543',
    '#c8b900',
    '#002f6c',
    '#bc5100',
    '#c0b3c2',
    '#6b9b37',
    '#9e00c5',
    '#afc2cb',
    '#784767'
  ];
  constructor() {}

  doColors() {
    this.colors.forEach((i: string, n: number) => {
      this.teams[n].setColor = i;
    });
    const team = this.teams.find(i => i.selected);
    if (team) {
      this.selectTeam = team.short;
    }
  }

  _setState = Obj => {
    Object.assign(this, Obj);
  };
  getTeam = teamName => {
    return this.util.getTeam(teamName, this.teams);
  };
  getPositionOfTeam = (teamName, con) => {
    const { conferences } = this;
    const team = this.util.getTeam(teamName, this.teams);
    const { teams } = conferences[con + 'ern'];
    teams.sort((a, b) => parseFloat(b.record) - parseFloat(a.record));
    const index = teams.findIndex(o => o.short === teamName);

    return this.util.formatPosition(`${index + 1}`) + ' in the ' + con;
  };

  get selectT() {
    return this.selectedTeam || false;
  }

  redoFixtures() {
    this.fixtureMap = this.util.regenerateFixtureList(
      this.fixtures
    ).fixturesList;
  }
  get myFixtures(): Fixture[] {
    return this.util.getNextFixture(this.fixtures, this.selectTeam);
  }

  playImproved = () => {
    const { remaining: fixtures, teams } = this;
    console.log(this);
    // const den = this.util.getTeamFixture(fixtures)
    // den.forEach(i => i.play());
    // fixtures.filter(fix=> !fix.played)
    // if(den.length < 1) {
    //   fixtures.forEach(i=> i.play())
    //
    // }
    // let other =fixtures.filter(fix=> !fix.played)
    // this.nextFixture =  this.util.getNextFixture(other)
    // this.setState({teams:teams, played: fixtures.filter(fox=> fox.played) , remaining: other})

    //  this.refConf();
  };

  getNextFixture = (f: Fixture[]) => {
    return this.util.getTeamFixture(f);
  };

  selectATeam(name) {
    const team = this.util.getTeam(name, this.teams);
    team.selected = true;

    //
  }

  refConf(remaining) {
    const { ConfObj: conferences } = this;

    Object.keys(conferences).forEach(c => {
      conferences[c].teams.sort(
        (a, b) => parseFloat(b.record) - parseFloat(a.record)
      );
    });
  }

  getNext(i: number) {
    return this.fixtureMap[i];
  }
  getCalender(f) {
    return this.util.getTeamFixture(f);
  }

  play() {
    let n = this.count || 0;
    let f = this.fixtureMap[n];
    for (let fixture of f) {
      // console.log( fixture.play)
      fixture.play(this.getTeam, this.teams);
    }
    this.count = this.count ? this.count + 1 : 1;
    console.log(this.count);
  }
  playObs(): Fixture[] {
    this.count = this.count ? this.count + 1 : 1;
    let n = this.count - 1;


    return this.fixtureMap[n];
  }
}

export default League;
