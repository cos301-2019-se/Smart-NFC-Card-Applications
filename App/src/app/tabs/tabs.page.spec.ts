/**
*	File Name:	    tabs.page.spec.ts
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

import { TabsPage } from './tabs.page';
import { PopoverController, AngularDelegate } from '@ionic/angular';
import { LocalStorageService } from '../services/local-storage.service';
import { IonicStorageModule } from '@ionic/storage';
import { RequestModuleService } from '../services/request-module.service';
import { HttpClientModule } from '@angular/common/http';
import { Toast } from '@ionic-native/toast/ngx';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        IonicStorageModule.forRoot()
      ],
      providers: [
        PopoverController,
        LocalStorageService,
        RequestModuleService,
        AngularDelegate,
        Toast
      ],
      declarations: [TabsPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
