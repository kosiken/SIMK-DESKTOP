import Player from "./Player";
import Team from "./Team";
import Fixture from "./Fixture";
import Conference from "./Conference";

class Util {
  counter: number;
    constructor(counter = 0) {

        this.counter = counter;
    }
    starts(api, urlTeam: string, urlPlayers: string, cb: (err: Error, data: {teams: Team[], players: Player[]}) => void) {
        let teams = [], players = [];
        api.get(urlPlayers, true)
            .then((v) => {
            players = v;
            api.get(urlTeam, true)
                .then((response) => {
                teams = response;

                cb(undefined, {
                    teams: teams.map(({ teamName, teamId, short, city, abbrev, GM, coach, conferenceName,
                       division, urlPic, picks }) => new Team(teamName, teamId, short, city, abbrev, GM, coach, conferenceName, division, urlPic, picks)),
                    players: players.map(({ firstName, lastName, rating, age,
                       position, height, teamId, teamName, ratingSpec, tendencies }) => new Player(firstName, lastName, rating, age, position, height,
                        teamId, teamName, ratingSpec, tendencies))
                });
            });
        });
    }
    // create the players and teams array
    getTeam(teamName: string, teamList: Team[]): Team {
        return getTeam(teamName, teamList);
    }
    // generateFixtures(teamConferenceObject): Fixture[] {
    //     const { Western: west, Eastern: east } = teamConferenceObject;
    //     const TeamMap = Object.create(null);
    //     const teamList = west.teams.concat(east.teams);
    //     const fixturesArray = [];
    //     createTeamMap(TeamMap, teamList);
    //     configureTeamFixturesConference(TeamMap, teamList);

    //   return  finallyPopulateFixtureArray( teamList, 0);

    // }
    generateFixturesMap(fixturesArray) {
        const FixtureMap = Object.create(null);
        let fixtures = [];
        for (let f = 0; f < 87; f++) {
            FixtureMap[f] = {
                og: new Set(),
                den: [],
                gear: function (h) {
                    // let v = f
                    this.og.add(h.home.abbrev);
                    this.og.add(h.away.abbrev);
                    this.den.push(h);
                },
                peel: function (d) {
                    this.one = d.slice(0, 5).filter(x => x !== undefined);
                    this.two = d.slice(5, 9).filter(x => x !== undefined);
                    this.three = d.slice(9, 15).filter(x => x !== undefined);
                }
            };
        }
        let fee = fixturesArray.map(x => x).reverse();
        // tslint:disable-next-line:forin
        for (const b in FixtureMap) {
            fee.forEach((x) => {
                if (FixtureMap[b].den.length < 15) {
                    if (!FixtureMap[b].og.has(x.home.abbrev)
                     && !FixtureMap[b].og.has(x.away.abbrev)) {
                        FixtureMap[b].gear(x);
                        x.sime(); // return '#' + x.home.abbrev + x.away.abbrev
                    }
                }
            });
            fee = fee.filter(x => x.dele === undefined).reverse();
        }
        Object.keys(FixtureMap).forEach((x, i) => {
// tslint:disable-next-line: radix
            FixtureMap[parseInt(x)].peel(FixtureMap[parseInt(x)].den);
            // tslint:disable-next-line:radix
            fixtures.push(...FixtureMap[parseInt(x)].den);
        });
       fixtures.forEach(fix => {
           fix.inFixArr =  true;
       });

        fixtures = fixtures.concat(fixturesArray.filter(fix => !fix.inFixArr));
        console.log(fixtures.length);
        return { fixtureMap: FixtureMap, fixtures: fixtures };
    }
    formatPosition(position) {
        const arr = position.split('');
        const [num1, num2] = arr;
        if (num2) {
            return num1 + format(num2, num1);
        }
        return format(num1);
        function format(num, numb?) {
            let ans;
            if (numb === '1') { return num + 'th'; }
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
    populateConferencesAndTeams(TeamList, PlayerList) {
        PlayerList.map(player => { player.putTeam(TeamList); });
        TeamList.map(i => { i.configureMins(); });
        return {
            Western: new Conference('West', TeamList.filter((team) => team.conferenceName === 'West')),
            Eastern: new Conference('East', TeamList.filter((team) => team.conferenceName === 'East'))
        };
    }



    getNextFixture (fixturesArray): Fixture {
        return fixturesArray.find(fixture => fixture.home.selected || fixture.away.selected && !fixture.played);
    }


    getTeamFixture(fixturesArray, full?) {
      if (full) {
        return  fixturesArray.filter(fixture => fixture.home.selected || fixture.away.selected);
      }
        const index = fixturesArray.findIndex(fixture => !fixture.played && (fixture.home.selected || fixture.away.selected));
        return  fixturesArray.slice(0, index + 1)[0] ? fixturesArray.slice(0, index + 1) : fixturesArray.filter(i => !i.played);
    }

generateFixtures(teamConferenceObject): Fixture[] {
        const { Western: west, Eastern: east } = teamConferenceObject;
   let fixturesArray = [];
   const confObj = Object.create(null);
         west.teams.forEach((team,n, teams) => {
        putIt(team, teams, confObj )
       })


        east.teams.forEach((team,n, teams) => {
        putIt(team, teams, confObj )
       })


         Object.keys(confMap).forEach(ass)
         build([teams1, teams2], confObj, fixtures)
         build2([teams1, teams2])



      return  finallyPopulateFixtureArray( teamList, 0);

    }
}
export default Util

function createTeamMap(teamMap, teamList) {
  teamList.forEach(team => {
    if (!teamMap[team.division]) {
      teamMap[team.division] = {
        divisionTeams: teamList
          .filter(t => t.division === team.division)
          .map(u => u.short),
        otherTeams: teamList
          .filter(
            t =>
              t.conferenceName === team.conferenceName &&
              t.division !== team.division
          )
          .map(u => u.short)
      };
    }
  });
}
function configureTeamFixturesConference(teamMap, teamList: Team[]) {
  let limiter = 0;
  // let build = {}
  Object.keys(teamMap).forEach(x => {
    let i = 0;
    let filled = false;
    while (!filled && limiter < 600) {
      teamMap[x].otherTeams.forEach(g => {
        const team = getTeam(teamMap[x].divisionTeams[i], teamList),
          y = getTeam(g, teamList);
        if (!team) {
          filled = true;
        } else {
          if (!team.set.has(y.short) && y.set.size < 4) {
            y.put(team);
            team.put(y);
          }
          if (team.set.size === 4) {
            i++;
          }
        }
      });
      limiter++;
    }
  });
  teamList.forEach(i => {
    i.otherTeams = teamList
      .filter(p => p.conferenceName !== i.conferenceName)
      .map(d => d.short);
    i.fourTeams = teamList
      .filter(
        p =>
          p.conferenceName === i.conferenceName &&
          !i.set.has(p.short) &&
          i.division !== p.division
      )
      .map(d => d.short);
    i.divisionTeams = teamMap[i.division].divisionTeams.filter(
      o => o !== i.short
    );
  });
}
function finallyPopulateFixtureArray(teamList, count): Fixture[] {
  let fixturesArray = [];

  // tslint:disable-next-line:prefer-const
  let three = [],
    deletingSet;
  teamList.forEach(x => {
    x.omy
      .map(i => getTeam(i, teamList))
      .forEach(ot => {
        three.push(new Fixture(x, ot, count++));
        three.push(new Fixture(x, ot, count++));
      });
    x.otherTeams
      .map(i => getTeam(i, teamList))
      .forEach(ot => {
        fixturesArray.push(new Fixture(x, ot, count++));
      });
    x.fourTeams
      .map(i => getTeam(i, teamList))
      .forEach(ot => {
        fixturesArray.push(new Fixture(x, ot, count++));
        fixturesArray.push(new Fixture(x, ot, count++));
      });
    x.divisionTeams
      .map(i => getTeam(i, teamList))
      .forEach(ot => {
        fixturesArray.push(new Fixture(x, ot, count++));
        fixturesArray.push(new Fixture(x, ot, count++));
      });
  });
  deletingSet = new Set(three.map(i => i.id));
  deletingSet.forEach(i => {
    three.filter(f => f.regExp.test(i))[0].sime();
  });
  fixturesArray = fixturesArray.concat(three.filter(f => !f.dele));

  return fixturesArray;
  // fixturesArray = fixturesArray.concat(three.concat(four))
}
