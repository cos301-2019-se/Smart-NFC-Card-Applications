/**
*	File Name:	    tab2.page.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      Tab2Page
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

/**
* Purpose:	This class provides the component that allows sharing of cards
*	Usage:		This class can be used to share the saved business card to other using NFC
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  card: BusinessCard;
  error_message: string;
  success_message: string;
  info_message: string;
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
    private locationService: LocationService
  ) { }

  /**
   * Function that triggers when the tab is navigated to
   */
  ionViewDidEnter() {
    //Initialize message values 
    this.error_message = null;
    this.success_message = null;
    this.info_message = null;
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

  /**
   * Function that shares the current set business card
   */
  shareCard(){
    // Resets some values
    this.error_message = null;
    this.success_message = null;
    this.info_message = null;
    this.cardService.getOwnBusinessCard().then((val) => {
      this.card = val;
    });
    // Displays info to the user
    this.info_message = `Hold the phone against the receiving phone.`;
    // Uses NFC Service to send business card
    this.nfcService.SendData(this.card.businessCardId, JSON.stringify(this.card))
    .then(() => {
      // If it was successfull, display a success message to the user for 5s
      this.success_message = `Shared ${this.card.companyName} Business Card`;
      setTimeout(() => {this.success_message = null;}, 5000);
    })
    .catch((err) => {
      // If it was unsuccessfull, display an error message to the user
      this.error_message = `Error: ${err} - Try turning on 'Android Beam'`;
    })
    .finally(() => {
      this.info_message = null;
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
    this.error_message = null;
    this.success_message = null;
    this.info_message = "Please wait while navigator is launched";
    let dest = new LocationModel(destination.latitude, destination.longitude, destination.label);    
    setTimeout(() => {this.info_message = null;}, 5000);
    this.locationService.navigate(dest, () => {
      this.info_message = null;
      this.error_message = null;
      this.success_message = "Navigator launching";
      setTimeout(() => {this.success_message = null;}, 5000);
    }, (err) => {
      this.info_message = null;
      this.success_message = null;
      this.error_message = `Could not open launcher: ${err}`;
      setTimeout(() => {this.error_message = null;}, 5000);
    });
  }
}
