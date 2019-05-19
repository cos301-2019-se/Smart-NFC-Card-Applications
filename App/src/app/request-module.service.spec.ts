/**
*	File Name:	    request-module.service.spec.ts
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
*	Functional Description:   This test is used for testing the request-module
*	Error Messages:   “Error”
*	Assumptions:  None
*	Constraints: 	None
*/

import { TestBed } from '@angular/core/testing';
import { RequestModuleService } from './request-module.service';
import { HttpClientModule } from '@angular/common/http';

describe('RequestModuleService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    expect(service).toBeTruthy();
  });

  it('login should return stub data while in demo mode', () => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = true;
    expect(service.login("", "")).toBe(service.loginStub);
  });

  it('logout should return stub data while in demo mode', () => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = true;
    expect(service.logout()).toBe(service.logoutStub);
  });

  it('getBusinessCard should return stub data while in demo mode', () => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = true;
    expect(service.getBusinessCard(0)).toBe(service.businessCardStub);
  });

  it('login should return data from back-end', () => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = false;
    throw Error("Not implemented yet");
  });

  it('logout should return data from back-end', () => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = false;
    throw Error("Not implemented yet");
  });

  it('getBusinessCard should return data from back-end', () => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = false;
    throw Error("Not implemented yet");
  });
});
