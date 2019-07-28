/**
*	File Name:	    logged-in.service.spec.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      None
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/07/11	Wian		  1.0		    Original
*
*	Functional Description:   This class provides tests for the service
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { TestBed } from '@angular/core/testing';

import { LoggedInService } from './logged-in.service';
import { LocalStorageService } from './local-storage.service';
import { IonicStorageModule } from '@ionic/storage';
import { RequestModuleService } from './request-module.service';
import { HttpClientModule } from '@angular/common/http';
import { LocationModel } from '../models/location.model';
import { RoomModel } from '../models/room.model';
import { WifiDetailsModel } from '../models/wifi-details.model';

describe('LoggedInService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        IonicStorageModule.forRoot()
      ],
      providers: [
        LocalStorageService,
        RequestModuleService
      ]
    });
    RequestModuleService.demoMode = true;
  });

  it('should be created', () => {
    const service: LoggedInService = TestBed.get(LoggedInService);
    expect(service).toBeTruthy();
  });

  it('isLoggedIn should be false on startup', () => {
    const service: LoggedInService = TestBed.get(LoggedInService);
    expect(service.isLoggedIn()).toBe(false);
  });

  it('login should ask for username and password if it was not supplied', (done) => {
    const service: LoggedInService = TestBed.get(LoggedInService);
    service.login('','').subscribe(res => {      
      expect(res['success']).toBe(false);
      expect(res['message']).toBe('Please enter a username and password.');
      done();
    });
  });

  it('login should set the loggedIn status as well as the employeeId', (done) => {
    const service: LoggedInService = TestBed.get(LoggedInService);
    service.login('admin','password').subscribe(res => {      
      expect(res['success']).toBe(true);
      expect(res['message']).toBe('Login successful.');
      expect(service.isLoggedIn()).toBe(true);
      expect(service.getEmployeeId()).toBe(0);
      done();
    });
  });

  it('getEmployeeId should be null before login but have data after login', (done) => {
    const service: LoggedInService = TestBed.get(LoggedInService);
    expect(service.getEmployeeId()).toBe(null);
    service.login('admin','password').subscribe(res => {
      expect(service.getEmployeeId()).toBe(0);
      done();
    });
  });

  it('getCompanyName should be null before login but have data after login', (done) => {
    const service: LoggedInService = TestBed.get(LoggedInService);
    expect(service.getCompanyName()).toBe(null);
    service.login('admin','password').subscribe(res => {
      expect(service.getCompanyName()).toBe('Vast Expanse');
      done();
    });
  });

  it('getBuildingLoc should be null before login but have data after login', (done) => {
    const service: LoggedInService = TestBed.get(LoggedInService);
    expect(service.getBuildingLoc()).toBe(null);
    service.login('admin','password').subscribe(res => {
      expect(service.getBuildingLoc()).toEqual(new LocationModel(-24.1234,27.891,'Building Name'));
      done();
    });
  });

  it('getRooms should be null before login but have data after login', (done) => {
    const service: LoggedInService = TestBed.get(LoggedInService);
    expect(service.getRooms()).toBe(null);
    service.login('admin','password').subscribe(res => {
      let roomsStub: RoomModel[] = [];
      roomsStub.push(new RoomModel(0, 'Lobby'));
      roomsStub.push(new RoomModel(1, 'Office 1'));
      roomsStub.push(new RoomModel(2, 'Office 2'));
      roomsStub.push(new RoomModel(3, 'Office 3'));
      roomsStub.push(new RoomModel(4, 'Labs'));
      expect(service.getRooms()).toEqual(roomsStub);
      done();
    });
  });

  it('getWifiDetails should be null before login but have data after login', (done) => {
    const service: LoggedInService = TestBed.get(LoggedInService);
    expect(service.getWifiDetails()).toBe(null);
    service.login('admin','password').subscribe(res => {
      expect(service.getWifiDetails()).toEqual(new WifiDetailsModel(0,'DemoSSID','WPA2','Demo1234'));
      done();
    });
  });

  it('reloadBusinessCard should get the business card of the logged in employee', (done) => {
    const service: LoggedInService = TestBed.get(LoggedInService);
    service.login('admin','password').subscribe(res => {    
      service.reloadBusinessCard().subscribe(res => {
        expect(res['success']).toBe(true);
        expect(res['message']).toBe('Successfully reloaded business card');
        expect(service.getCompanyName()).toBe('Vast Expanse');
        done();
      });
    });
  });

  it('Logout should set loggedIn status to false and make account details null', () => {
    const service: LoggedInService = TestBed.get(LoggedInService);
    expect(service).toBeTruthy();
  });
});
