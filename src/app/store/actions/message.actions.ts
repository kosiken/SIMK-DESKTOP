import {Action, createAction, props} from '@ngrx/store';
//
export const newMessage = createAction('[HolderService] message', props<{
  error?: boolean;
  message: string;
}>());

// export enum MessageActions {
//   newMessage = '[HolderService] message',
//   deleteMessage = '[HolderService] delete'
// }
// export class pushMess implements Action{
//   public readonly type = MessageActions.newMessage
//   constructor()
// }
