import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';
import { IonicStorageModule } from '@ionic/storage';

describe('LocalStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      IonicStorageModule.forRoot()
    ],
  }));

  it('should be created', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    expect(service).toBeTruthy();
  });
});
