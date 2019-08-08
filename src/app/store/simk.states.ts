import {League} from '../models';

export interface ILState {
  league?: League;
  set: boolean;
  lr?: any;

}

export interface IMessage {
  error: boolean;
  messages: string[];
  current: string;
}

export interface IAState {
  league: ILState;
  message: IMessage;

}
