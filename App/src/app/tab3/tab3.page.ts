/**
*	File Name:	    tab3.page.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      Tab3Page
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/05/19	Wian		  1.0		    Original
*	2019/06/25	Wian		  1.1		    Added changes to allow navigation on tap of location
*	2019/06/28	Wian		  1.2		    Added functionality to add visitor packages
*
*	Functional Description:   This file provides the component that allows viewing shared cards
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { Component } from '@angular/core';
import { BusinessCardsService } from '../services/business-cards.service';
import { BusinessCard } from '../models/business-card.model';
import { NfcControllerService } from '../services/nfc-controller.service';
import { LocationService } from '../services/location.service';
import { WifiService } from '../services/wifi.service';
import { LocationModel } from '../models/location.model';
import { Device } from '@ionic-native/device/ngx';
import { VisitorPackage } from '../models/visitor-package.model';
import { VisitorPackagesService } from '../services/visitor-packages.service';

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
* Purpose:	This class provides the component that allows viewing of shared cards as well as adding new ones
*	Usage:		This component can be used to view and add business cards to a locally stored list
*	@author:	Wian du Plooy
*	@version:	1.2
*/
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  cards: BusinessCard[] = [];
  packages: VisitorPackage[] = [];
  detailToggles = [];
  errorMessage: string = null;
  successMessage: string = null;
  infoMessage: string = null;
  check;

  /**
   * Constructor that takes all injectables
   * @param cardService BusinessCardsService injectable
   * @param nfcService NfcControllerService injectable
   * @param locationService LocationService injectable
   * @param device Device injectable
   * @param packageService VisitorPackagesService injectable
   * @param wifiService WifiService injectable
   */
  constructor(
    private cardService: BusinessCardsService,
    private nfcService: NfcControllerService,
    private locationService: LocationService,
    private device: Device,
    private packageService: VisitorPackagesService,
    private wifiService: WifiService
  ) { }

  /**
   * Function triggers when the tab is navigated to
   */
  ionViewDidEnter() {
    //Initialize message values 
    this.errorMessage = null;
    this.successMessage = null;
    this.infoMessage = null;
    // Gets the business cards
    this.loadCards(); 
    this.loadPackages();
  }

  /**
   * Function triggers when the tab is left
   */
  ionViewWillLeave(){
    // Stops the NFC if the action wasn't completed
    this.nfcService.Finish();
    clearInterval(this.check);
  }

  /**
   * Function that loads the cards from the service or sets it to empty if it doesn't exist
   */
  loadCards(){
    // Get cards
    this.cardService.getBusinessCards().then((val) => {      
      this.cards = val;
      // If it is null, set it as an empty array
      if (this.cards == null) {
        this.cards = []
        this.cardService.setBusinessCards([]);
      }
      // Setup the toggle booleans
      this.setupToggles();
    });
  }

  /**
   * Function that loads the visitor packages from the service or sets it to empty if it doesn't exist
   */
  loadPackages(){
    // Get cards
    this.packageService.getVisitorPackages().then((val) => {      
      this.packages = val;
      // If it is null, set it as an empty array
      if (this.packages == null) {
        this.packages = []
        this.packageService.setVisitorPackages([]);
      }
      // Setup the toggle booleans
      //this.setupToggles();
    });
  }

  /**
   * Function reorders the lists and saves the order to the local storage
   * @param ev reorder event
   */
  reorderItems(ev) {
    // Get the item to move and remove it
    const itemMove = this.cards.splice(ev.detail.from, 1)[0];
    const toggleMove = this.detailToggles.splice(ev.detail.from, 1)[0];
    // Add the item to move back to the new right spot
    this.cards.splice(ev.detail.to, 0, itemMove);
    this.detailToggles.splice(ev.detail.to, 0, toggleMove);
    ev.detail.complete();
    // Save it to the local storage
    this.cardService.setBusinessCards(this.cards);
  }

  /**
   * Function listens for an NFC Tag with the Business Card
   */
  addCard(){
    //Reset message values 
    this.errorMessage = null;
    this.successMessage = null;
    this.infoMessage = null;

    // Check if nfc is enabled
    this.nfcService.IsEnabled()
    .then(() => {
      // Continue if it is enabled
      this.showMessage(`Hold the phone against the sharing device.`, messageType.info, 0);
      this.nfcService.ReceiveData().subscribe(data => {
        // read data from the payload
        let payload = this.nfcService.BytesToString(data.tag.ndefMessage[0].payload);
        // Stop the listener for receiving other tags        
        this.nfcService.Finish();
        // through away the language modifier and parse it to json
        let json = JSON.parse(payload.slice(3));
        this.showMessage(`Received ${json.companyName} Business Card.`, messageType.success, 5000);
        // Add the card to the local storage
        this.cardService.addBusinessCard(json.companyId, json.companyName, json.employeeName, json.contactNumber, json.email, json.website, json.location)
        .then(() => {
          this.loadCards();
        });
      });
    })
    .catch(() => {
      // If it is disabled, display error to user.
      this.showMessage(`NFC seems to be off. Please try turing it on.`, messageType.error, 0);
    })
  }

  /**
   * Function removes a business card from the list
   * @param cardId string Id of business card to remove
   */
  removeCard(cardId: string){
    this.cardService.removeBusinessCard(cardId).then(() => {
      this.loadCards();
    });
  }

  /**
   * Sets the array to check which cards where toggled
   */
  setupToggles(){
    this.detailToggles = [];
    this.cards.forEach(card => {
      this.detailToggles[card.businessCardId] = false;
    });
  }

  /**
   * Function toggles the business card detail of a company
   * @param companyId number Id of business card to toggle
   */
  toggleDetails(companyId: number){
    this.detailToggles[companyId] = !this.detailToggles[companyId];
  }

  /**
   * Function waits for NFC to become enabled and retries adding
   */
  retry(){
    // Show NFC settings to the user
    this.nfcService.ShowSettings();
    this.check = setInterval(() => {
      this.nfcService.IsEnabled().then(() => {
        // If NFC got enabled, remove the check and try to add the card again
        clearInterval(this.check);
        this.addCard();
      })
    }, 1500);
  }

  /**
   * Function that opens the navigator with directions from current position to destination
   * @param destination where to go to
   */
  navigate(destination){
    this.errorMessage = null;
    this.successMessage = null;
    let dest = new LocationModel(destination.latitude, destination.longitude, destination.label);    
    this.showMessage(`Please wait while navigator is launched.`, messageType.info, 5000);
    this.locationService.navigate(dest, () => {
      this.showMessage(`Navigator launching.`, messageType.success, 5000);
    }, (err) => {
      this.showMessage(`Could not open launcher: ${err}`, messageType.error, 5000);
    });
  }

  /**
   * Function that shares the device ID using NFC
   */
  shareId(){
    this.errorMessage = null;
    this.successMessage = null;
    this.infoMessage = null;
    this.showMessage(`Hold the phone against the receiving phone.`, messageType.info, 0);
    console.log(this.device.uuid);
    this.nfcService.SendData(this.device.uuid, this.device.uuid)
    .then(() => {
      this.showMessage(`Shared Device ID.`, messageType.success, 5000);
    })
    .catch((err) => {
      this.showMessage(`Error: ${err} - Try turning on 'Android Beam'`, messageType.error, 0);
    })
    .finally(() => {
      this.infoMessage = null;
      this.nfcService.Finish();
    });
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

  /**
   * Function listens for an NFC Tag with the Visitor Package
   */
  addVisitorPackage(){
    this.errorMessage = null;
    this.successMessage = null;
    this.infoMessage = null;
    this.nfcService.IsEnabled()
    .then(() => {
      this.showMessage(`Hold the phone against the sharing device.`, messageType.info, 0);
      this.nfcService.ReceiveData().subscribe(data => {
        let payload = this.nfcService.BytesToString(data.tag.ndefMessage[0].payload);    
        this.nfcService.Finish();
        let json = JSON.parse(payload.slice(3));
        this.showMessage(`Received ${json.companyName} Visitor Package.`, messageType.success, 5000);
        let newPackage: VisitorPackage = this.packageService.createVisitorPackage(json.packageId, json.companyName, json.startDate, json.endDate, json.access,
          json.location, json.wifiSsid, json.wifiPassword, json.wifiType, json.spendingLimit, json.amountSpent);
        this.packageService.addVisitorPackage(newPackage)
        .then(() => {
          this.loadPackages();
        });
      });
    })
    .catch(() => {
      this.showMessage(`NFC seems to be off. Please try turing it on.`, messageType.error, 0);
    })
  }

  /**
   * Function removes a visitor package from the list
   * @param packageId number Id of visitor package to remove
   */
  removeVisitorPackage(packageId: number){
    this.packageService.removeVisitorPackage(packageId).then(() => {
      this.loadPackages();
    });
  }

  /**
   * Function attempts to connect to WiFi
   * @param ssid string network name
   * @param password string network password
   * @param type string algorithm type
   */
  connectToWiFi(ssid: string, password: string, type: string){
    this.wifiService.connectToWifi(ssid, password, type)
    .then(() => {
      this.showMessage('Connected to WiFi', messageType.success, 2000);
    })
    .catch(err => {
      this.showMessage(`Could not connect to WiFi: ${err}`, messageType.error, 5000);
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
    let minutes = date.getMinutes();
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
}
