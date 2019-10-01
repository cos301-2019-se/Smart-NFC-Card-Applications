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

import { Component, OnInit, ViewChild } from '@angular/core';
import { BusinessCard } from '../models/business-card.model';
import { BusinessCardsService } from '../services/business-cards.service';
import { LocalStorageService } from '../services/local-storage.service';
import { RequestModuleService } from '../services/request-module.service';
import { Observable } from 'rxjs';
import { ModalController, AlertController, IonInput } from '@ionic/angular';
import { CreateVisitorPackagePage } from '../create-visitor-package/create-visitor-package.page';
import { EventEmitterService } from '../services/event-emitter.service';   
import { LoggedInService } from '../services/logged-in.service';
import { VisitorPackage } from '../models/visitor-package.model';
import { FilterService } from '../services/filter.service';
import { VisitorPackagesService } from '../services/visitor-packages.service';
import { NfcControllerService } from '../services/nfc-controller.service';
import { EditVisitorPackagePage } from '../edit-visitor-package/edit-visitor-package.page';
import { DateService } from '../services/date.service';
import { MessageType } from '../tabs/tabs.page';

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

  username: string = '';
  password: string = '';
  loggedIn: boolean = false;

  messageTimeout: number = 4000;
  packages: VisitorPackage[] = [];
  activePackages: VisitorPackage[] = [];
  inactivePackages: VisitorPackage[] = [];
  detailToggles = [];

  hasPackages: Boolean = true;
  
  @ViewChild('unameInput') unameInput : IonInput;
  @ViewChild('passInput') passInput : IonInput;

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
   * @param dateService DateService injectable
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
    private nfcService: NfcControllerService,
    private dateService: DateService,
    private alertController: AlertController
  ) { }

  /**
   * Function that triggers when component is initialized
   */
  ngOnInit() {
    this.resetMessages();
    this.checkLoggedIn();    
    this.eventEmitterService.menuSubscribe(
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
      case 'Login': this.login();
        break;
      case 'Refresh Account Details': this.refreshAccountDetails();
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
    this.unameInput.ionBlur;
    this.passInput.ionBlur;
    this.loginService.login(this.username, this.password).subscribe(res => {
      if (res['success'] === true) {
        this.loggedIn = true;
        this.username = null;
        this.password = null;
        this.showMessage(res['message'], MessageType.success, this.messageTimeout);
      }
      else {
        this.loggedIn = false;
        this.showMessage(res['message'], MessageType.error, this.messageTimeout);
      }
      this.loadPackages();
      this.req.dismissLoading();
    });
  }

  /**
   * Function that attempts to log the user out
   */
  logout(){
    this.resetMessages();
    this.loginService.logout().subscribe(res => {
      if (res['success'] === true) {
        this.loggedIn = false;
        this.showMessage(res['message'], MessageType.success, this.messageTimeout);
      }
      else {
        this.showMessage(res['message'], MessageType.error, this.messageTimeout);
      }
      this.loadPackages();
      this.req.dismissLoading();
    });
  }

  /**
   * Function that checks if the user is already logged in when the app starts
   */
  private checkLoggedIn() {
    this.loggedIn = this.loginService.isLoggedIn();
  }

  /**
   * Function that resets the error and success messages
   */
  private resetMessages() {
    this.showMessage('', MessageType.reset);
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
   * Function that displays the Edit Visitor Package modal
   * @param packageToEdit VisitorPackage to edit
   */
  async openEditVisitorPackageModal(packageToEdit: VisitorPackage) {
    const modal = await this.modalController.create({
      component: EditVisitorPackagePage,
      showBackdrop: true,
      animated: true,
      componentProps: {packageToUpdate: packageToEdit}
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
      let currDate = new Date();
      if (val !== null) {
        // Delete expired packages
        val = val.filter(elem => {
          return (new Date(elem.endDate)) > currDate;
        })
        this.packageService.setSharedVisitorPackages(val).then(() => {   
          this.packages = val;
          if (val.length < 1) {
            this.hasPackages = false;
          }
          this.setupToggles();          
          // Populate active and inactive packages
          this.activePackages = this.packages.filter(elem => {
            return this.checkInEffect(elem.startDate, elem.endDate);
          });
          this.inactivePackages = this.packages.filter(elem => {
            return !this.checkInEffect(elem.startDate, elem.endDate);
          });
        });  
      }
      else {   
        // If no packages has been saved previously     
        this.hasPackages = false;
        this.packages = [];
        this.activePackages = [];
        this.inactivePackages = [];
        this.packageService.setSharedVisitorPackages([]);
        this.setupToggles();
      }
    });
  }

  /**
   * Function that formats the date for display
   * @param date any string or date object
   */
  displayDate(date: Date){
    return this.dateService.displayDateFull(date);
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
  async deleteExpired(){
    const alert = await this.alertController.create({
      header: 'Delete Expired Packages',
      message: `Are you sure you want to <strong>delete expired</strong> packages?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Delete',
          handler: () => {
            let currDate = new Date();
            let numExpiredPackages = 0;

            this.packages = this.packages.filter(elem => {
              if ((new Date(elem.endDate)) <= currDate) numExpiredPackages++;
              return (new Date(elem.endDate)) > currDate;
            })
            this.packageService.setSharedVisitorPackages(this.packages).then(() => {
              this.loadPackages();
              let successMessage = 'Success';
              if (numExpiredPackages > 0) {
                successMessage = 'Deleted expired packages.';
              }
              else {
                successMessage = 'No expired packages to delete.';
              }
              this.showMessage(successMessage, MessageType.success);
            });
          }
        }
      ]
    });
    await alert.present();
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
   * Function that opens a modal to allow a package to be changed
   * @param packageId number Id of visitor package to edit
   */
  editVisitorPackage(packageId: number){    
    this.openEditVisitorPackageModal(this.packages.find(item => item.packageId == packageId));
  }

  /**
   * Function removes a visitor package from the list
   * @param packageId number Id of visitor package to remove
   */
  async removeVisitorPackage(packageId: number){
    let visitorPackage: VisitorPackage = this.packages.find(visitorPackage => visitorPackage.packageId == packageId);
    const alert = await this.alertController.create({
      header: 'Delete Visitor Package',
      message: `Are you sure you want to <strong>delete the ${visitorPackage.access}</strong> package of the visitor?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Delete',
          handler: () => {
            this.req.deleteVisitorPackage(packageId).subscribe(json => {
              if (json['success'] === true) {
                this.packageService.removeSharedVisitorPackage(packageId).then(() => {
                  this.showMessage(`Deleted the ${visitorPackage.access} package`, MessageType.success);
                  this.loadPackages();
                })
                .catch(err => {
                  this.showMessage(`Couldn't delete: ${err}`, MessageType.error);
                });
              }
              else {
                this.showMessage(`Could not delete package: ${json['message']}`, MessageType.error)
              }
            }, err => {
              this.showMessage(`Error adding to DB: Ensure that you have a stable internet connection`, MessageType.error);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Function that share the visitor package with the client
   * @param visitorPackage VisitorPackage object to share
   */
  private shareVisitorPackage(visitorPackage: VisitorPackage){
    this.showMessage('', MessageType.reset);
    this.showMessage(`Hold the phone against the receiving phone.`, MessageType.info, 0);
    this.nfcService.SendData(visitorPackage.packageId, JSON.stringify(visitorPackage))
    .then(() => {
      this.showMessage("Package Reshared", MessageType.success, 2000);
    })
    .catch((err) => {
      this.showMessage(`Error: ${err} - Try turning on 'Android Beam'`, MessageType.error, 5000);
    })
    .finally(() => {
      this.nfcService.Finish();
    });
  }

  /**
   * Function that displays a message to the user
   * @param message string message to display
   * @param type number from enum, type of message to display
   * @param timeout number after how long it should disappear (0 = don't dissappear)
   */
  showMessage(message: string, type: number, timeout: number = 5000) {
    this.eventEmitterService.messageEvent(message, type, timeout);
  }

  /**
   * Function that fetches the account details from the db again
   */
  refreshAccountDetails(){
    this.loginService.refreshAccountDetails().subscribe(res => {
      if (res['success'] === true) {
        this.showMessage(res['message'], MessageType.success);
      }
      else {
        this.showMessage(res['message'], MessageType.error);
      }
      this.loadPackages();
      this.req.dismissLoading();
    });
  }
}

