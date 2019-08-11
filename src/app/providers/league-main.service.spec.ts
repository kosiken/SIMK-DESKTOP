import { TestBed } from '@angular/core/testing';

import { LeagueMainService } from './league-main.service';

describe('LeagueMainService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LeagueMainService = TestBed.get(LeagueMainService);
    expect(service).toBeTruthy();
  });
});
