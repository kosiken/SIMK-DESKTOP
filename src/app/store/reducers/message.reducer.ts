import { createReducer, on, Action } from '@ngrx/store';
import { newMessage } from '../actions';
import { IMessage } from '../simk.states';

const IMS: IMessage = {
  messages: ['Welcome to SIMK'],
  current: 'Welcome to SIMK',
  error: false
};
const MessageReduc = createReducer(
  IMS,
  on(newMessage, (state, payload) => {
    if (payload.error) {
      state.error = true;
    }
    state.messages.push(payload.message);
    state.current = payload.message;
    return state;
  })
);

export function MessageReducer(state: IMessage, action: Action) {
  return MessageReduc(state, action);
}
