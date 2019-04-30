import { Component } from '@angular/core';
import { BusinessCardsService } from '../business-cards.service';
import { BusinessCard } from '../models/business-card.model';
import { NfcControllerService } from '../nfc-controller.service';

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
    // Gets the business cards
    this.loadCards(); 
  }

  /**
   * Triggers when the tab is left
   */
  ionViewWillLeave(){
    // Stops the NFC if the action wasn't completed
    this.nfcService.Finish();
    clearInterval(this.check);
  }

  /**
   * Loads the cards from the service or sets it to empty if it doesn't exist
   */
  loadCards(){
    // Get cards
    this.cardService.GetBusinessCards().then((val) => {      
      this.cards = val;
      // If it is null, set it as an empty array
      if (this.cards == null) {
        this.cards = []
        this.cardService.SetBusinessCards([]);
      }
      // Setup the toggle booleans
      this.setupToggles();
    });
  }

  /**
   * Reorders the lists and saves the order to the local storage
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
    this.cardService.SetBusinessCards(this.cards);
  }

  /**
   * Listens for an NFC Tag with the Bank Card
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
        this.cardService.AddBusinessCard(json.companyName, json.employeeName, json.contactNumber, json.email, json.location)
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
   * Removes a business card
   * @param companyName Company to remove
   */
  removeCard(companyName){
    this.cardService.RemoveBusinessCard(companyName).then(() => {
      this.loadCards();
    });
  }

  /**
   * Sets the array to check which cards where toggled
   */
  setupToggles(){
    this.detailToggles = [];
    this.cards.forEach(card => {
      this.detailToggles[card.companyName] = false;
    });
  }

  /**
   * Toggles the business card detail of a company
   * @param companyName Company to toggle
   */
  toggleDetails(companyName){
    this.detailToggles[companyName] = !this.detailToggles[companyName];
  }

  /**
   * Waits for NFC to become enabled and retries adding
   */
  Retry(){
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
