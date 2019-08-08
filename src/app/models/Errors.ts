class TeamError extends Error {
  code: number;
  constructor(message = 'TEAM ERROR' ) {
    super(message);
    this.code = 470;
  }
}


class PlayerError extends Error {
  code: number;
  constructor(message = 'TEAM ERROR' ) {
    super(message);
    this.code = 471;
  }
}

class FixtureError extends Error {
  code: number;
  constructor(message = 'TEAM ERROR' ) {
    super(message);
    this.code = 472;
  }
}

export {
  PlayerError, TeamError, FixtureError
};
