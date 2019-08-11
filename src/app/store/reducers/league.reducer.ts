import { Action } from '@ngrx/store';
// import {  } from '@ngrx/store';

import { createReducer, on } from '@ngrx/store';
import { createLeague, playFixture, loadLeague } from '../actions';
// import { environment } from '../../../environments/environment';
import { ILState } from '../simk.states';

const initialState: ILState = { set: false };

const LeagueReduc = createReducer(
  initialState,
  on(createLeague, (state, l) => ({
    set: true,
    league: l.league
  })),
  on(loadLeague, (state, l) => ({ set: true, league: l.league })),

  on(playFixture, state => {
    state.league.play();
    return state;
  })
);

export function LeagueReducer(state: ILState, action: Action) {
  return LeagueReduc(state, action);
}
