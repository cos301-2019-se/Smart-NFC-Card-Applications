/**
*	File Name:	    card-tab.page.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      CardTabPage
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
import { Component, OnInit } from '@angular/core';
import { BusinessCardsService } from '../services/business-cards.service';
import { BusinessCard } from '../models/business-card.model';
import { NfcControllerService } from '../services/nfc-controller.service';
import { LocationService } from '../services/location.service';
import { LocationModel } from '../models/location.model';
import { EventEmitterService } from '../services/event-emitter.service';   
import { FilterService } from '../services/filter.service';  
import { MessageType } from '../tabs/tabs.page';
import { AlertController } from '@ionic/angular';
import { QrCodeService } from '../services/qr-code.service';

/**
* Purpose:	This class provides the component that allows viewing of shared cards as well as adding new ones
*	Usage:		This component can be used to view and add business cards to a locally stored list
*	@author:	Wian du Plooy
*	@version:	1.2
*/
@Component({
  selector: 'app-card-tab',
  templateUrl: 'card-tab.page.html',
  styleUrls: ['card-tab.page.scss']
})
export class CardTabPage implements OnInit{
  cards: BusinessCard[] = [];
  hasCards: Boolean = true;
  detailToggles = [];
  check;
  scannedData: {};

  /**
   * Constructor that takes all injectables
   * @param cardService BusinessCardsService injectable
   * @param nfcService NfcControllerService injectable
   * @param locationService LocationService injectable
   * @param eventEmitterService EventEmitterService injectable
   * @param filterService FilterService injectable
   * @param alertController AlertController injectable
   */
  constructor(
    private cardService: BusinessCardsService,
    private nfcService: NfcControllerService,
    private locationService: LocationService,
    private eventEmitterService: EventEmitterService,
    public filterService: FilterService,
    private alertController: AlertController,
    private qrCodeService: QrCodeService
  ) {  }

  ngOnInit() {   
    this.eventEmitterService.menuSubscribe(
      this.eventEmitterService.invokeMenuButtonEvent.subscribe(functionName => {    
          this.menuEvent(functionName);
        })
    );  
  }

  /**
   * Function triggers when the tab is navigated to
   */
  ionViewDidEnter() { 
    this.showMessage('', MessageType.reset);
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

  menuEvent(functionName: string) {
    switch(functionName) {
      case 'Add Business Card': this.addCard()
        break;
      case 'Scan QR Code': this.scanQrCode()
        break;
      case 'Refresh All Cards': this.showMessage('Refresh feature coming soon.', MessageType.error);
        break;
    }
  }

  /**
   * Function that loads the cards from the service or sets it to empty if it doesn't exist
   */
  loadCards(){
    this.hasCards = true;
    // Get cards
    this.cardService.getBusinessCards().then((val) => {    
      this.cards = val;
      if (this.cards.length < 1) {
        this.hasCards = false;
      } 
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
    this.showMessage('', MessageType.reset);
    // Check if nfc is enabled
    this.nfcService.IsEnabled()
    .then(() => {
      // Continue if it is enabled
      this.showMessage(`Hold the phone against the sharing device.`, MessageType.info, 0);
      this.nfcService.ReceiveData().subscribe(data => {
        // read data from the payload
        let payload = this.nfcService.BytesToString(data.tag.ndefMessage[0].payload);
        // Stop the listener for receiving other tags        
        this.nfcService.Finish();
        // through away the language modifier and parse it to json
        let json = JSON.parse(payload.slice(3));
        this.showMessage(`Received ${json.companyName} Business Card.`, MessageType.success, 5000);
        // Add the card to the local storage
        this.cardService.addBusinessCard(json.businessCardId, json.companyName, json.employeeName, json.contactNumber, json.email, json.website, json.location)
        .then(() => {
          this.loadCards();
        })
        .catch(err => {
          this.showMessage(`Could not add business card: ${err}`, MessageType.error);
        });
      });
    })
    .catch(() => {
      // If it is disabled, display error to user.
      this.showMessage(`NFC seems to be off. Please try turing it on.`, MessageType.error, 0);
    })
  }

  /**
   * Function removes a business card from the list
   * @param cardId string Id of business card to remove
   */
  async removeCard(cardId: string){
    let card: BusinessCard = this.cards.find(card => card.businessCardId == cardId);
    const alert = await this.alertController.create({
      header: 'Delete Business Card',
      message: `Are you sure you want to <strong>delete ${card.employeeName}</strong>'s business card?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Delete',
          handler: () => {
            this.cardService.removeBusinessCard(cardId)
            .then(() => {
              this.loadCards();
              this.showMessage(`Deleted ${card.employeeName}'s business card`, MessageType.success);
            })
            .catch(err => {
              this.showMessage(`Couldn't delete: ${err}`, MessageType.error);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Function refreshes a business card from db
   * @param cardId string Id of business card to refresh
   */
  refreshCard(cardId: string){
    this.showMessage('Refresh feature coming soon.', MessageType.error);
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
   * @param businessCardId number Id of business card to toggle
   */
  toggleDetails(businessCardId: number){
    this.detailToggles[businessCardId] = !this.detailToggles[businessCardId];
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
    this.showMessage('', MessageType.reset);
    let dest = new LocationModel(destination.latitude, destination.longitude, destination.label);    
    this.showMessage(`Please wait while navigator is launched.`, MessageType.info, 5000);
    this.locationService.navigate(dest)
    .then(() => {
      this.showMessage(`Navigator launching.`, MessageType.success, 5000);
    })
    .catch( (err) => {
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

  scanQrCode(){
    this.qrCodeService.scanCode().subscribe(res => {
      this.scannedData = res['message'];
      let data = this.scannedData["text"];
      let json = JSON.parse(data);
      this.cardService.addBusinessCard(json.businessCardId, json.companyName, json.employeeName, json.contactNumber, json.email, json.website, json.location)
      .then(() => {
        this.loadCards();
      })
      .catch(err => {
        this.showMessage(`Could not add business card: ${err}`, MessageType.error);
      });
    });
  }
}
