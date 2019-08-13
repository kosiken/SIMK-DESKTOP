import Player from './Player';
import Team from './Team';
import Fixture from './Fixture';
import Conference from './Conference';

import {
  ConferenceMap,
  putIt,
  ass,
  finallyPopulateFixtureArray
} from './helpers';

let id = 0;
export default class Util {
  populateConferencesAndTeams(TeamList: Team[], PlayerList: Player[]) {
    TeamList.forEach(team => {
      team.players = PlayerList.filter(i => i.teamId === team.teamId);
      team._configureMins();
    });

    return {
      Western: new Conference(
        'West',
        TeamList.filter(team => team.conferenceName === 'West')
      ),
      Eastern: new Conference(
        'East',
        TeamList.filter(team => team.conferenceName === 'East')
      )
    };
  }

  generateFixtures(teamConferenceObject: {
    Western: Conference;
    Eastern: Conference;
  }) {
    const { Western: west, Eastern: east } = teamConferenceObject;
    let fixturesArray = [];
    const confMap = Object.create(null);
    west.teams.forEach((team, n, teams) => {
      putIt(team, teams, confMap);
    });

    east.teams.forEach((team, n, teams) => {
      putIt(team, teams, confMap);
    });

    Object.keys(confMap).forEach((key, i, arr) => ass(key, i, arr, confMap));
    build([west.teams, east.teams], confMap, fixturesArray);
    build2([west.teams, east.teams], fixturesArray);

    return finallyPopulateFixtureArray(fixturesArray);
  }

  formatPosition(position: string) {
    const arr = position.split('');
    const [num1, num2] = arr;
    if (num2) {
      return num1 + format(num2, num1);
    }
    return format(num1);
    function format(num: string, numb?: string) {
      let ans;
      if (numb === '1') {
        return num + 'th';
      }
      switch (num) {
        case '1':
          ans = num + 'st';
          break;
        case '2':
          ans = num + 'nd';
          break;
        case '3':
          ans = num + 'rd';
          break;
        default:
          ans = num + 'th';
          break;
      }
      return ans;
    }
  }

  getTeamFixture(fixturesArray): Fixture {
    return fixturesArray.find(
      fixture =>
        fixture.home.selected || (fixture.away.selected && !fixture.played)
    );
  }

  getNextFixture(fixturesArray, nextTeam): Fixture[] {
    return fixturesArray.filter(
      fixture => fixture.home === nextTeam || fixture.away === nextTeam
    );
  }

  getTeam(teamName: string | number, teamList: Team[]): Team {
    return teamList.find(
      team =>
        team.short === teamName ||
        team.teamId === teamName ||
        team.teamName === teamName
    );
  }

  regenerateFixtureList(f: Fixture[]) {
    return finallyPopulateFixtureArray(f, false);
  }
}

const createFix = (
  t: Team,
  ot: Team[],
  n: number,
  confMap: ConferenceMap,
  fixtures: any[]
) => {
  let created = false,
    l = n > 9 ? 0 : n * 1;
  while (!created && l < 10) {
    let tea = ot[l];

    if (
      confMap[tea.division][t.short] < 18 &&
      confMap[t.division][tea.short] < 18
    ) {
      if (id % 2 === 0) {
        fixtures.push({
          h: t.short,
          a: tea.short,
          id: id
        });
      } else {
        fixtures.push({
          h: tea.short,
          a: t.short,
          id: id
        });
      }
      confMap[tea.division][t.short] += 1;
      confMap[t.division][tea.short] += 1;
      id += 1;
      created = true;
    }
    l++;
  }
  return l;
};
function build2(teamsArr: Array<Team[]>, fixtures: Array<any>) {
  teamsArr[0].forEach(t => {
    for (let team of teamsArr[1]) {
      fixtures.push({
        h: t.short,
        a: team.short
      });

      fixtures.push({
        h: t.short,
        a: team.short
      });
    }
  });

  teamsArr[0].forEach(t => {
    for (let team of teamsArr[0]) {
      if (team.division === t.division && t.short !== team.short) {
        fixtures.push({
          h: t.short,
          a: team.short
        });

        fixtures.push({
          h: t.short,
          a: team.short
        });
      }
    }
  });
  teamsArr[1].forEach(t => {
    for (let team of teamsArr[1]) {
      if (team.division === t.division && t.short !== team.short) {
        fixtures.push({
          h: t.short,
          a: team.short
        });

        fixtures.push({
          h: t.short,
          a: team.short
        });
      }
    }
  });
}

function build(
  teamsArr: Array<Team[]>,
  confMap: ConferenceMap,
  fixtures: Array<any>
) {
  for (let teams of teamsArr) {
    Object.keys(confMap).forEach(key => {
      let ot = teams.filter(i => i.division !== key);
      let { teams: te } = confMap[key],
        n = 0;
      for (let t of te) {
        for (let k = 0; k < 36; k++) {
          let created = false;
          n = createFix(t, ot, n, confMap, fixtures);
        }
      }
    });
  }
}

/*
 * @throws TeamError
 * */
