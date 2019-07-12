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
  
  /**
   * Function adds a subscription to the list of listeners of the menu event
   * @param subscription Subscription to add
   */
  menuSubscribe(subscription: Subscription) {
    this.menuSubscriptions.push(subscription);
  }

  /**
   * Function that emits the menu event
   * @param functionName string name of the function to be called
   */
  menuButtonEvent(functionName: string) {    
    this.invokeMenuButtonEvent.emit(functionName);    
  }   
    
  /**
   * Function adds a subscription to the list of listeners of the message event
   * @param subscription Subscription to add
   */
  messageSubscribe(subscription: Subscription) {
    this.messageSubscriptions.push(subscription);
  }

  /**
   * Function that emits the message event
   * @param message string message to display
   * @param type MessageType to display
   * @param timeout number it should show before disappearing
   */
  messageEvent(message: string, type: MessageType, timeout: number) {    
    this.invokeMessageEvent.emit({message: message, type: type, timeout: timeout});    
  }   

}
