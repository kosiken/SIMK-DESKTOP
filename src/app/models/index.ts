import Team from './Team';
import Player from './Player';
import League from './League';
import Util from './Util';
import Fixture from './Fixture';

interface Compact {
  players: Player[];
  teams: Team[];
}
export { Team, Player, Compact, League, Util, Fixture };
