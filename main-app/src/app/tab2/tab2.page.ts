import { Component, OnInit } from '@angular/core';
import { BusinessCardsService } from '../business-cards.service';
import { BusinessCard } from '../models/business-card.model';
import { NfcControllerService } from '../nfc-controller.service';

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

  constructor(
    private cardService: BusinessCardsService,
    private nfcService: NfcControllerService
  ) { }

  /**
   * Triggers when the tab is navigated to
   */
  ionViewDidEnter() {
    //Initialize message values 
    this.error_message = null;
    this.success_message = null;
    this.info_message = null;
    // Gets and sets the business card
    this.cardService.GetOwnBusinessCard().then((val) => {
      this.card = val;
    });
  }

  /**
   * Triggers when the tab is left
   */
  ionViewWillLeave(){
    // Stops the NFC if the action wasn't completed
    this.nfcService.Finish();
  }

  /**
   * Share the current set business card
   */
  ShareCard(){
    // Resets some values
    this.error_message = null;
    this.success_message = null;
    this.info_message = null;
    this.cardService.GetOwnBusinessCard().then((val) => {
      this.card = val;
    });
    // Displays info to the user
    this.info_message = `Hold the phone against the receiving phone.`;
    // Uses NFC Service to send business card
    this.nfcService.SendData(this.card.companyName, JSON.stringify(this.card))
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
   * Waits for NFC to become enabled and retries sharing
   */
  Retry(){
    // Show NFC settings to the user
    this.nfcService.ShowSettings();
    let check = setInterval(() => {
      this.nfcService.IsEnabled().then(() => {
        // If NFC got enabled, remove the check and try to share the card again
        clearInterval(check);
        this.ShareCard();
      })
    }, 1500);
  }
}
