/**
*	File Name:	    local-storage.service.spec.ts
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

import { LocalStorageService } from './local-storage.service';
import { IonicStorageModule } from '@ionic/storage';

describe('LocalStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      IonicStorageModule.forRoot()
    ],
  }));

  it('should be created', () => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    expect(service).toBeTruthy();
  });

  it('Load should return null if a value is not found', (done) => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    service.Load('test').then(data => {
      expect(data).toBe(null);
      done();
    })
  });

  it('Save should add a key value pair', (done) => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    service.Save('test', 'test')
    .then(() => {
      service.Load('test').then(data => {
        expect(data).toBe('test');
        done();
      })
    })
  });

  it('Load should get the saved value', (done) => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    service.Load('test').then(data => {
      expect(data).toBe('test');
      done();
    })
  });

  it('Remove should remove the key value pair', (done) => {
    const service: LocalStorageService = TestBed.get(LocalStorageService);
    service.Remove('test')
    .then(() => {
      service.Load('test').then(data => {
        expect(data).toBe(null);
        done();
      })
    })
  });
});
