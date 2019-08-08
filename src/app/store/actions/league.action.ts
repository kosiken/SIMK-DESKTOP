import { createAction, props } from '@ngrx/store';
import { League } from '../../models/index';


export const createLeague = createAction(
  '[LeagueComponent] Create',
  props<{ league: League }>()
);

export const checkExists = createAction('[Holder Service] Check');

export const loadLeague = createAction(
  '[LeagueComponent] Load',
  props<{ league: League }>()
);

export const playFixture = createAction('LeagueComponent] Play',
  props<{ league: League }>());

const saveLeague = createAction('[Holder Service] save');

export enum LeagueActions {
  createLeague = '[LeagueComponent] Create',
  loadLeague = '[LeagueComponent] Load',

  playFixture = 'LeagueComponent] Play'
}
