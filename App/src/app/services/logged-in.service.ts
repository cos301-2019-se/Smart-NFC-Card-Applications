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
import { Subject, Observable } from 'rxjs';

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
  private employeeId: number = null;
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
   * @param employeeId number employee logged in or out (default = null)
   */
  private setLoggedIn(isLoggedIn: boolean, employeeId: number = null){
    this.loggedIn = isLoggedIn;
    this.employeeId = employeeId;
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
      return new Observable<Object>(observer => {
        observer.next({success: false, message: "Please enter a username and password."});
        observer.complete();
      });
    }
    else {
      setTimeout(() => {
        this.req.login(username, password).subscribe(res => {
          if (res['success'] === true) {
            this.setLoggedIn(true, res['data']['id']);
            let apiKey = res['data']['apiKey'];
            this.storage.Save(this.apiKeyName, apiKey);
            this.req.getBusinessCard(res['data']['id']).subscribe(response => {
              let cardDetails = response['data'];
              this.cardService.setOwnBusinessCard(cardDetails);
            })
            subject.next({success: true, message: res['message']});
            subject.complete();
          }
          else {
            subject.next({success: false, message: res['message']});
          }
        });
      }, 50);
      return subject.asObservable();
    }
  }

  /**
   * Function that attempts to log the user out
   * @return Observable<Object> { success: boolean, message: string} 
   */
  logout(){
    let subject = new Subject<Object>();
    setTimeout(() => {
      this.req.logout().subscribe(res => {
        if (res['success'] === true) {
          this.setLoggedIn(false);
          subject.next({success: true, message: res['message']});
          subject.complete();
        }
        else {
          subject.next({success: false, message: res['message']});
          subject.complete();
        }
      });
    }, 50);
    return subject.asObservable();
  }

  /**
   * Function that reloads the employee's business card
   * @return Observable<Object> { success: boolean, message: string} 
   */
  reloadBusinessCard(){
    let subject = new Subject<Object>();
    setTimeout(() => {
      this.req.getBusinessCard(this.employeeId).subscribe(response => {
        if (response['success'] === true) {
          let cardDetails = response['data'];
          this.cardService.setOwnBusinessCard(cardDetails).then(() => {
            subject.next({ success: true, message: '' });
            subject.complete();
          })
          .catch(err => {
            subject.next({ success: false, message: err });
            subject.complete();
          });
        }
        else {
          subject.next({success: false, message: response['message']});
          subject.complete();
        }
      })
    }, 50);
    return subject.asObservable();
  }
}
