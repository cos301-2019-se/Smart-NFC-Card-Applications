import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { BusinessCard } from './models/business-card.model';

@Injectable({
  providedIn: 'root'
})
export class BusinessCardsService {

  constructor(private storage: LocalStorageService) { }

  ownBusinessCardKey: string = "own-business-card";
  CardListKey: string = "business-cards";

  // sets own business card
  SetOwnBusinessCard(companyName: string, employeeName: string, contactNumber: string, email: string, location: string){

    let businessCard: BusinessCard = new BusinessCard();
    businessCard.companyName = companyName;
    businessCard.employeeName = employeeName;
    businessCard.contactNumber = contactNumber;
    businessCard.email = email;
    businessCard.location = location;

    return this.storage.Save(this.ownBusinessCardKey, businessCard);
  }

  // returns own business card
  GetOwnBusinessCard(){
    return this.storage.Load(this.ownBusinessCardKey);
  }

  // adds a business card to the list
  AddBusinessCard(companyName: string, employeeName: string, contactNumber: string, email: string, location: string){
    let businessCard: BusinessCard = new BusinessCard();
    businessCard.companyName = companyName;
    businessCard.employeeName = employeeName;
    businessCard.contactNumber = contactNumber;
    businessCard.email = email;
    businessCard.location = location;

    return this.GetBusinessCards().then((cards) => {
      cards.unshift(businessCard);
      this.SetBusinessCards(cards);
    });
  }

  // returns the list of business cards
  GetBusinessCards(){
    return this.storage.Load(this.CardListKey);
  }

  // sets all the business cards at once - used for reordering
  SetBusinessCards(cards: BusinessCard[]){
    return this.storage.Save(this.CardListKey, cards);
  }

  // removes a business card from the list
  // TODO: actually remove the card
  RemoveBusinessCard(companyName: string){
    return this.GetBusinessCards().then((cards) => {
      cards = cards.filter(elem => {
        return elem.companyName !== companyName;
      })
      this.SetBusinessCards(cards);
    });
  }
}
