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

/**
* Purpose:	This class provides the component that allows viewing of shared cards as well as adding new ones
*	Usage:		This component can be used to view and add business cards to a locally stored list
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  cards: BusinessCard[] = [];
  detailToggles = [];
  error_message: string;
  success_message: string;
  info_message: string;
  check;

  /**
   * Constructor that takes all injectables
   * @param cardService BusinessCardsService injectable
   * @param nfcService NfcControllerService injectable
   */
  constructor(
    private cardService: BusinessCardsService,
    private nfcService: NfcControllerService
  ) { }

  /**
   * Function triggers when the tab is navigated to
   */
  ionViewDidEnter() {
    //Initialize message values 
    this.error_message = null;
    this.success_message = null;
    this.info_message = null;
    // Gets the business cards
    this.loadCards(); 
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
    this.error_message = null;
    this.success_message = null;
    this.info_message = null;

    // Check if nfc is enabled
    this.nfcService.IsEnabled()
    .then(() => {
      // Continue if it is enabled
      this.info_message = `Hold the phone against the sharing device.`;
      this.nfcService.ReceiveData().subscribe(data => {
        // read data from the payload
        let payload = this.nfcService.BytesToString(data.tag.ndefMessage[0].payload);
        // Stop the listener for receiving other tags        
        this.nfcService.Finish();
        // through away the language modifier and parse it to json
        let json = JSON.parse(payload.slice(3));
        this.success_message = `Received ${json.companyName} Business Card`;
        setTimeout(() => {this.success_message = null;}, 5000);
        this.info_message = null;
        // Add the card to the local storage
        this.cardService.addBusinessCard(json.companyId, json.companyName, json.employeeName, json.contactNumber, json.email, json.website, json.location)
        .then(() => {
          this.loadCards();
        });
      });
    })
    .catch(() => {
      // If it is disabled, display error to user.
      this.error_message = `NFC seems to be off. Please try turing it on.`;
    })
  }

  /**
   * Function removes a business card from the list
   * @param companyId number Id of business card to remove
   */
  removeCard(companyId: number){
    this.cardService.removeBusinessCard(companyId).then(() => {
      this.loadCards();
    });
  }

  /**
   * Sets the array to check which cards where toggled
   */
  setupToggles(){
    this.detailToggles = [];
    this.cards.forEach(card => {
      this.detailToggles[card.companyId] = false;
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

}
