import { expect, assert } from 'chai';
import Player from './Player';
let player: Player;
let ogee: any = {
  firstName: 'Adrain',
  lastName: 'Olson',
  rating: 82,
  age: '21years',
  position: 'C',
  height: '214cm',
  teamId: 55745122,
  teamName: 'Salvatoremouth Ice',

  rs: {
    attack: 80,
    defense: 84,
    rebound: 84,
    passing: 51,

    block: 41,
    steal: 42,
    inside: 85,
    outside: 69
  },

  tendencies: { outside: 37, inside: 63, passing: 51 }
};

player = Player.fromJSON(ogee);
player.addMins = 30;

describe('Player Object', () => {
  it('should be defined', function() {
    let n = typeof player;
    assert.isDefined(player);
    expect(n).to.equal('Player');
  });

  it('should create a player', function() {
    let n = typeof player;
    assert.isDefined(player);
    expect(n).to.equal('Player');
  });
  it('firstName to be Adrain', function() {
    expect(player.firstName).to.equal('Adrain');
  });
  it('lastName to be Olson', function() {
    expect(player.lastName).to.equal('Olson');
  });

  it('age should be 21years', function() {
    expect(player.age).to.equal('21years');
  });

  it('height should be 214cm', function() {
    expect(player.height).to.equal('214cm');
  });

  it('rating should be 82', function() {
    expect(player.rating).to.equal(82);
  });
  it('position should be a C', function() {
    expect(player.position).to.equal('C');
  });

  it('should have mins', function() {
    expect(player.minutes).to.equal(30);
  });

  it('position should have a contract', function() {
    assert.isDefined(player.contract);
    // expect(player.contract).to.exist;
  });
});
let p = player.playing(
  {
    defense: 90,
    attack: 85
  },
  15
);

describe('Player methods', () => {
  it('should return a boxScore', () => {
    let n = [
      'player',
      'points',
      'rebounds',
      'assists',
      'steals',
      'blocks',
      'PER'
    ];
    let a = true;
    for (let stat of n) {
      if (p[stat] === undefined) {
        a = false;
        break;
      }
    }

    expect(a).to.equal(true);
  });

  it('should have a stat object', function() {
    assert.isDefined(player.stats);
  });

  it('should have a stat equal to box score', function() {
    expect(player.stats.PPG).to.equal(p.points);
    expect(player.stats.APG).to.equal(p.assists);
    expect(player.stats.BPG).to.equal(p.blocks);
    expect(player.stats.RPG).to.equal(p.rebounds);
    expect(player.stats.SPG).to.equal(p.steals);
    expect(player.stats.PER).to.equal(p.PER);
  });
});
