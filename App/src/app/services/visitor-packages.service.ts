/**
*	File Name:	    visitor-packages.service.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      VisitorPackagesService
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/06/28	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the visitor packages service to other components
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { VisitorPackage } from '../models/visitor-package.model';
import { LocationModel } from '../models/location.model';

/**
* Purpose:	This class provides the visitor packages service injectable
*	Usage:		This class can be used to setting and getting visitor packages
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Injectable({
  providedIn: 'root'
})
export class VisitorPackagesService {

  constructor(
    private storage: LocalStorageService
  ) { }

  packageListKey: string = "visitor-packages";
  stub = {
    packageId: 0,
    companyName: 'Company Name',
    startDate: new Date(),
    endDate: new Date(),
    access: 'Lobby',
    location: new LocationModel(0,0,'Location'),
    wifiSsid: 'wifiSsid',
    wifiPassword: 'wifiPassword',
    wifiType: 'wifiType',
    spendingLimit: 100,
    amountSpent: 0
  }

  /**
   * Function used to create a visitor package
   * @param packageId number Visitor Package's Id
   * @param companyName string Name of the compnay being visited
   * @param startDate Date when package starts taking effect
   * @param endDate Date when package expires
   * @param access string Name of rooms given access toe
   * @param location LocationModel GPS location of the place
   * @param wifiSsid string Name of WiFi network
   * @param wifiPassword string Password of WiFi network
   * @param wifiType string Algorithm type of WiFi network
   * @param spendingLimit number max amount to spend
   * @param amountSpent number amount already spent
   * @return VisitorPackage created
   */
  createVisitorPackage(packageId: number, companyName: string, startDate: Date, endDate: Date, access: string, location: LocationModel, wifiSsid: string, wifiPassword: string, wifiType: string, spendingLimit: number, amountSpent: number) {
    let visitorPackage: VisitorPackage = new VisitorPackage();
    visitorPackage.packageId = packageId;
    visitorPackage.companyName = companyName;
    visitorPackage.startDate = startDate;
    visitorPackage.endDate = endDate;
    visitorPackage.access = access;
    visitorPackage.location = location;
    visitorPackage.wifiSsid = wifiSsid;
    visitorPackage.wifiPassword = wifiPassword;
    visitorPackage.wifiType = wifiType;
    visitorPackage.spendingLimit = spendingLimit;
    visitorPackage.amountSpent = amountSpent;
    return visitorPackage;
  }

  /**
   * Function that adds a visitor package to the list of saved packages
   * @param visitorPackage VisitorPackage to be added
   */
  addVisitorPackage(visitorPackage: VisitorPackage) {
    return this.getVisitorPackages().then((packages) => {
      packages.unshift(visitorPackage);
      this.setVisitorPackages(packages);
    });
  }

  /**
   * Function that returns the list of saved visitor packages
   * @retun Promise<any> returns promise from loading from storage
   */
  getVisitorPackages() {
    return this.storage.Load(this.packageListKey).then((packages) => {      
      packages.forEach(element => {
        element.location = new LocationModel(element.location.latitude, element.location.longitude, element.location.label)
      });
      return packages;
    });
  }

  /**
   * Function that sets all the visitor packages at once - used for reordering
   * @param packages VisitorPackage[] cards to save to storage
   * @retun Promise<any> returns promise from saving to storage
   */
  setVisitorPackages(packages: VisitorPackage[]) {
    return this.storage.Save(this.packageListKey, packages);
  }

  /**
   * Function that removes a visitor package by id
   * @param packageId number id of package to remove
   * @retun Promise returns promise from removing visitor package
   */
  removeVisitorPackage(packageId: number) {
    return this.getVisitorPackages().then((packages) => {
      packages = packages.filter(elem => {
        return elem.packageId !== packageId;
      })
      this.setVisitorPackages(packages);
    });
  }
}
