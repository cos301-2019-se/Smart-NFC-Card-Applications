/**
*	File Name:	    manage-tab.page.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      ManageTabPage
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
import { LoggedInService } from '../services/logged-in.service';
import { VisitorPackage } from '../models/visitor-package.model';
import { FilterService } from '../services/filter.service';
import { VisitorPackagesService } from '../services/visitor-packages.service';
import { NfcControllerService } from '../services/nfc-controller.service';

/**
* Purpose:	This enum provides message types
*	Usage:		This enum can be used to identify a type of message to display
*	@author:	Wian du Plooy
*	@version:	1.0
*/
enum messageType{
    success, info, error
}

/**
* Purpose:	This class provides the login tab component
*	Usage:		This class can be used to allow an employee to log in and load his business card
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Component({
  selector: 'app-manage-tab',
  templateUrl: 'manage-tab.page.html',
  styleUrls: ['manage-tab.page.scss'],
})
export class ManageTabPage implements OnInit {

  successMessage: string;
  errorMessage: string;
  infoMessage: string;

  username: string = '';
  password: string = '';
  apiKeyName: string = 'apiKey';
  title: string = 'Login';
  loggedIn: boolean = false;
  isBusy: boolean = false;
  messageTimeout: number = 4000;
  packages: VisitorPackage[] = [];
  detailToggles = [];

  /**
   * Constructor that takes all injectables
   * @param cardService BusinessCardsService injectable
   * @param req RequestModuleService injectable
   * @param storage LocalStorageService injectable
   * @param modalController ModalController injectable
   * @param eventEmitterService EventEmitterService injectable
   * @param loginService LoggedInService injectable
   * @param filterService FilterService injectable
   * @param packageService: VisitorPackagesService injectable
   * @param nfcService: NfcControllerService injectable
   */
  constructor(
    private cardService: BusinessCardsService,
    private req: RequestModuleService,
    private storage: LocalStorageService,
    private modalController: ModalController,
    private eventEmitterService: EventEmitterService,
    private loginService: LoggedInService,
    private filterService: FilterService,
    private packageService: VisitorPackagesService,
    private nfcService: NfcControllerService
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
    this.loadPackages();
  }

  /**
   * Function that triggers when component's view is entered
   */
  ionViewDidEnter() {
    this.resetMessages();
  }

  menuEvent(functionName: string) {
    switch(functionName) {
      case 'Login': this.login();
        break;
      case 'Create Visitor Package': this.openCreateVisitorPackageModal();
        break;
      case 'Delete Expired Packages': this.deleteExpired();
        break;
      case 'Logout': this.logout();
        break;
    }
  }

  /**
   * Function that attempts to log the user in
   */
  login(){
    this.resetMessages();
    if(this.username.trim() == "" || this.password.trim() == "") {
      this.showMessage("Please enter a username and password.", messageType.error, this.messageTimeout);
      return;
    }
    this.isBusy = true;
    this.req.login(this.username, this.password).subscribe(res => {
      if (res['success'] === true) {
        this.username = "";
        this.password = "";
        this.loginService.SetLoggedIn(true);
        this.loggedIn = true;
        let apiKey = res['data']['apiKey'];
        this.storage.Save(this.apiKeyName, apiKey);
        this.req.getBusinessCard(res['data']['id']).subscribe(response => {
          let cardDetails = response['data'];
          this.cardService.setOwnBusinessCard(cardDetails);
          this.updateTitle();
        })
        this.showMessage(res['message'], messageType.success, this.messageTimeout);
      }
      else {
        this.showMessage(res['message'], messageType.error, this.messageTimeout);
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
      this.showMessage(res['message'], messageType.success, this.messageTimeout);
      this.loginService.SetLoggedIn(false);
      this.loggedIn = false;
      this.updateTitle();
    }
    else {
      this.showMessage(res['message'], messageType.error, this.messageTimeout);
    }
  }

  /**
   * Function that checks if the user is already logged in when the app starts
   */
  private checkLoggedIn() {
    this.loginService.SetLoggedIn(false);
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
    if(this.loginService.IsLoggedIn() === true) {
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
    this.successMessage = null;
    this.errorMessage = null;
    this.infoMessage = null;
  }

  /**
   * Function that displays a message to the user
   * @param message string message to display
   * @param type number from enum, type of message to display
   * @param timeout number after how long it should disappear (0 = don't dissappear)
   */
  private showMessage(message: string, type: number, timeout: number = 0) {
    this.successMessage = null;
    this.infoMessage = null;
    this.errorMessage = null;
    switch(type) {
      case messageType.success: 
        this.successMessage = message;
        if (timeout != 0) { setTimeout(() => { this.successMessage = null;}, timeout); }
        break;
      case messageType.info:
        this.infoMessage = message;
        if (timeout != 0) { setTimeout(() => { this.infoMessage = null;}, timeout); }
        break;
      case messageType.error:
        this.errorMessage = message;
        if (timeout != 0) { setTimeout(() => { this.errorMessage = null;}, timeout); }
        break;
    }
  }

  private setCard() {
    //this.cardService.SetOwnBusinessCard(this.cname, this.ename, this.cell, this.email, this.loc);
    //this.success = `${this.cname} business card set.`;    
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
    modal.onDidDismiss().then(() => {
      this.loadPackages();
    });
    return await modal.present();  
  }

  /**
   * Function that loads the visitor packages from the service or sets it to empty if it doesn't exist
   */
  loadPackages(){
    // Get cards
    this.packageService.getSharedVisitorPackages().then((val) => {      
      this.packages = val;
      // If it is null, set it as an empty array
      if (this.packages == null) {
        this.packages = []
        this.packageService.setSharedVisitorPackages([]);
      }
      this.setupToggles();
    });
  }

  /**
   * Function that formats the date for display
   * @param date any string or date object
   */
  displayDate(date){
    date = new Date(date);
    let day = date.getDate();
    if (day < 10) {
      day = '0' + day.toString();
    }
    let month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month.toString();
    }
    let year = date.getFullYear();
    let hours = date.getHours();
    if (hours < 10) {
      hours = '0' + hours.toString();
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = '0' + minutes.toString();
    }
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }

  /**
   * Function that is used to check if a package is currently in effect
   * @param startDate Date when package takes effect
   * @param endDate Date when package expires
   * @return boolean whether or not the package is currently active
   */
  checkInEffect(startDate: Date, endDate: Date) {
    let currDate = new Date();
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    return (startDate <= currDate && endDate >= currDate);
  }

  /**
   * Function deletes all packages that has already expired (locally only)
   */
  deleteExpired(){
    let currDate = new Date();
    this.packages.forEach(visitorPackage => {
      if (visitorPackage.endDate < currDate) {
        this.packageService.removeSharedVisitorPackage(visitorPackage.packageId);
      }
    });
    this.loadPackages();
  }

  /**
   * Sets the array to check which packages where toggled
   */
  setupToggles(){
    this.detailToggles = [];
    this.packages.forEach(card => {
      this.detailToggles[card.packageId] = false;
    });
  }

  /**
   * Function toggles the package detail
   * @param packageId number Id of visitor package to toggle
   */
  toggleDetails(packageId: number){
    this.detailToggles[packageId] = !this.detailToggles[packageId];
  }

  /**
   * Function that reshares the visitor package - used after editing for example
   * @param packageId number visitor package id
   */
  reshare(packageId: number) {
    let reshareObj: VisitorPackage = this.packages.find(item => item.packageId == packageId);
    this.shareVisitorPackage(reshareObj);
  }

  /**
   * Function removes a visitor package from the list
   * @param packageId number Id of visitor package to remove
   */
  removeVisitorPackage(packageId: number){
    //TODO: Delete from DB
    this.packageService.removeSharedVisitorPackage(packageId).then(() => {
      this.loadPackages();
    });
  }

  /**
   * Function that share the visitor package with the client
   * @param visitorPackage VisitorPackage object to share
   */
  private shareVisitorPackage(visitorPackage: VisitorPackage){
    this.errorMessage = null;
    this.successMessage = null;
    this.infoMessage = null;
    this.showMessage(`Hold the phone against the receiving phone.`, messageType.info, 0);
    this.nfcService.SendData(visitorPackage.packageId, JSON.stringify(visitorPackage))
    .then(() => {
      this.showMessage("Package Reshared", messageType.success, 2000);
    })
    .catch((err) => {
      this.showMessage(`Error: ${err} - Try turning on 'Android Beam'`, messageType.error, 5000);
    })
    .finally(() => {
      this.infoMessage = null;
      this.nfcService.Finish();
    });
  }
}

