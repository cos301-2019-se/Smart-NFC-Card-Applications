/**
*	File Name:	    nfc-controller.service.spec.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      None
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/05/19	Wian		  1.0		    Original
*
*	Functional Description:   This class provides tests for the service
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/
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
