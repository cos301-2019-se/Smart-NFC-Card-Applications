import { TestBed } from '@angular/core/testing';

import { WifiService } from './wifi.service';

describe('WifiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WifiService = TestBed.get(WifiService);
    expect(service).toBeTruthy();
  });
});
