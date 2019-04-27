import { TestBed } from '@angular/core/testing';

import { NfcControllerService } from './nfc-controller.service';

describe('NfcControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NfcControllerService = TestBed.get(NfcControllerService);
    expect(service).toBeTruthy();
  });
});
