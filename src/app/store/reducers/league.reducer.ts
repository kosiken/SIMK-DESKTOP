// import {  } from '@ngrx/store';
import { League } from '../../models/index';
import { createReducer, on } from '@ngrx/store';
import { createLeague, playFixture, loadLeague } from '../actions';
// import { environment } from '../../../environments/environment';
import { ILState } from '../simk.states';

const initialState: ILState = { set: false };

export const LeagueReducer = createReducer(
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
