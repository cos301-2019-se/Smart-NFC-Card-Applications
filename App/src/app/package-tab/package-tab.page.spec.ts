/**
*	File Name:	    package-tab.page.spec.ts
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

import { PackageTabPage } from './package-tab.page';

import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { NfcControllerService } from '../services/nfc-controller.service';
import { IonicStorageModule } from '@ionic/storage';
import { BusinessCardsService } from '../services/business-cards.service';
import { LocalStorageService } from '../services/local-storage.service';
import { LocationService } from '../services/location.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Device } from '@ionic-native/device/ngx';
import { SharedModule } from '../shared.module';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { RequestModuleService } from '../services/request-module.service';
import { HttpClientModule } from '@angular/common/http';
import { UniqueIdService } from '../services/unique-id.service';
import { Uid } from '@ionic-native/uid/ngx';

describe('PackageTabPage', () => {
  let component: PackageTabPage;
  let fixture: ComponentFixture<PackageTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PackageTabPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientModule,
        IonicStorageModule.forRoot(),
        SharedModule       
      ],
      providers: [
        AndroidPermissions,
        LocalStorageService,
        BusinessCardsService,
        NfcControllerService,
        NFC, Ndef,
        LocationService,
        Geolocation,
        LaunchNavigator,
        Device,
        Diagnostic,
        RequestModuleService,
        UniqueIdService,
        Uid
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
