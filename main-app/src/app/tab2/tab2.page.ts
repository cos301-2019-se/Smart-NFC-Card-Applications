import { Component, OnInit } from '@angular/core';
import { BusinessCardsService } from '../business-cards.service';
import { BusinessCard } from '../models/business-card.model';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  card: BusinessCard;

  constructor(
    private cardService: BusinessCardsService
  ) { }

  ionViewDidEnter() {
    this.cardService.GetOwnBusinessCard().then((val) => {
      this.card = val;
    });
  }
}
