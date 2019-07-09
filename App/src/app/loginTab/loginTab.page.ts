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
*	2019/06/26	Wian		  1.1		    Added functionality to create visitor package
*
*	Functional Description:   This class provides the app's login tab's logic
*	Error Messages:   “Error”
*	Assumptions:  None
*	Constraints: 	None
*/

import { Component, OnInit } from '@angular/core';
import { BusinessCard } from '../models/business-card.model';
import { BusinessCardsService } from '../services/business-cards.service';
import { LocalStorageService } from '../services/local-storage.service';
import { RequestModuleService } from '../services/request-module.service';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { CreateVisitorPackagePage } from '../create-visitor-package/create-visitor-package.page';
import { EventEmitterService } from '../services/event-emitter.service';   

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
  apiKeyName: string = 'apiKey';
  title: string = 'Login';
  loggedIn: boolean = false;
  isBusy: boolean = false;
  messageTimeout: number = 4000;

  /**
   * Constructor that takes all injectables
   * @param cardService BusinessCardsService injectable
   * @param req RequestModuleService injectable
   * @param storage LocalStorageService injectable
   * @param modalController ModalController injectable
   */
  constructor(
    private cardService: BusinessCardsService,
    private req: RequestModuleService,
    private storage: LocalStorageService,
    private modalController: ModalController,
    private eventEmitterService: EventEmitterService   
  ) { }

  /**
   * Function that triggers when component is initialized
   */
  ngOnInit() {
    this.resetMessages();
    this.checkLoggedIn();    
    this.eventEmitterService.subscriptions.push(
      this.eventEmitterService.invokeMenuButtonEvent.subscribe(functionName => {    
          this.menuEvent(functionName);
        })
    );    
  }

  /**
   * Function that triggers when component's view is entered
   */
  ionViewDidEnter() {
    this.resetMessages();
  }

  menuEvent(functionName: string) {
    switch(functionName) {
      case 'Login': this.login()
        break;
      case 'Create Visitor Package': this.openCreateVisitorPackageModal()
        break;
    }
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
    this.isBusy = true;
    this.req.login(this.username, this.password).subscribe(res => {
      if (res['success'] === true) {
        this.username = "";
        this.password = "";
        this.loggedIn = true;
        let apiKey = res['data']['apiKey'];
        this.storage.Save(this.apiKeyName, apiKey);
        this.req.getBusinessCard(res['data']['id']).subscribe(response => {
          let cardDetails = response['data'];
          this.cardService.setOwnBusinessCard(cardDetails);
          this.updateTitle();
        })
        this.showSuccess(res['message'], this.messageTimeout);
      }
      else {
        this.showError(res['message'], this.messageTimeout);
      }
      this.isBusy = false;
    });
  }

  /**
   * Function that attempts to log the user out
   */
  logout(){
    this.resetMessages();
    let res = this.req.logout();
    if (res['success'] === true) {
      this.showSuccess(res['message'], this.messageTimeout);
      this.loggedIn = false;
      this.updateTitle();
    }
    else {
      this.showError(res['message'], this.messageTimeout);
    }
  }

  /**
   * Function that checks if the user is already logged in when the app starts
   */
  private checkLoggedIn() {
    this.loggedIn = false;
    /*if(this.apiKey === null || this.apiKey == '') {
      this.loggedIn = false;
    }
    else {
      let res = this.req.checkLoggedIn(this.apiKey);
      if(res['success'] === true) {
        this.loggedIn = true;
      }
      else {
        this.loggedIn = false;
      }
    }*/
    this.updateTitle();
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

  /**
   * Function that displays the Create Visitor Package modal
   */
  async openCreateVisitorPackageModal() {
    const modal = await this.modalController.create({
      component: CreateVisitorPackagePage,
      showBackdrop: true,
      animated: true
    });  
    return await modal.present();  
  }
}
