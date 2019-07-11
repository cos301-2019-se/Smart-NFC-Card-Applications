/**
*	File Name:	    logged-in.service.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      LoggedInService
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/07/10	Wian		  1.0		    Original
*
*	Functional Description:   This service is used to check if the user is logged in or not
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { Injectable } from '@angular/core';
import { RequestModuleService } from './request-module.service';
import { LocalStorageService } from './local-storage.service';
import { BusinessCardsService } from './business-cards.service';
import { Subject } from 'rxjs';

/**
* Purpose:	This class provides the logged in service injectable
*	Usage:		This class can be used to check whether or not the user is logged in
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Injectable({
  providedIn: 'root'
})
export class LoggedInService {

  private loggedIn: boolean = false;
  private employeeId: number = 0;
  private apiKeyName: string = 'apiKey';

  /**
   * Construactor that takes all the injectables
   * @param cardService BusinessCardsService injectable
   * @param req RequestModuleService injectable
   * @param storage LocalStorageService injectable
   */
  constructor(
    private cardService: BusinessCardsService,
    private req: RequestModuleService,
    private storage: LocalStorageService
  ) { }

  /**
   * Function that returns whether or not the user is logged in
   * @return boolean whether or not the user is logged in
   */
  isLoggedIn(){
    return this.loggedIn;
  }

  /**
   * Function to set the logged in status
   * @param isLoggedIn boolean to set loggedIn to
   */
  private setLoggedIn(isLoggedIn: boolean){
    this.loggedIn = isLoggedIn;
  }

  /**
   * Function that attempts to log the user in
   * @param username string username to login with
   * @param password string password to login with
   * @return Observable<Object> { success: boolean, message: string}  
   */
  login(username: string, password: string){
    let subject = new Subject<Object>();
    if(username.trim() == "" || password.trim() == "") {
      subject.next({success: false, message: "Please enter a username and password."});
    }
    else {
      this.req.login(username, password).subscribe(res => {
        if (res['success'] === true) {
          this.setLoggedIn(true);
          let apiKey = res['data']['apiKey'];
          this.storage.Save(this.apiKeyName, apiKey);
          this.req.getBusinessCard(res['data']['id']).subscribe(response => {
            let cardDetails = response['data'];
            this.cardService.setOwnBusinessCard(cardDetails);
          })
          subject.next({success: true, message: res['message']});
        }
        else {
          subject.next({success: false, message: res['message']});
        }
      });
    }
    return subject.asObservable();
  }

  /**
   * Function that attempts to log the user out
   * @return Observable<Object> { success: boolean, message: string} 
   */
  logout(){
    let subject = new Subject<Object>();
    this.req.logout().subscribe(res => {
      if (res['success'] === true) {
        this.setLoggedIn(false);
        subject.next({success: true, message: res['message']});
      }
      else {
        subject.next({success: false, message: res['message']});
      }
    });
    return subject.asObservable();
  }
}
