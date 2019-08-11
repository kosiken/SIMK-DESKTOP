import Team from './Team';
import Player from './Player';
import Fixture from './Fixture';

function randomIntfromRange(attack: number) {
  let offset = Math.random() * 1.5 + 1.5;
  offset = offset - attack / 100;
  return offset > 1.2 ? offset : 1.2;
}

export const randomShots = () => Math.round(Math.random() * 20 + 20);
export function shots(mins: number, shotsTeam: number) {
  let usage = mins / 96,
    max = shotsTeam * usage,
    min = max / 2,
    s = Math.random() * min + min;
  // console.log(usage, s);
  return s * 2;
}

export function shotsPercent(
  attackR: number,
  outside: number,
  defence: number,
  height?: string
) {
  let off = randomIntfromRange(attackR);
  if (height) {
    let n = (228 - parseInt(height, 10)) / 5;

    return (attackR + outside - (defence + n)) / off / 100;
  }
  return (attackR + outside - defence) / off / 100;
}

export const rearrange = (bee: number, arr: Array<any>) => {
  function scramble(times) {
    return (...args) => {
      const been: any[] = args[0];

      for (let o = 0; o < times; o++) {
        for (let i = been.length - 1; i > 0; i--) {
          been[i].id = i + 1;
          const j = Math.floor(Math.random() * (i + 1));
          [been[i], been[j]] = [been[j], been[i]];
        }
      }

      return been;
    };
  }

  return scramble(bee)(arr);
};

export function getTeam(k: string, t: Team[]): Team {
  return t.find(x => k === x.teamName || k === x.short || k === x.abbrev);
}

export const putIt = (team: Team, teams: Team[], confMap) => {
  if (!confMap[team.division]) {
    confMap[team.division] = {
      teams: teams.filter(i => i.division === team.division)
    };
    teams
      .filter(i => i.division !== team.division)
      .forEach((x, i) => {
        confMap[team.division][x.short] = 0;
      });
  }
};

export const ass = (key, i, arr, confMap) => {
  console.log(i);
  for (let ele of arr) {
    if (ele !== key) {
      confMap[key][ele] = 0;
    }
  }
};

export const finallyPopulateFixtureArray = (f: Fixture[], rear = true) => {
  let fixturesRearranged: Fixture[] = rear ? rearrange(2, f) : f;
  fixturesRearranged.forEach((f, n)=> f.veen = 'fix'+n )

  const fixturesList: Array<Fixture[]> = [];
  let last = 0;
  let next = 15;
  for (let i = 0; i < 82; i++) {
    fixturesList[i] = fixturesRearranged.slice(last, next);
    last = next;
    next += 15;
  }

  return { fixturesList, fixtures: fixturesRearranged };
};

export function putTeam(player: Player, teams: Team[]) {
  teams.find(t => t.teamId === player.teamId).players.push(player);
}

// Generated by https://quicktype.io

export interface ConferenceMap {
  'South East': SouthEast;
  'North East': NorthEast;
  'South West': SouthWest;
  'North West': NorthWest;
  'Central West': CentralWest;
}

interface CentralWest {
  teams: Team[];
  Fire: number;
  Knights: number;
  Sharks: number;
  Lions: number;
  Bullies: number;
  Pumas: number;
  Ice: number;
  Bulldogs: number;
  Rapids: number;
  Lightning: number;
  'South East': number;
  'North East': number;
  'Central East': number;
  'South West': number;
  'North West': number;
}

enum ConferenceName {
  East = 'East',
  West = 'West'
}

enum Pick {
  S11StRound = 's1 1st round',
  S12NdRound = 's1 2nd round',
  S21StRound = 's2 1st round',
  S22NdRound = 's2 2nd round'
}

interface NorthEast {
  teams: Team[];
  Money: number;
  Rockies: number;
  Sizzle: number;
  Leopards: number;
  Dealers: number;
  Matadors: number;
  Knits: number;
  Rivers: number;
  Brewers: number;
  Stars: number;
  'South East': number;
  'Central East': number;
  'South West': number;
  'North West': number;
  'Central West': number;
}

interface NorthWest {
  teams: Team[];
  Fire: number;
  Knights: number;
  Sharks: number;
  Lions: number;
  Bullies: number;
  Light: number;
  Scorchers: number;
  Wolves: number;
  Runners: number;
  Ballers: number;
  'South East': number;
  'North East': number;
  'Central East': number;
  'South West': number;
  'Central West': number;
}

interface SouthEast {
  teams: Team[];
  Wasps: number;
  Foxes: number;
  '67ers': number;
  Blues: number;
  Reds: number;
  Matadors: number;
  Knits: number;
  Rivers: number;
  Brewers: number;
  Stars: number;
  'North East': number;
  'Central East': number;
  'South West': number;
  'North West': number;
  'Central West': number;
}

interface SouthWest {
  teams: Team[];
  Pumas: number;
  Ice: number;
  Bulldogs: number;
  Rapids: number;
  Lightning: number;
  Light: number;
  Scorchers: number;
  Wolves: number;
  Runners: number;
  Ballers: number;
  'South East': number;
  'North East': number;
  'Central East': number;
  'North West': number;
  'Central West': number;
}
