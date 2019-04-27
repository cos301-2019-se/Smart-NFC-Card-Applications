import { TestBed } from '@angular/core/testing';

import { BusinessCardsService } from './business-cards.service';

describe('BusinessCardsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BusinessCardsService = TestBed.get(BusinessCardsService);
    expect(service).toBeTruthy();
  });
});
