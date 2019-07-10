import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareTabPage } from './share-tab.page';

import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { NfcControllerService } from '../services/nfc-controller.service';
import { IonicStorageModule } from '@ionic/storage';
import { BusinessCardsService } from '../services/business-cards.service';
import { LocalStorageService } from '../services/local-storage.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

describe('ShareTab', () => {
  let component: ShareTabPage;
  let fixture: ComponentFixture<ShareTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShareTabPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicStorageModule.forRoot()
      ],
      providers: [
        AndroidPermissions,
        LocalStorageService,
        BusinessCardsService,
        NfcControllerService,
        NFC, Ndef,
        Geolocation,
        LaunchNavigator
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
