import { Injectable, EventEmitter } from '@angular/core';    
import { Subscription } from 'rxjs/internal/Subscription';  
import { MessageType } from '../tabs/tabs.page';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  invokeMenuButtonEvent = new EventEmitter();    
  private menuSubscriptions: Subscription[] = [];    

  invokeMessageEvent = new EventEmitter();    
  private messageSubscriptions: Subscription[] = [];   
    
  constructor() { }    
    
  menuSubscribe(subscription: Subscription) {
    this.menuSubscriptions.push(subscription);
  }

  menuButtonEvent(functionName: string) {    
    this.invokeMenuButtonEvent.emit(functionName);    
  }   
    
  messageSubscribe(subscription: Subscription) {
    this.messageSubscriptions.push(subscription);
  }

  messageEvent(message: string, type: MessageType, timeout: number) {    
    this.invokeMessageEvent.emit({message: message, type: type, timeout: timeout});    
  }   

}
