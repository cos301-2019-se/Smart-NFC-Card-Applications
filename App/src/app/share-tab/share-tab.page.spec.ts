/**
*	File Name:	    shared-tab.page.spec.ts
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
*	Functional Description:   This file provides the tests for its respective component
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

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
import { HttpClientModule } from '@angular/common/http';
import { RequestModuleService } from '../services/request-module.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

describe('ShareTab', () => {
  let component: ShareTabPage;
  let fixture: ComponentFixture<ShareTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShareTabPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicStorageModule.forRoot(),
        HttpClientModule
      ],
      providers: [
        AndroidPermissions,
        LocalStorageService,
        BusinessCardsService,
        NfcControllerService,
        NFC, Ndef,
        Geolocation,
        LaunchNavigator,
        RequestModuleService,
        Diagnostic
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

  it('createClickableLink should append http:// to a link without it', () => {
    expect(component.createClickableLink('cs.up.ac.za')).toEqual('http://cs.up.ac.za');
  });

  it('createClickableLink should just return a link that starts with http(s)://', () => {
    expect(component.createClickableLink('https://absa.co.za')).toEqual('https://absa.co.za');
  });
});
