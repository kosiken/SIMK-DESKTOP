import { Observable } from 'rxjs';
import Team from './Team';
import Player from './Player';
import League from './League';
import Util from './Util';
import Fixture from './Fixture';

interface Compact {
  players: Player[];
  teams: Team[];
}

interface AppTheme {
  blue: boolean;
  white: boolean;
  fullScreen: boolean;
}
interface Position {
  x: string;
  y: string;
}

interface AppEvents {
  mouse: Observable<MouseEvent>;
  keyBoard: Observable<KeyboardEvent>;
}
interface IAAState{
    exists?: boolean;
    count?: number;
    teams?: Team[];
    fixtures?: Fixture[];
    players?: Player[];
  }
export {
  Team,
  Player,
  Compact,
  League,
  Util,
  Fixture,
  AppEvents,
  Position,
  AppTheme,
  IAAState
};
