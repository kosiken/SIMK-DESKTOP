import {createSelector} from '@ngrx/store';
import {IAState, ILState} from '../simk.states';

export const selectSet = createSelector(
  (state: IAState) => state.league,
  (state: ILState) => state.league,

)
