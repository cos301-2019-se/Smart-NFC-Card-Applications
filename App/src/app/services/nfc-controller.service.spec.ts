import { TestBed } from '@angular/core/testing';

import { NFC, Ndef, NdefRecord } from '@ionic-native/nfc/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { NfcControllerService } from './nfc-controller.service';
import { IonicStorageModule } from '@ionic/storage';
import { BusinessCardsService } from './business-cards.service';
import { LocalStorageService } from './local-storage.service';

describe('NfcControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      IonicStorageModule.forRoot()
    ],
    providers: [
      AndroidPermissions,
      LocalStorageService,
      BusinessCardsService,
      NFC, Ndef,
    ]
  }));

  it('should be created', () => {
    const service: NfcControllerService = TestBed.get(NfcControllerService);
    expect(service).toBeTruthy();
  });
});
