import { Component } from '@angular/core';
import { BusinessCardsService } from '../business-cards.service';
import { BusinessCard } from '../models/business-card.model';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  cards: BusinessCard[] = [];
  detailToggles = [];
  i = 0;

  constructor(
    private cardService: BusinessCardsService
  ) { this.loadCards(); }

  loadCards(){
    this.cardService.GetBusinessCards().then((val) => {      
      this.cards = val;
      this.setupToggles();
    });
  }

  reorderItems(ev) {
    const itemMove = this.cards.splice(ev.detail.from, 1)[0];
    const toggleMove = this.detailToggles.splice(ev.detail.from, 1)[0];
    this.cards.splice(ev.detail.to, 0, itemMove);
    this.detailToggles.splice(ev.detail.to, 0, toggleMove);
    ev.detail.complete();
    this.cardService.SetBusinessCards(this.cards);
  }

  addCard(){
    this.cardService.AddBusinessCard(`Company ${(this.i++).toString()}`,'Employee Name','Contact Number','Email','Location')
    .then(() => {
      this.loadCards();
    });
  }

  removeCard(companyName){
    this.cardService.RemoveBusinessCard(companyName).then(() => {
      this.loadCards();
    });
  }

  setupToggles(){
    this.detailToggles = [];
    this.cards.forEach(card => {
      this.detailToggles[card.companyName] = false;
    });
  }

  toggleDetails(companyName){
    this.detailToggles[companyName] = !this.detailToggles[companyName];
  }

}
