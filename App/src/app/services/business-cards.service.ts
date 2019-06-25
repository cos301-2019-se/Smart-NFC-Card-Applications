/**
*	File Name:	    business-cards.service.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      BusinessCardsService
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/05/19	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the business card service to other components
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { BusinessCard } from '../models/business-card.model';
import { LocationModel } from '../models/location.model';

/**
* Purpose:	This class provides the business card service injectable
*	Usage:		This class can be used to setting and getting business cards
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Injectable({
  providedIn: 'root'
})
export class BusinessCardsService {

  constructor(
    private storage: LocalStorageService
  ) { }

  ownBusinessCardKey: string = "own-business-card";
  cardListKey: string = "business-cards";

  /**
   * Function used to create a business card
   * @param companyId number Company's id
   * @param companyName string Company's name
   * @param employeeName string Employee's name
   * @param contactNumber string Employee's contact number
   * @param email string Employee's email address
   * @param website string Company's website
   * @param location string Employee's branch location
   * @return BusinessCard created
   */
  private createBusinessCard(companyId: number, companyName: string, employeeName: string, contactNumber: string, email: string, website: string, location: LocationModel) {
    let businessCard: BusinessCard = new BusinessCard();
    businessCard.companyId = companyId;
    businessCard.companyName = companyName;
    businessCard.employeeName = employeeName;
    businessCard.contactNumber = contactNumber;
    businessCard.email = email;
    businessCard.location = location;
    businessCard.website = website;
    return businessCard;
  }

  /**
   * Function to set the stored business card
   * @param companyId number Company's id
   * @param companyName string Company's name
   * @param employeeTitle string Employee's title
   * @param employeeName string Employee's name
   * @param employeeSurname string Employee's surname
   * @param contactNumber string Employee's contact number
   * @param email string Employee's email address
   * @param website string Company's website
   * @param branchName string Employee's branch name
   * @param latitude string Employee's branch latitude
   * @param longitude string Employee's branch longitude
   * @retun Promise returns promise from saving to storage
   */
  setOwnBusinessCard({companyId, companyName, employeeTitle, employeeName, employeeSurname, employeeCellphone, employeeEmail, website, branchName, latitude, longitude}) {
    let employeeFullName = `${employeeTitle} ${employeeName} ${employeeSurname}`;
    let location = new LocationModel(latitude, longitude, branchName);
    let businessCard: BusinessCard = this.createBusinessCard(companyId, companyName, employeeFullName, employeeCellphone, employeeEmail, website, location);
    return this.storage.Save(this.ownBusinessCardKey, businessCard);
  }

  /**
   * Returns own, saved business card
   */
  getOwnBusinessCard() {
    return this.storage.Load(this.ownBusinessCardKey);
  }

  /**
   * Function that adds a business card to the list of stored business cards
   * @param companyId number Company's id
   * @param companyName string Company's name
   * @param employeeName string Employee's name
   * @param contactNumber string Employee's contact number
   * @param email string Employee's email address
   * @param website string Company's website
   * @param location string Employee's branch location
   * @retun Promise returns promise from saving to storage
   */
  addBusinessCard(companyId: number, companyName: string, employeeName: string, contactNumber: string, email: string, website: string, location: LocationModel) {
    let businessCard: BusinessCard = this.createBusinessCard(companyId, companyName, employeeName, contactNumber, email, website, location);
    return this.getBusinessCards().then((cards) => {
      cards.unshift(businessCard);
      this.setBusinessCards(cards);
    });
  }

  /**
   * Function that returns the list of saved business cards
   * @retun Promise returns promise from loading from storage
   */
  getBusinessCards() {
    return this.storage.Load(this.cardListKey);
  }

  /**
   * Function that sets all the business cards at once - used for reordering
   * @param cards BusinessCard[] cards to save to storage
   * @retun Promise returns promise from saving to storage
   */
  setBusinessCards(cards: BusinessCard[]) {
    return this.storage.Save(this.cardListKey, cards);
  }

  /**
   * Function that removes a business card by id
   * @param companyId number id of card to remove
   * @retun Promise returns promise from removing business card
   */
  removeBusinessCard(companyId: number) {
    return this.getBusinessCards().then((cards) => {
      cards = cards.filter(elem => {
        return elem.companyId !== companyId;
      })
      this.setBusinessCards(cards);
    });
  }
}
