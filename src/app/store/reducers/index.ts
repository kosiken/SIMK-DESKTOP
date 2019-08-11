import { ActionReducerMap } from '@ngrx/store';

import { IAState } from '../simk.states';
import { LeagueReducer } from './league.reducer';
import { MessageReducer } from './message.reducer';

export const AppReducers: ActionReducerMap<IAState, any> = {
  message: MessageReducer,
  league: LeagueReducer
};
