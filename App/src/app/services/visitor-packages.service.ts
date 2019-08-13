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
*	2019/08/13	Wian		  1.1		    Added refreshing functions
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
import { RequestModuleService } from './request-module.service';
import { Subject } from 'rxjs';

/**
* Purpose:	This class provides the visitor packages service injectable
*	Usage:		This class can be used to setting and getting visitor packages
*	@author:	Wian du Plooy
*	@version:	1.1
*/
@Injectable({
  providedIn: 'root'
})
export class VisitorPackagesService {

  /**
   * Constructor for the service
   * @param storage LocalStorageService injectable
   * @param req RequestModuleService injectable
   */
  constructor(
    private storage: LocalStorageService,
    private req: RequestModuleService
  ) { }

  packageListKey: string = "visitor-packages";
  sharedListKey: string = "shared-visitor-packages";

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
   * Function that adds a visitor package to the list of shared packages
   * @param visitorPackage VisitorPackage to be added
   */
  addSharedVisitorPackage(visitorPackage: VisitorPackage) {
    return this.getSharedVisitorPackages().then((packages) => {
      let index = packages.findIndex(item => item.packageId == visitorPackage.packageId);
      if (index > -1) {
        packages[index] = visitorPackage
      }
      else {
        packages.unshift(visitorPackage);
      }
      this.setSharedVisitorPackages(packages);
    });
  }

  /**
   * Function that returns the list of shared visitor packages
   * @return Promise<any> returns promise from loading from storage
   */
  getSharedVisitorPackages() {
    return this.storage.Load(this.sharedListKey).then((packages) => {  
      if (!packages) return [];    
      packages.forEach(element => {
        element.location = new LocationModel(element.location.latitude, element.location.longitude, element.location.label)
      });
      return packages;
    });
  }

  /**
   * Function that sets all the shared visitor packages at once - used for reordering
   * @param packages VisitorPackage[] cards to save to storage
   * @return Promise<any> returns promise from saving to storage
   */
  setSharedVisitorPackages(packages: VisitorPackage[]) {
    return this.storage.Save(this.sharedListKey, packages);
  }

  /**
   * Function that removes a shared visitor package by id
   * @param packageId number id of package to remove
   * @return Promise returns promise from removing visitor package
   */
  removeSharedVisitorPackage(packageId: number) {
    return this.getSharedVisitorPackages().then((packages) => {
      packages = packages.filter(elem => {
        return elem.packageId !== packageId;
      })
      this.setSharedVisitorPackages(packages);
    });
  }

  /**
   * Function that removes all the shared visitor packages
   * @param employeeId number id of the employee's packages to load
   * @return Observable<Object> { success: boolean, message: string}
   */
  loadAllSharedPackages(employeeId: number) {
    let subject = new Subject<Object>();
    setTimeout(() => {
      this.req.getAllEmployeeVisitorPackage(employeeId).subscribe(res => {
        console.log(res);
        if (res['success'] === true) {
          let data = res['data'];
          data.forEach(obj => {
            let visitorPackageId: number = obj['visitorPackageId'];
            let companyName: string = obj['companyName'];
            let latitude: number = obj['latitude'];
            let longitude: number = obj['longitude'];
            let branchName: string = obj['branchName'];
            let ssid: string = obj['ssid'];
            let networkType: string = obj['networkType'];
            let password: string = obj['password'];
            let roomName: string = obj['roomName'];
            let startTime: Date = obj['startTime'];
            let endTime: Date = obj['endTime'];
            let limit: number = obj['limit'];
            let spent: number = obj['spent'];
    
            if (visitorPackageId == undefined || companyName == undefined || latitude == undefined || longitude == undefined || branchName == undefined ||
              ssid == undefined || networkType == undefined || password == undefined || roomName == undefined || startTime == undefined ||
              endTime == undefined || limit == undefined || spent == undefined) {
                subject.next({success: false, message: `Not all needed data received.`});
                subject.complete();
                this.req.dismissLoading();
                return;
            }
            else {
              let visitorPackage = this.createVisitorPackage(visitorPackageId, companyName, startTime, endTime, roomName, 
                new LocationModel(latitude, longitude, branchName), ssid, password, networkType, limit, spent);
              this.addSharedVisitorPackage(visitorPackage);
            }
          });
          this.req.dismissLoading();
        }
        else {
          subject.next({success: false, message: `Something went wrong: ${res['message']}.`});
          subject.complete();
          this.req.dismissLoading();
        }
      }, err => {
        console.log(err);
        subject.next({success: false, message: `Something went wrong.`});
        subject.complete();
        this.req.dismissLoading();
      });
    }, 50);
    return subject.asObservable();
  }

  /**
   * Function that removes all the shared visitor packages
   * @return Promise returns promise from removing all visitor packages
   */
  removeAllSharedPackages() {
    return this.setVisitorPackages([]);
  }
  
  /**
   * Function that adds a visitor package to the list of saved packages
   * @param visitorPackage VisitorPackage to be added
   */
  addVisitorPackage(visitorPackage: VisitorPackage) {
    return this.getVisitorPackages().then((packages) => {
      let index = packages.findIndex(item => item.packageId == visitorPackage.packageId);
      if (index > -1) {
        packages[index] = visitorPackage
      }
      else {
        packages.unshift(visitorPackage);
      }
      this.setVisitorPackages(packages);
    });
  }

  /**
   * Function that returns the list of saved visitor packages
   * @return Promise<any> returns promise from loading from storage
   */
  getVisitorPackages() {
    return this.storage.Load(this.packageListKey).then((packages) => {    
      if (!packages) return [];      
      packages.forEach(element => {
        element.location = new LocationModel(element.location.latitude, element.location.longitude, element.location.label)
      });
      return packages;
    });
  }

  /**
   * Function that gets a visitor package from the DB and adds it back into the list
   * @param packageId number package to refresh
   * @return Observable<Object> { success: boolean, message: string}
   */
  refreshVisitorPackage(packageId: number) {
    let subject = new Subject<Object>();
    setTimeout(() => {
      this.req.getVisitorPackage(packageId).subscribe(res => {
        if (res['success'] === true) {
          let data = res['data'];
          let visitorPackageId: number = data['visitorPackageId'];
          let companyName: string = data['companyName'];
          let latitude: number = data['latitude'];
          let longitude: number = data['longitude'];
          let branchName: string = data['branchName'];
          let ssid: string = data['ssid'];
          let networkType: string = data['networkType'];
          let password: string = data['password'];
          let roomName: string = data['roomName'];
          let startTime: Date = data['startTime'];
          let endTime: Date = data['endTime'];
          let limit: number = data['limit'];
          let spent: number = data['spent'];
  
          if (visitorPackageId == undefined || companyName == undefined || latitude == undefined || longitude == undefined || branchName == undefined ||
            ssid == undefined || networkType == undefined || password == undefined || roomName == undefined || startTime == undefined ||
            endTime == undefined || limit == undefined || spent == undefined) {
              subject.next({success: false, message: `Not all needed data received.`});
              subject.complete();
              this.req.dismissLoading();
          }
          else {
            let visitorPackage = this.createVisitorPackage(visitorPackageId, companyName, startTime, endTime, roomName, 
              new LocationModel(latitude, longitude, branchName), ssid, password, networkType, limit, spent);
            this.addVisitorPackage(visitorPackage).then(() => {
              subject.next({success: true, message: `Package refreshed.`});
              subject.complete();
              this.req.dismissLoading();
            })
            .catch(() => {
              subject.next({success: false, message: `Could not save the updated package.`});
              subject.complete();
              this.req.dismissLoading();
            });
          }
        }
        else {
          subject.next({success: false, message: `Something went wrong: ${res['message']}.`});
          subject.complete();
          this.req.dismissLoading();
        }
      });
    }, 50);
    return subject.asObservable();
  }

  /**
   * Function that sets all the visitor packages at once - used for reordering
   * @param packages VisitorPackage[] cards to save to storage
   * @return Promise<any> returns promise from saving to storage
   */
  setVisitorPackages(packages: VisitorPackage[]) {
    return this.storage.Save(this.packageListKey, packages);
  }

  /**
   * Function that removes a visitor package by id
   * @param packageId number id of package to remove
   * @return Promise returns promise from removing visitor package
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
