/**
*	File Name:	    create-visitor-package.page.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      CreateVisitorPackagePage
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/06/26	Wian		  1.0		    Original
*	2019/07/28	Wian		  1.1		    DateTime pickers now have more realistic min and max values
*
*	Functional Description:   This file provides the modal to create visitor packages
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
import { MessageType } from '../tabs/tabs.page';

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
* Purpose:	This class provides visitor package creation component
*	Usage:		This class can be used to allow an employee to create a visitor package for a client
*	@author:	Wian du Plooy
*	@version:	1.1
*/
@Component({
  selector: 'app-create-visitor-package',
  templateUrl: './create-visitor-package.page.html',
  styleUrls: ['./create-visitor-package.page.scss'],
})
export class CreateVisitorPackagePage implements OnInit {

  currentDate: Date = new Date();
  placeholderDate: string;
  placeholderTime: string;

  successMessage: string;
  infoMessage: string;
  errorMessage: string;

  employeeId: number = null;
  macAddress: string = null;
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
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    let wifiDetails: WifiDetailsModel = this.loginService.getWifiDetails();
    if (wifiDetails != null){
      this.wifiParamsId = wifiDetails.getId();
      this.wifiSsid = wifiDetails.getSsid();
      this.wifiPassword = wifiDetails.getPassword();
      this.wifiType = wifiDetails.getType();
    }
    this.employeeId = this.loginService.getEmployeeId();
    this.buildingLocation = this.loginService.getBuildingLoc();
    this.rooms = this.loginService.getRooms();
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
    this.createVisitorPackage(this.employeeId, this.startDate, this.endDate, this.macAddress, this.wifiParamsId, roomId, this.limit);
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
   * @param macAddress string Mac Address of the client
   * @param wifiParamsId number WiFi's id visitor may connect to
   * @param roomId number Room's id visitor is visiting (furthest into the building)
   * @param limit number Max number of credits visitor can spend
   */
  private async createVisitorPackage(employeeId: number, startTime: Date, endTime: Date, macAddress: string, wifiParamsId: number, roomId: number, limit: number){
    if (employeeId === null) {
      this.showMessage("Ensure that you are logged in.", messageType.error, 5000);
      return;
    }
    if (macAddress === null) {
      this.showMessage("Adding a visitor is required.", messageType.error, 5000);
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
    this.addVisitorPackageToDB(employeeId, startTime, endTime, macAddress, wifiParamsId, roomId, limit).subscribe(res => {
      this.requestService.dismissLoading();
      if (res['success'] === true) {
        let id: number = res['data']['visitorPackageId'];
        if (!this.giveWiFi) {
          this.wifiSsid = null;
          this.wifiPassword = null;
          this.wifiType = null;
        }
        let access: string = this.rooms.find(room => room['id'] == roomId)['name'];
        let companyName = this.loginService.getCompanyName();
        let visitorPackage: VisitorPackage = this.packageService.createVisitorPackage(id, companyName, startTime, endTime, access, 
          this.buildingLocation, this.wifiSsid, this.wifiPassword, this.wifiType, limit, 0);
        this.packageService.addSharedVisitorPackage(visitorPackage);
        this.shareVisitorPackage(visitorPackage);
      }
      else {
        this.showMessage(`Error adding to DB: ${res['message']}`, MessageType.error);
      }
    }, err => {
      this.showMessage(`Error adding to DB: Ensure that you have a stable internet connection`, MessageType.error);
    });
  }

  /**
   * Function that share the visitor package with the client
   * @param visitorPackage VisitorPackage object to share
   */
  private shareVisitorPackage(visitorPackage: VisitorPackage){
    this.errorMessage = null;
    this.successMessage = null;
    this.infoMessage = null;
    this.showMessage(`Hold the phone against the receiving phone.`, messageType.info, 0);
    this.nfcService.SendData(visitorPackage.packageId, JSON.stringify(visitorPackage))
    .then(() => {
      this.showMessage("Package Shared", messageType.success, 0);
      setTimeout(() => {
        this.closeModal()
      }, 1500);
    })
    .catch((err) => {
      this.showMessage(`Error: ${err} - Try turning on 'Android Beam'`, messageType.error, 0);
    })
    .finally(() => {
      this.infoMessage = null;
      this.nfcService.Finish();
    });
  }

  /**
   * Function that adds a visitor package to the database
   * @param employeeId number Employee's id
   * @param startTime string DateTime of when the package becomes valid
   * @param endTime string DateTime of when the package expires
   * @param macAddress string Mac Address of the client
   * @param wifiParamsId number WiFi's id visitor may connect to
   * @param roomId number Room's id visitor is visiting (furthest into the building)
   * @param limit number Max number of credits visitor can spend
   * @return
   */
  private addVisitorPackageToDB(employeeId: number, startTime: Date, endTime: Date, macAddress: string, wifiParamsId: number, roomId: number, limit: number){
    let startTimeString = this.dateService.databaseDate(startTime);
    let endTimeString = this.dateService.databaseDate(endTime);
    return this.requestService.addVisitorPackage(employeeId, startTimeString, endTimeString, macAddress, wifiParamsId, roomId, limit);
  }

  /**
   * Function used to get the visitor DeviceID
   */
  assignVisitor(){
    this.errorMessage = null;
    this.successMessage = null;
    this.infoMessage = null;
    this.nfcService.IsEnabled()
    .then(() => {
      this.showMessage(`Hold the phone against the sharing device.`, messageType.info, 0);
      this.nfcService.ReceiveData().subscribe(data => {
        let payload = this.nfcService.BytesToString(data.tag.ndefMessage[0].payload)     
        this.nfcService.Finish();
        let uid = payload.slice(3);
        this.showMessage(`Visitor Device Selected.`, messageType.success, 2000);
        this.macAddress = uid;
      });
    })
    .catch(() => {
      this.showMessage(`NFC seems to be off. Please try turing it on.`, messageType.error, 0);
    })
  }

  /**
   * Function used to get min or max date for the date time pickers
   * @param isMax boolean which if true, function returns max date, otherwise min date is returned
   * @return string either today (min) or 2 years from today (max)
   */
  pickerDate(isMax: boolean){
    let today: Date = new Date();
    if (isMax) {
      return new Date(today.setFullYear(today.getFullYear() + 2)).toISOString();
    }
    else {
      return today.toISOString();
    }
  }
}