import { randomShots } from './helpers';
import Player from './Player';
import { BoxScore, Ratings } from './Rating';
class Team {
  color: string;
  next: Array<string>;
  wonTeams: Array<string>;
  loseTeams: Array<string>;
  app: number;
  record: string;
  done: boolean;
  gamesPlayed: number;

  conferenceTeams: string[];

  homeFor: boolean;

  players: Player[];
  lineup: Player[];
  starting: Player[];
  bench: Player[];
  ratings: Ratings;
  salary: number;

  constructor(
    public teamName: string,
    public teamId: number,
    public short: string,
    public city: string,
    public abbrev: string,
    public GM: string,
    public coach: string,
    public conferenceName: string,
    public division: string,
    public urlPic: string,
    public picks: string[],
    public selected = false
  ) {}

  static fromJSON(team: Team): Team {
    const {
      teamName,
      teamId,
      short,
      conferenceName,
      city,
      wonTeams,
      loseTeams,
      division,
      abbrev,
      selected,
      gamesPlayed,
      GM,
      coach,
      urlPic,
      picks
    } = team;
    let nT = new Team(
      teamName,
      teamId,
      short,
      city,
      abbrev,
      GM,
      coach,
      conferenceName,
      division,
      urlPic,
      picks,
      selected
    );

    if (gamesPlayed) {
      nT.gamesPlayed = gamesPlayed;
      nT.wonTeams = wonTeams;
      nT.loseTeams = loseTeams;
      nT.done = gamesPlayed > 81;
      nT.record = (wonTeams.length / gamesPlayed).toFixed(3);
    } else {
      nT.gamesPlayed = 0;
      nT.wonTeams = [];
      nT.loseTeams = [];
    }

    return nT;
  }

  _sortPlayers(): void {
    this.players.sort((a, b) => b.rating - a.rating);
    this.salary = this.players.map(p => p.contract).reduce((a, b) => a + b);
  }

  _rec(): number {
    if (this.gamesPlayed === 0) {
      return 0;
    } else {
      return this.wonTeams.length / this.gamesPlayed;
    }
  }

  get getTeamId(): number {
    return this.teamId;
  }

  _reconfigMins() {
    // let mins = 48 * 5;
    this.players.sort((a, b) => b.rating - a.rating);
    let dets = starting(this.players);
    this.lineup = dets.starters;
    this.lineup.forEach(x => {
      x.play = true;
    });
    let mins = 48 * 4.2;
    setP(mins, this.lineup, this.bench);
  }
  _configureMins() {
    this.players.sort((a, b) => b.rating - a.rating);
    let dets = starting(this.players);
    this.lineup = dets.starters;
    this.lineup.forEach(x => {
      x.play = true;
    });
    this.bench = dets.bench;
    let mins = 48 * 4.2;
    setP(mins, this.lineup, this.bench);

    const playersMapAttack = this.players.map(playe => {
      const {
        rs: { attack: a }
      } = playe;
      return a;
    });
    const playersMapDefense = this.players.map(playe => {
      const {
        rs: { defense: d }
      } = playe;
      return d;
    });
    const attack = Math.ceil(
      playersMapAttack.reduce((c, p) => c + p) / this.players.length
    );
    const defense = Math.ceil(
      playersMapDefense.reduce((c, p) => c + p) / this.players.length
    );
    this.ratings = { attack, defense };
    //
  }
  _getPlayer(playerName): Player {
    return this.players.find(pl => pl.firstName + pl.lastName === playerName);
  }
  win(t: Team): void {
    this.wonTeams.unshift(t.short);
    this.gamesPlayed++;
    this.update();
  }
  lose(team: Team): void {
    this.loseTeams.unshift(team.short);
    this.gamesPlayed++;
    this.update();
  }
  update(): void {
    // console.log(this)
    this.record = (this.wonTeams.length / this.gamesPlayed).toFixed(3);
  }

  playering(rating: Ratings): BoxScore[] {
    // tslint:disable-next-line:prefer-const
    let points = 0,
      assists = 0,
      rebounds = 0,
      boxScores: BoxScore[] = [],
      stats,
      shots = randomShots();
    const noOfShots = Math.round(Math.random() * (75 - 60) + 60);
    this._reconfigMins();
    const usageRates = [25, 15, 15, 15, 10, 10];
    this.players.forEach(x => {
      stats = x.playing(rating, shots);
      points += stats.points;
      assists += stats.assists;
      rebounds += stats.rebounds;
      boxScores.push(stats);
    });

    return boxScores;
  }

  set setColor(col: string) {
    this.color = col;
  }

  get getColor(): string {
    return this.color;
  }

  toJSON() {
    const {
      teamName,
      teamId,
      short,
      conferenceName,
      city,
      wonTeams,
      loseTeams,
      division,
      abbrev,
      selected,
      gamesPlayed,
      GM,
      coach,
      urlPic,
      picks
    } = this;
    return {
      teamName,
      teamId,
      short,
      conferenceName,
      city,
      wonTeams,
      loseTeams,
      division,
      abbrev,
      selected,
      gamesPlayed,
      GM,
      coach,
      urlPic,
      picks
    };
  }
}

function starting(players) {
  const Pgraph = Object.create(null);
  startGraph(Pgraph);
  for (const player of players) {
    const { position } = player;
    switch (position) {
      case 'C':
        Pgraph['C'].push(player);
        break;
      case 'PF':
        Pgraph['PF'].push(player);
        break;
      case 'SG':
        Pgraph['SG'].push(player);
        break;
      case 'SF':
        Pgraph['SF'].push(player);
        break;
      default:
        Pgraph['PG'].push(player);
        break;
    }
  }
  // console.log(Pgraph);
  const returnV = removeW(Pgraph);
  const Bench = returnV.bench;
  const Starters = returnV.starters;
  return { bench: Bench, starters: Starters };
}
function sortList(l) {
  return l.sort((a, b) => {
    return b.getRating - a.getRating;
  });
}
function startGraph(graph) {
  graph['C'] = [];
  graph['PF'] = [];
  graph['SF'] = [];
  graph['PG'] = [];
  graph['SG'] = [];
}
function removeW(graph) {
  let starters = [];
  let bench = [];
  for (const key of Object.keys(graph)) {
    starters.unshift(graph[key].shift());
    graph[key].forEach(x => {
      bench.push(x);
    });
  }
  bench = sortList(bench);
  starters = sortList(starters);
  return { starters: starters, bench: bench };
}
function setP(
  mins: number,
  players: Player[],
  ben: Player[],
  playoffs = false
) {
  let smin = mins * 0.7;
  let bmin = 0.3 * mins;
  if (playoffs) {
    smin = mins * 0.85;
    bmin = 0.15 * mins;
  }
  const bench = ben.sort((a, b) => b.rating - a.rating).slice(0, 5);
  // tslint:disable-next-line: one-variable-per-declaration
  const srating = players.map(p => p.rating).reduce((n, o) => n + o),
    brating = bench
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5)
      .map(p => p.rating)
      .reduce((n, o) => n + o);

  for (let player of players) {
    player.addMins = (player.rating / srating) * smin;
  }

  for (let player of bench) {
    player.addMins = (player.rating / brating) * bmin;
  }
}
export default Team;
