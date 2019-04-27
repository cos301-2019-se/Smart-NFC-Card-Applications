import { Component, OnInit } from '@angular/core';
import { BusinessCard } from '../models/business-card.model';
import { BusinessCardsService } from '../business-cards.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  success: string;
  cname: string;
  ename: string;
  cell: string;
  email: string;
  loc: string;

  constructor(
    private cardService: BusinessCardsService
  ) { }

  ngOnInit() {
    this.success = null;
  }

  ionViewDidEnter() {
    this.success = null;
    this.cardService.GetOwnBusinessCard().then((card) => {
      this.cname = card.companyName;
      this.ename = card.employeeName;
      this.cell = card.contactNumber;
      this.email = card.email;
      this.loc = card.location;
    });
  }

  SetCard() {
    this.cardService.SetOwnBusinessCard(this.cname, this.ename, this.cell, this.email, this.loc);
    this.success = `${this.cname} business card set.`;    
  }

}
