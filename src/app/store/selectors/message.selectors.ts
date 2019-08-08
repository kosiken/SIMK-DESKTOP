import {createSelector} from '@ngrx/store';
import {IAState, IMessage} from '../simk.states';

export const selectCurrent = createSelector(
  (state: IAState) => state.message,
  (state: IMessage) => state.current
)
