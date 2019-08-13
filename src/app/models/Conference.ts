import Team from './Team';

class Conference {
  name: string;
  teams: Team[];

  constructor(name, teams: Team[]) {
    this.name = name;
    this.teams = teams;
  }

  static fromJSON(
    data: { name: string; teams: string[] },
    gen: (t: string, l: Team[]) => Team,
    list: Team[]
  ) {
    return new Conference(data.name, data.teams.map(t => gen(t, list)));
  }

  toJSON() {
    return {
      name: this.name,
      teams: this.teams.map(b => b.short)
    };
  }
}

export default Conference;
