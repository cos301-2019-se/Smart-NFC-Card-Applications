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
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { IonicStorageModule } from '@ionic/storage';

describe('RequestModuleService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      IonicStorageModule.forRoot()
    ],
    providers: [
      LocalStorageService
    ]
  }));

  it('should be created', () => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    expect(service).toBeTruthy();
  });

  it('login should return stub data while in demo mode', (done) => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = true;
    service.login("","").subscribe(data => {
      expect(data).toBe(service.loginStub);
      done();
    });
  });

  it('checkLoggedIn should return true if apiKey was the same as the loginStub', (done) => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = true;
    service.apiKey = service.loginStub['data']['apiKey'];
    service.checkLoggedIn().subscribe(data => {
      expect(data).toBe(service.loginStub);
      done();
    });
  });

  it('checkLoggedIn should return false if apiKey was different from the loginStub', (done) => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = true;
    service.login("", "").subscribe(res => {
      service.logout().subscribe(data => {
        service.checkLoggedIn().subscribe(data => {
          expect(data).toBe(service.logoutStub);
          done();
        });
      });
    });
  });

  it('logout should return stub data while in demo mode', (done) => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = true;
    service.logout().subscribe(data => {
      expect(data).toBe(service.logoutStub);
      done();
    });
  });

  it('getBusinessCard should return stub data while in demo mode', (done) => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = true;
    service.getBusinessCard(0).subscribe(data => {
      expect(data).toBe(service.businessCardStub);
      done();
    });
  });

  it('addVisitorPackage should return stub data while in demo mode', (done) => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = true;
    service.addVisitorPackage(0, '2019/07/01', '2019/07/01', 'ae87af78ef', 0, 0, 100).subscribe(data => {
      expect(data).toBe(service.visitorPackageStub);
      done();
    });
  });

  /*it('login should return data from back-end', () => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = false;
    (<Observable<object>>service.login("piet.pompies@gmail.com", "1234")).subscribe(res => {
      expect(res).toBe(service.loginStub);
    });
  });

  it('logout should return data from back-end', () => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = false;
    expect(service.logout()).toBe(service.logoutStub);
  });

  it('getBusinessCard should return data from back-end', () => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = false;
    (<Observable<object>>service.getBusinessCard(service.loginStub['data']['id'], service.loginStub['data']['apiKey'])).subscribe(res => {
      expect(res).toBe(service.businessCardStub);
    });
  });

  it('checkLoggedIn should return true if apiKey was the same as the loginStub', () => {
    const service: RequestModuleService = TestBed.get(RequestModuleService);
    service.demoMode = true;
    let res = service.login("piet.pompies@gmail.com", "1234");
    expect(service.checkLoggedIn(res['data']['apiKey'])).toBe(service.loginStub);
  });*/
});
