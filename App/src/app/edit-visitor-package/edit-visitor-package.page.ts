/**
*	File Name:	    edit-visitor-package.page.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      EditVisitorPackagePage
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/07/11	Wian		  1.0		    Original
*
*	Functional Description:   This file provides the modal to edit visitor packages
*	Error Messages:   “Error”
*	Assumptions:  None
*	Constraints: 	None
*/

import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { RequestModuleService } from '../services/request-module.service';
import { NfcControllerService } from '../services/nfc-controller.service';
import { VisitorPackagesService } from '../services/visitor-packages.service';
import { VisitorPackage } from '../models/visitor-package.model';
import { LocationModel } from '../models/location.model';
import { DateService } from '../services/date.service';
import { LoggedInService } from '../services/logged-in.service';
import { WifiDetailsModel } from '../models/wifi-details.model';

/**
* Purpose:	This enum provides message types
*	Usage:		This enum can be used to identify a type of message to display
*	@author:	Wian du Plooy
*	@version:	1.0
*/
enum messageType{
    success, info, error
}

/**
* Purpose:	This class provides visitor package editing component
*	Usage:		This class can be used to allow an employee to edit a visitor package for a client
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Component({
  selector: 'app-edit-visitor-package',
  templateUrl: './edit-visitor-package.page.html',
  styleUrls: ['./edit-visitor-package.page.scss'],
})
export class EditVisitorPackagePage implements OnInit {

  packageToUpdate: VisitorPackage = null;

  currentDate: Date = new Date();
  placeholderDate: string;
  placeholderTime: string;

  isBusy: boolean = false;  
  successMessage: string;
  infoMessage: string;
  errorMessage: string;

  employeeId: number = null;
  startDate: Date = null;
  endDate: Date = null;
  roomIdString: string = '';
  giveWiFi: boolean = null;
  wifiParamsId: number = null;
  wifiSsid: string = null;
  wifiPassword: string = null;
  wifiType: string = null;
  limit: number = null;

  buildingLocation: LocationModel;
  rooms: Object[];

  /**
   * Constructor that takes all injectables
   * @param navParams NavParams injectable
   * @param modalCtrl ModalController injectable
   * @param requestService RequestModuleService injectable
   * @param nfcService NfcControllerService injectable
   * @param packageService VisitorPackagesService injectable
   * @param dateService DateService injectable
   * @param loginService LoggedInService injectable
   */
  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private requestService: RequestModuleService,
    private nfcService: NfcControllerService,
    private packageService: VisitorPackagesService,
    private dateService: DateService,
    private loginService: LoggedInService
  ) { 
    this.placeholderDate = dateService.displayDate(this.currentDate);
    this.placeholderTime = dateService.displayTime(this.currentDate);

    this.employeeId = this.loginService.getEmployeeId();
    this.buildingLocation = this.loginService.getBuildingLoc();
    this.rooms = this.loginService.getRooms();

    this.packageToUpdate = navParams.get('packageToUpdate');
    this.startDate = this.packageToUpdate.startDate;
    this.endDate = this.packageToUpdate.endDate;
    if (this.rooms != null && this.rooms != []){
      let room: Object = this.rooms.find(room => room['name'] == this.packageToUpdate.access);
      this.roomIdString = room ? room['id'] : null;
    }
    else {
      this.roomIdString = '-1';
    }
    this.giveWiFi = (this.packageToUpdate.wifiSsid !== null);

    let wifiDetails: WifiDetailsModel = this.loginService.getWifiDetails();
    if (wifiDetails != null){
      this.wifiParamsId = wifiDetails.getId();
      this.wifiSsid = wifiDetails.getSsid();
      this.wifiPassword = wifiDetails.getPassword();
      this.wifiType = wifiDetails.getType();
    }
    
    this.limit = this.packageToUpdate.spendingLimit;
  }

  ngOnInit() {
  }

  /**
   * Function that closes the modal
   */
  closeModal(){
    this.modalCtrl.dismiss();
    this.nfcService.Finish()
  }

  /**
   * Function that gets called when submit is pressed
   */
  onSubmit(){
    this.wifiParamsId = this.giveWiFi == true ? this.wifiParamsId : null;
    let roomId: number = this.roomIdString == '-1' ? null: (+this.roomIdString);
    this.updateVisitorPackage(this.employeeId, this.startDate, this.endDate, this.wifiParamsId, roomId, this.limit);
  }

  /**
   * Function that displays a message to the user
   * @param message string message to display
   * @param type number from enum, type of message to display
   * @param timeout number after how long it should disappear (0 = don't dissappear)
   */
  private showMessage(message: string, type: number, timeout: number = 5000) {
    this.successMessage = null;
    this.infoMessage = null;
    this.errorMessage = null;
    switch(type) {
      case messageType.success: 
        this.successMessage = message;
        if (timeout != 0) { setTimeout(() => { this.successMessage = null;}, timeout); }
        break;
      case messageType.info:
        this.infoMessage = message;
        if (timeout != 0) { setTimeout(() => { this.infoMessage = null;}, timeout); }
        break;
      case messageType.error:
        this.errorMessage = message;
        if (timeout != 0) { setTimeout(() => { this.errorMessage = null;}, timeout); }
        break;
    }
  }

  /**
   * Function that creates a VisitorPackage, adds it to the database, and shares it with the client
   * @param employeeId number Employee's id
   * @param startTime string DateTime of when the package becomes valid
   * @param endTime string DateTime of when the package expires
   * @param wifiParamsId number WiFi's id visitor may connect to
   * @param roomId number Room's id visitor is visiting (furthest into the building)
   * @param limit number Max number of credits visitor can spend
   */
  private async updateVisitorPackage(employeeId: number, startTime: Date, endTime: Date, wifiParamsId: number, roomId: number, limit: number){
    if (employeeId === null) {
      this.showMessage("Ensure that you are logged in.", messageType.error, 5000);
      return;
    }
    if (startTime === null || endTime === null) {
      this.showMessage("Start date and end date are required.", messageType.error, 5000);
      return;
    }
    if (endTime < startTime) {
      this.showMessage("The start date should be before the end date.", messageType.error, 5000);
      return;
    }
    if (roomId === null) {
      this.showMessage("Physical Access required (eg. Lobby).", messageType.error, 5000);
      return;
    }
    this.isBusy = true;
    this.updateVisitorPackageInDB(employeeId, startTime, endTime, wifiParamsId, roomId, limit).subscribe(res => {
      this.isBusy = false;
      if (res['success'] === true) {
        let ssid = null;
        let password = null;
        let type = null;
        if (this.giveWiFi) {
          ssid = this.wifiSsid;
          password = this.wifiPassword;
          type = this.wifiType;
        }
        this.packageToUpdate.startDate = startTime;
        this.packageToUpdate.endDate = endTime;
        if (this.rooms!= null && this.rooms != []) {
          this.packageToUpdate.access = this.rooms.find(room => room['id'] == roomId)['name'];
        }
        else {
          this.packageToUpdate.access = 'Unknown';
        }
        this.packageToUpdate.wifiSsid = ssid;
        this.packageToUpdate.wifiPassword = password;
        this.packageToUpdate.wifiType = type;
        this.packageToUpdate.spendingLimit = limit;
        this.packageService.addSharedVisitorPackage(this.packageToUpdate);
        this.showMessage("Package Updated", messageType.success, 0);
        setTimeout(() => {
          this.closeModal()
        }, 1500);
      }
      else {
        this.showMessage(`Could not update package: ${res['message']}`, messageType.error);
      }
    });
  }

  /**
   * Function that adds a visitor package to the database
   * @param employeeId number Employee's id
   * @param startTime string DateTime of when the package becomes valid
   * @param endTime string DateTime of when the package expires
   * @param wifiParamsId number WiFi's id visitor may connect to
   * @param roomId number Room's id visitor is visiting (furthest into the building)
   * @param limit number Max number of credits visitor can spend
   * @return
   */
  private updateVisitorPackageInDB(employeeId: number, startTime: Date, endTime: Date, wifiParamsId: number, roomId: number, limit: number){
    let startTimeString = this.dateService.databaseDate(startTime);
    let endTimeString = this.dateService.databaseDate(endTime);
    return this.requestService.updateVisitorPackage(this.packageToUpdate.packageId, employeeId, startTimeString, endTimeString, wifiParamsId, roomId, limit);
  }
}