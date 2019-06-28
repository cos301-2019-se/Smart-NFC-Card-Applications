import { TestBed } from '@angular/core/testing';

import { VisitorPackagesService } from './visitor-packages.service';
import { IonicStorageModule } from '@ionic/storage';

describe('VisitorPackagesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      IonicStorageModule.forRoot()
    ],
  }));

  it('should be created', () => {
    const service: VisitorPackagesService = TestBed.get(VisitorPackagesService);
    expect(service).toBeTruthy();
  });
});
