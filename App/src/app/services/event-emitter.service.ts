import { Injectable, EventEmitter } from '@angular/core';    
import { Subscription } from 'rxjs/internal/Subscription';  

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  invokeMenuButtonEvent = new EventEmitter();    
  public subscriptions: Subscription[] = [];    
    
  constructor() { }    
    
  menuButtonEvent(functionName: string) {    
    this.invokeMenuButtonEvent.emit(functionName);    
  }   

}
