/**
*	File Name:	    loginTab.page.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      LoginTabPage
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/05/19	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the app's login tab's logic
*	Error Messages:   “Error”
*	Assumptions:  None
*	Constraints: 	None
*/

import { Component, OnInit } from '@angular/core';
import { BusinessCard } from '../models/business-card.model';
import { BusinessCardsService } from '../business-cards.service';
import { RequestModuleService } from '../request-module.service';

/**
* Purpose:	This class provides the login tab component
*	Usage:		This class can be used to allow an employee to log in and load his business card
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Component({
  selector: 'app-loginTab',
  templateUrl: 'loginTab.page.html',
  styleUrls: ['loginTab.page.scss'],
})
export class LoginTabPage implements OnInit {

  success: string;
  error: string;
  username: string = '';
  password: string = '';
  title: string = 'Login';
  loggedIn: boolean = false;
  messageTimeout: number = 4000;

  /**
   * Constructor that takes all injectables
   * @param cardService BusinessCardsService injectable
   * @param req RequestModuleService injectable
   */
  constructor(
    private cardService: BusinessCardsService,
    private req: RequestModuleService
  ) { }

  /**
   * Function that triggers when component is initialized
   */
  ngOnInit() {
    this.resetMessages();
  }

  /**
   * Function that triggers when component's view is entered
   */
  ionViewDidEnter() {
    this.resetMessages();
  }

  /**
   * Function that attempts to log the user in
   */
  login(){
    this.resetMessages();
    if(this.username.trim() == "" || this.password.trim() == "") {
      this.showError("Please enter a username and password.", this.messageTimeout);
      return;
    }
    let res = this.req.login(this.username, this.password);
    if (res['success'] === true) {
      this.showSuccess(res['message'], this.messageTimeout);
      this.username = "";
      this.password = "";
      this.loggedIn = true;
      this.updateTitle();
    }
    else {
      this.showError(res['message'], this.messageTimeout);
    }
  }

  /**
   * Function that attempts to log the user out
   */
  logout(){
    this.resetMessages();
    let res = this.req.logout(this.username, this.password);
    if (res['success'] === true) {
      this.showSuccess(res['message'], this.messageTimeout);
      this.loggedIn = false;
      this.updateTitle();
    }
    else {
      this.showError(res['message'], this.messageTimeout);
    }
  }

  private checkLoggedIn() {

  }

  /**
   * Function that checks what the title of the component should be
   */
  private updateTitle() {
    if(this.loggedIn === true) {
      this.title = 'Menu';
    }
    else {
      this.title = 'Login';
    }
  }

  /**
   * Function that resets the error and success messages
   */
  private resetMessages() {
    this.success = null;
    this.error = null;
  }

  private setCard() {
    //this.cardService.SetOwnBusinessCard(this.cname, this.ename, this.cell, this.email, this.loc);
    //this.success = `${this.cname} business card set.`;    
  }

  /**
   * Function that displays a success message to the user
   * @param message string success message to display
   * @param timeout number after how long it should disappear
   */
  private showSuccess(message: string, timeout: number) {
    this.success = message;
    setTimeout(() => {
      this.success = null;
    }, timeout);
  }

  /**
   * Function that displays a error message to the user
   * @param message string error message to display
   * @param timeout number after how long it should disappear
   */
  private showError(message: string, timeout: number) {
    this.error = message;
    setTimeout(() => {
      this.error = null;
    }, timeout);
  }

}
