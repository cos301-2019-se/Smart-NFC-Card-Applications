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
*
*	Functional Description:   This file provides the modal to create visitor packages
*	Error Messages:   “Error”
*	Assumptions:  None
*	Constraints: 	None
*/

import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { RequestModuleService } from '../services/request-module.service';

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
*	@version:	1.0
*/
@Component({
  selector: 'app-create-visitor-package',
  templateUrl: './create-visitor-package.page.html',
  styleUrls: ['./create-visitor-package.page.scss'],
})
export class CreateVisitorPackagePage implements OnInit {

  currentDate: Date = new Date();
  placeholderDate: string;
  isBusy: boolean = false;  
  successMessage: string;
  infoMessage: string;
  errorMessage: string;

  employeeId: number = 1;
  macAddress: string = 'null';
  startDate: Date = null;
  endDate: Date = null;
  roomIdString: string = '';
  giveWiFi: boolean = null;
  limit: number = null;

  /**
   * Constructor that takes all injectables
   * @param navParams NavParams injectable
   * @param modalCtrl ModalController injectable
   * @param requestService RequestModuleService injectable
   */
  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private requestService: RequestModuleService
  ) { 
    this.placeholderDate = `${this.currentDate.getDate()}/${this.currentDate.getMonth()+1}/${this.currentDate.getFullYear()}`;
  }

  ngOnInit() {
  }

  /**
   * Function that closes the modal
   */
  closeModal(){
    this.modalCtrl.dismiss();
  }

  /**
   * Function that gets called when submit is pressed
   */
  onSubmit(){
    let wifiParamsId = this.giveWiFi == true? 0: null;
    let roomId: number = this.roomIdString == '' ? null: (+this.roomIdString);
    this.createVisitorPackage(this.employeeId, this.startDate, this.endDate, this.macAddress, wifiParamsId, roomId, this.limit);
  }

  /**
   * Function that displays a message to the user
   * @param message string message to display
   * @param type number from enum, type of message to display
   * @param timeout number after how long it should disappear (0 = don't dissappear)
   */
  private showMessage(message: string, type: number, timeout: number = 0) {
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
    this.isBusy = true;
    await this.addVisitorPackageToDB(employeeId, startTime, endTime, macAddress, wifiParamsId, roomId, limit);
    this.isBusy = false;
    this.shareVisitorPackage();
  }

  /**
   * Function that share the visitor package with the client
   */
  private shareVisitorPackage(){

    this.showMessage("Package Shared", messageType.success, 0);
    setTimeout(() => {
      this.closeModal()
    }, 1500);
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
  private async addVisitorPackageToDB(employeeId: number, startTime: Date, endTime: Date, macAddress: string, wifiParamsId: number, roomId: number, limit: number){
    let startTimeString = this.requestService.dateTimeToString(startTime);
    let endTimeString = this.requestService.dateTimeToString(endTime);
    await this.delay(2000);
    return this.requestService.addVisitorPackage(employeeId, startTimeString, endTimeString, macAddress, wifiParamsId, roomId, limit);
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

}
