import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tab3Page } from './tab3.page';

import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { NfcControllerService } from '../nfc-controller.service';
import { IonicStorageModule } from '@ionic/storage';
import { BusinessCardsService } from '../business-cards.service';
import { LocalStorageService } from '../local-storage.service';

describe('Tab3Page', () => {
  let component: Tab3Page;
  let fixture: ComponentFixture<Tab3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Tab3Page],
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
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tab3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
