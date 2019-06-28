import { TestBed } from '@angular/core/testing';

import { VisitorPackagesService } from './visitor-packages.service';

describe('VisitorPackagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisitorPackagesService = TestBed.get(VisitorPackagesService);
    expect(service).toBeTruthy();
  });
});
