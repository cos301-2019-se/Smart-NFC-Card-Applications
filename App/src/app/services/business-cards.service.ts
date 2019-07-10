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
  stub = {
    businessCardId: '0_0',
    companyName: 'Company Name',
    employeeName: 'Employee Name',
    contactNumber: '000 000 0000',
    email: 'email@gmail.com',
    website: 'http://website.co.za',
    location: new LocationModel(0,0,'Location')
  }

  /**
   * Function used to create a business card
   * @param businessCardId string CompanyId_EmployeeId
   * @param companyName string Company's name
   * @param employeeName string Employee's name
   * @param contactNumber string Employee's contact number
   * @param email string Employee's email address
   * @param website string Company's website
   * @param location string Employee's branch location
   * @return BusinessCard created
   */
  createBusinessCard(businessCardId: string, companyName: string, employeeName: string, contactNumber: string, email: string, website: string, location: LocationModel) {
    let businessCard: BusinessCard = new BusinessCard();
    businessCard.businessCardId = businessCardId;
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
   * @param businessCardId string CompanyId_EmployeeId
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
  setOwnBusinessCard({businessCardId, companyName, employeeTitle, employeeName, employeeSurname, employeeCellphone, employeeEmail, website, branchName, latitude, longitude}) {
    let employeeFullName = `${employeeTitle} ${employeeName} ${employeeSurname}`;
    let location = new LocationModel(latitude, longitude, branchName);
    let businessCard: BusinessCard = this.createBusinessCard(businessCardId, companyName, employeeFullName, employeeCellphone, employeeEmail, website, location);
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
   * @param businessCardId string CompanyId_EmployeeId
   * @param companyName string Company's name
   * @param employeeName string Employee's name
   * @param contactNumber string Employee's contact number
   * @param email string Employee's email address
   * @param website string Company's website
   * @param location string Employee's branch location
   * @retun Promise returns promise from saving to storage
   */
  addBusinessCard(businessCardId: string, companyName: string, employeeName: string, contactNumber: string, email: string, website: string, location: LocationModel) {
    return this.getBusinessCards().then((cards) => {
      let businessCard: BusinessCard = this.createBusinessCard(businessCardId, companyName, employeeName, contactNumber, email, website, location);
      let index = cards.findIndex(card => card.businessCardId == businessCardId);
      if (index > -1) {
        cards[index] = businessCard
      }
      else {
        cards.unshift(businessCard);
      }
      this.setBusinessCards(cards);
    });
  }

  /**
   * Function that returns the list of saved business cards
   * @retun Promise returns cards loaded from storage
   */
  getBusinessCards() {
    return this.storage.Load(this.cardListKey).then((cards) => {      
      cards.forEach(element => {
        element.location = new LocationModel(element.location.latitude, element.location.longitude, element.location.label)
      });
      return cards;
    });
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
   * @param cardId string id of card to remove
   * @retun Promise returns promise from removing business card
   */
  removeBusinessCard(cardId: string) {
    return this.getBusinessCards().then((cards) => {
      cards = cards.filter(elem => {
        return elem.businessCardId !== undefined && elem.businessCardId !== cardId;
      })
      this.setBusinessCards(cards);
    });
  }
}
