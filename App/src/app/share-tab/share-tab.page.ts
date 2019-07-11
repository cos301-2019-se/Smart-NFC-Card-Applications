/**
*	File Name:	    share-tab.page.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      ShareTabPage
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/05/19	Wian		  1.0		    Original
*	2019/06/25	Wian		  1.1		    Added changes to allow navigation on tap of location
*
*	Functional Description:   This file provides the component that allows sharing of cards
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { Component, OnInit } from '@angular/core';
import { BusinessCardsService } from '../services/business-cards.service';
import { BusinessCard } from '../models/business-card.model';
import { NfcControllerService } from '../services/nfc-controller.service';
import { LocationService } from '../services/location.service';
import { LocationModel } from '../models/location.model';
import { EventEmitterService } from '../services/event-emitter.service';   
import { MessageType } from '../tabs/tabs.page';

/**
* Purpose:	This class provides the component that allows sharing of cards
*	Usage:		This class can be used to share the saved business card to other using NFC
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Component({
  selector: 'app-share-tab',
  templateUrl: 'share-tab.page.html',
  styleUrls: ['share-tab.page.scss']
})
export class ShareTabPage implements OnInit{

  card: BusinessCard;
  check;


  /**
   * Constructor that takes all injectables
   * @param cardService BusinessCardsService injectable
   * @param nfcService NfcControllerService injectable
   * @param locationService LocationService injectable
   */
  constructor(
    private cardService: BusinessCardsService,
    private nfcService: NfcControllerService,
    private locationService: LocationService,
    private eventEmitterService: EventEmitterService   
  ) { }

  ngOnInit() {    
    this.eventEmitterService.menuSubscribe(
      this.eventEmitterService.invokeMenuButtonEvent.subscribe(functionName => {    
          this.menuEvent(functionName);
        })
    );  
  }

  /**
   * Function that triggers when the tab is navigated to
   */
  ionViewDidEnter() {
    this.showMessage('', MessageType.reset);
    // Gets and sets the business card
    this.cardService.getOwnBusinessCard().then((val) => {
      this.card = val;
    });
  }

  /**
   * Function that triggers when the tab is left
   */
  ionViewWillLeave(){
    // Stops the NFC if the action wasn't completed
    this.nfcService.Finish();
    clearInterval(this.check);
  }

  menuEvent(functionName: string) {
    switch(functionName) {
      case 'Share': this.shareCard()
        break;
    }
  }

  /**
   * Function that shares the current set business card
   */
  shareCard(){
    this.showMessage('', MessageType.reset);
    this.cardService.getOwnBusinessCard().then((val) => {
      this.card = val;
    });
    // Displays info to the user
    this.showMessage(`Hold the phone against the receiving phone.`, MessageType.info);
    // Uses NFC Service to send business card
    this.nfcService.SendData(this.card.businessCardId, JSON.stringify(this.card))
    .then(() => {
      // If it was successfull, display a success message to the user for 5s
      this.showMessage(`Shared ${this.card.companyName} Business Card`, MessageType.success, 5000);
    })
    .catch((err) => {
      // If it was unsuccessfull, display an error message to the user
      this.showMessage(`Error: ${err} - Try turning on 'Android Beam'`, MessageType.error, 5000);
    })
    .finally(() => {
      // Whether it failed or succeeded, turn of the sharing
      this.nfcService.Finish();
    });
  }

  /**
   * Function that waits for NFC to become enabled and retries sharing
   */
  retry(){
    // Show NFC settings to the user
    this.nfcService.ShowSettings();
    this.check = setInterval(() => {
      this.nfcService.IsEnabled().then(() => {
        // If NFC got enabled, remove the check and try to share the card again
        clearInterval(this.check);
        this.shareCard();
      })
    }, 1500);
  }

  /**
   * Function that opens the navigator with directions from current position to destination
   * @param destination where to go to
   */
  navigate(destination){
    this.showMessage(`Please wait while navigator is launched`, MessageType.info, 5000);
    let dest = new LocationModel(destination.latitude, destination.longitude, destination.label);  
    this.locationService.navigate(dest, () => {
      this.showMessage(`Navigator launching`, MessageType.success, 5000);
    }, (err) => {
      this.showMessage(`Could not open launcher: ${err}`, MessageType.error, 5000);
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
}
