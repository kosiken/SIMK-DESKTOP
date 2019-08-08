// tslint:disable prefer-const

import { Rating, BoxScore, Stats, Tendencies, Ratings } from './Rating';
import { shots, shotsPercent } from './helpers';

export default class Player {
  private mins?: number;
  private starting?: boolean;
  private onCourt?: boolean;
  public stats?: Stats;

  //   age: string,
  //   position: string,
  //   height: string,
  //   teamId: number | string,

  constructor(
    public firstName: string,
    public lastName: string,
    public rating: number,
    public age: string,
    public position: string,
    public height: string,
    public teamId: number,
    public rs: Rating,
    private tendencies: Tendencies,
    public contract?: number
  ) {}

  static fromJSON(P: Player) {
    const {
      firstName,
      lastName,
      rating,
      age,
      position,
      height,
      teamId,
      rs,
      tendencies,
      contract,
      stats
    } = P;
    const n = new Player(
      firstName,
      lastName,
      rating,
      age,
      position,
      height,
      teamId,
      rs,
      tendencies,
      contract
    );

    if (contract) {
      n.contract = contract;
    } else {
      n._buildContract();
    }

    if (stats) {
      n.stats = stats;
    } else {
      n._setStats();
    }

    return n;
  }
  _setStats() {
    this.stats = {
      PPG: 0,
      RPG: 0,
      APG: 0,
      SPG: 0,
      BPG: 0,
      PER: 0
    };
  }
  _buildContract() {
    // tslint:disable-next-line: prefer-const
    let rating = this.rating,
      okey: number;

    if (rating > 87) {
      okey = 100;
    } else if (rating > 80) {
      okey = 80;
    } else if (rating > 70) {
      okey = 50;
    } else {
      okey = 20;
    }

    this.contract = okey;
  }

  _short(v: number) {
    return parseFloat(v.toFixed(2));
  }

  set addMins(mins: number) {
    this.mins = Math.ceil(mins);
  }
  set play(value: boolean) {
    this.starting = value;
  }

  set togglePlay(value: boolean) {
    this.onCourt = value;
  }
  get court() {
    return this.onCourt;
  }
  get statusPlaying() {
    return this.starting;
  }
  get minutes() {
    return this.mins;
  }
  toJSON() {
    let {
      firstName,
      // tslint:disable-next-line: prefer-const
      lastName,
      rating,
      age,
      position,
      height,
      teamId,
      rs,
      contract,
      tendencies,
      stats
    } = this;

    return {
      firstName,
      lastName,
      rating,
      age,
      position,
      height,
      teamId,
      rs,
      contract,
      tendencies,
      stats
    };
  }

  playing(rating: Ratings, shotsTeam: number): BoxScore {
    let {
        attack,

        rebound,
        steal,
        inside,
        outside,
        passing,
        block
      } = this.rs,
      { PPG, RPG, APG, PER: games, BPG, SPG } = this.stats,
      { defense: d } = rating,
      mins = this.mins,
      outsideTendencies = this.tendencies.outside / 100,
      insideTendencies = this.tendencies.inside / 100;

    if (this.mins && this.mins > 0) {
      let shotsTaken = shots(mins || 36, shotsTeam),
        // sf3 = shots from three
        sf3 = shotsTaken * outsideTendencies,
        sf2 = shotsTaken * insideTendencies,
        // sf3 = shots from three
        outsideShooting = shotsPercent(attack, outside, d),
        insideShooting = shotsPercent(attack, inside, d, this.height),
        mf3 = sf3 * outsideShooting,
        mf2 = sf2 * insideShooting,
        points = mf3 * 3 + mf2 * 2;
      // console.log(sf3, sf2, outsideShooting, insideShooting);

      let { rebounds, blocks, steals, assists } = calcStat(
        [block, passing, rebound, steal],
        mins,
        this.position
      );
      this.stats.PPG = this._short(
        (PPG * games + points) / (games + 1) || points || 2
      );

      this.stats.BPG = this._short(
        (BPG * games + blocks) / (games + 1) || blocks || 0.1
      );

      this.stats.RPG = this._short(
        (RPG * games + rebounds) / (games + 1) || rebounds || 2
      );

      this.stats.APG = this._short(
        (APG * games + assists) / (games + 1) || assists || 2
      );

      this.stats.SPG = this._short(
        (SPG * games + steals) / (games + 1) || steals || 0.2
      );
      this.stats.PER = games + 1;
      return {
        player: this.lastName,
        points: Math.ceil(points),
        rebounds: Math.ceil(rebounds),
        assists: Math.ceil(assists),
        steals: Math.ceil(steals),
        blocks: Math.ceil(blocks),
        PER: games + 1, mins
      };
    } else {
      return {
        player: this.lastName,
        points: 0,
        rebounds: 0,
        assists: 0,
        steals: 0,
        blocks: 0,
        PER: 0.0, mins: 0
      };
    }
  }
}

function calcStat(ratingSpec: any[], mins: number, position: string) {
  const [blockingR, passingR, reboundingR, stealsR] = ratingSpec;

  let rebounds = calcRbds(mins, reboundingR, position);
  let assists = calcAssists(mins, passingR, position);

  let steals = Math.floor((Math.random() * mins * stealsR) / 500);

  let blocks = Math.floor((Math.random() * mins * blockingR) / 500);

  return { rebounds, assists, steals, blocks };
}

function calcAssists(mins: number, passingR: number, position: string) {
  let ret;

  switch (position) {
    case 'PG':
      ret = Math.floor(Math.random() * ((mins * passingR) / (100 * 1.5)));
      break;
    case 'SG':
      ret = Math.floor(Math.random() * ((mins * passingR) / (100 * 1.8)));
      break;
    case 'SF':
      ret = Math.floor(Math.random() * ((mins * passingR) / (100 * 2)));
      break;

    case 'PF':
      ret = Math.floor(Math.random() * ((mins * passingR) / (100 * 2.5)));
      break;

    default:
      ret = Math.floor(Math.random() * ((mins * passingR) / (100 * 2.8)));
      break;
  }
  return ret;
}

function calcRbds(mins: number, passingR: number, position: string) {
  let ret;

  switch (position) {
    case 'C':
      ret = Math.floor(Math.random() * ((mins * passingR) / (100 * 1.5)));
      break;
    case 'PF':
      ret = Math.floor(Math.random() * ((mins * passingR) / (100 * 1.8)));
      break;
    case 'SF':
      ret = Math.floor(Math.random() * ((mins * passingR) / (100 * 2)));
      break;

    case 'SG':
      ret = Math.floor(Math.random() * ((mins * passingR) / (100 * 2.5)));
      break;

    default:
      ret = Math.floor(Math.random() * ((mins * passingR) / (100 * 2.8)));
      break;
  }
  return ret;
}
