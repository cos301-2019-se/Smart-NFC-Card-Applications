import { TestBed } from '@angular/core/testing';

import { BusinessCardsService } from './business-cards.service';
import { LocalStorageService } from './local-storage.service';
import { IonicStorageModule } from '@ionic/storage';

describe('BusinessCardsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      IonicStorageModule.forRoot()
    ],
    providers: [
      LocalStorageService
    ]}));

  it('should be created', () => {
    const service: BusinessCardsService = TestBed.get(BusinessCardsService);
    expect(service).toBeTruthy();
  });
});
