/**
*	File Name:	    location.service.spec.ts
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

import { LocationService } from './location.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { LocationModel } from '../models/location.model';

describe('LocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Geolocation,
      LaunchNavigator
    ]
  }));

  it('should be created', () => {
    const service: LocationService = TestBed.get(LocationService);
    expect(service).toBeTruthy();
  });
});
