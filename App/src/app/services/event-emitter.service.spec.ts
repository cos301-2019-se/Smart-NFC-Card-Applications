/**
*	File Name:	    event-emitter.service.spec.ts
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
*	Functional Description:   This class provides tests for the servce
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/
import { TestBed } from '@angular/core/testing';

import { EventEmitterService } from './event-emitter.service';
import { MessageType } from '../tabs/tabs.page';

describe('EventEmitterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventEmitterService = TestBed.get(EventEmitterService);
    expect(service).toBeTruthy();
  });

  it('menuButtonEvent should trigger a function call for its subscribers', (done) => {
    const service: EventEmitterService = TestBed.get(EventEmitterService);
    service.menuSubscribe(
      service.invokeMenuButtonEvent.subscribe(functionName => {    
          expect(functionName).toBe('functionName');
          done();
        })
    );  
    service.menuButtonEvent('functionName');
  });

  it('messageEvent should trigger a function call for its subscribers', (done) => {
    const service: EventEmitterService = TestBed.get(EventEmitterService);
    service.messageSubscribe(
      service.invokeMessageEvent.subscribe(({message: message, type: type, timeout: timeout}) => {    
          expect(message).toBe('success');
          expect(type).toBe(MessageType.success);
          expect(timeout).toBe(5000);
          done();
        })
    );  
    service.messageEvent('success', MessageType.success, 5000);
  });
});
