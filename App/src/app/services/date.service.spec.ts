/**
*	File Name:	    date.service.spec.ts
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

import { DateService } from './date.service';

describe('DateService', () => {
  let testDate = new Date('2019/07/11 16:20');

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DateService = TestBed.get(DateService);
    expect(service).toBeTruthy();
  });
  

  it('displayDateFull should format a date for displaying the entire date', () => {
    const service: DateService = TestBed.get(DateService);
    expect(service.displayDateFull(testDate)).toBe('2019/07/11 16:20');
  });
  

  it('displayDate should format a date for displaying only the date part', () => {
    const service: DateService = TestBed.get(DateService);
    expect(service.displayDate(testDate)).toBe('2019/07/11');
  });
  

  it('displayTime should format a date for displaying only the time part', () => {
    const service: DateService = TestBed.get(DateService);
    expect(service.displayTime(testDate)).toBe('16:20');
  });
  

  it('databaseDate should format a date for sending it to the database', () => {
    const service: DateService = TestBed.get(DateService);
    expect(service.databaseDate(testDate)).toBe('2019/07/11 16:20');
  });

});
