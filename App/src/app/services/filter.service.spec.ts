/**
*	File Name:	    filter.service.spec.ts
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

import { FilterService } from './filter.service';

describe('FilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterService = TestBed.get(FilterService);
    expect(service).toBeTruthy();
  });

  it('getFilter should initially return an empty string', () => {
    const service: FilterService = TestBed.get(FilterService);
    expect(service.getFilter()).toBe('');
  });

  it('setFilter should set the current filter string', () => {
    const service: FilterService = TestBed.get(FilterService);
    service.setFilter('search term');
    expect(service.headerFilter).toBe('search term');
  });

  it('getFilter should return the filter string that is set', () => {
    const service: FilterService = TestBed.get(FilterService);
    service.setFilter('search term');
    expect(service.getFilter()).toBe('search term');
  });
});
