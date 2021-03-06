/**
*	File Name:	    manage-tab.page.spec.ts
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

import { ManageTabPage } from './manage-tab.page';

import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';

import { BusinessCardsService } from '../services/business-cards.service';
import { LocalStorageService } from '../services/local-storage.service';
import { RequestModuleService } from '../services/request-module.service';
import { ModalController, AngularDelegate } from '@ionic/angular';
import { SharedModule } from '../shared.module';
import { NfcControllerService } from '../services/nfc-controller.service';
import { Ndef, NFC } from '@ionic-native/nfc/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

describe('ManageTabPage', () => {
  let component: ManageTabPage;
  let fixture: ComponentFixture<ManageTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageTabPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientModule,
        IonicStorageModule.forRoot(),
        SharedModule
      ],
      providers: [
        LocalStorageService,
        BusinessCardsService,
        RequestModuleService,
        ModalController, AngularDelegate,
        NfcControllerService,
        NFC, Ndef,
        AndroidPermissions
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login should display an error if username and password is missing', () => {
    component.login();
    expect(component.loggedIn).toBe(false);
  });

  it('login should show after successful logout', () => {
    component.logout();
    expect(component.loggedIn).toBe(false);
  });
});
