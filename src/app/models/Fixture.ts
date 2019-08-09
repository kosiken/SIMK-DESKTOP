import Team from './Team';
import { Score, BoxScore, BoxScores } from './Rating';

class Fixture {
  public score?: Score;

  public dele: boolean;
  boxScore: BoxScores;

  constructor(
    public home: string,
    public away: string,
    private veen = 0,
    private played = false
  ) {}

  static fromJSON(fixture: any) {
    const { h, a, score, boxScore } = fixture,
      nf = new Fixture(h, a);

    if (score) {
      nf.score = score;
      nf.boxScore = boxScore;
      nf.played = true;
    }
    return nf;
  }

  upload(a, b) {
    this.score = { home: a, away: b };
  }
  play(generate: (t: string, ts: Team[]) => Team, teams: Team[]) {
    if (this.played || this.score) {
      return;
    }

    let home = generate(this.home, teams);
    let away = generate(this.away, teams);

    const hb: BoxScore[] = home.playering(away.ratings);
    const ab: BoxScore[] = away.playering(home.ratings);

    const h = hb.map(i => i.points).reduce((a1, b) => a1 + b);
    const a = ab.map(i => i.points).reduce((a1, b) => a1 + b);

    if (h === a) {
      return this.play(generate, teams);
    }
    if (h > a) {
      home.win(away);
      away.lose(home);
    } else {
      home.lose(away);
      away.win(home);
    }
    this.score = { home: Math.ceil(h), away: Math.ceil(a) };

    this.played = true;
    this.boxScore = { home: hb, away: ab };

    return;
  }
  toJSON() {
    if (this.played) {
      return {
        h: this.home,
        a: this.away,
        veen: this.veen,

        score: this.score,

        boxScore: this.boxScore
      };
    }
    return {
      h: this.home,
      a: this.away,
      veen: this.veen,
      played: this.played,
      boxScore: this.boxScore
    };
  }
}
export default Fixture;
