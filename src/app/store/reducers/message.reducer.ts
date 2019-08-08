import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  createReducer,
  on
} from '@ngrx/store'
import {newMessage} from '../actions';
import {IMessage} from '../simk.states';


const IMS: IMessage = {
  messages:['Welcome to SIMK'],
  current: 'Welcome to SIMK',
  error: false

}
export const MessageReducer = createReducer(IMS,
  on(newMessage, (state, payload) => {
    if(payload.error){
      state.error = true;
    }
    state.messages.push(payload.message)
    state.current = payload.message
    return state;
  }))
