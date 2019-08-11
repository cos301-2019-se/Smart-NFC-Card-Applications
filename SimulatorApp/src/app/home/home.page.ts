/**
*	File Name:	    home.page.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      HomePage
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/08/03	Wian		  1.0		    Original
*	2019/08/10	Wian		  1.1		    Added NFC functionality to handle requests
*
*	Functional Description:   This page is used as the interface for the simulator app
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { Component } from '@angular/core';
import { CompanyModel } from '../models/company.model';
import { BuildingModel } from '../models/building.model';
import { RoomModel } from '../models/room.model';
import { PayPointModel } from '../models/pay-point.model';
import { RequestModuleService } from '../services/request-module.service';
import { NfcControllerService } from '../services/nfc-controller.service';
import { Color } from '@ionic/core';

export enum ModeType{
  accessPoint, payPoint, none
}

export enum MessageType{
    success, info, error, reset
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private companies: CompanyModel[];
  private buildings: BuildingModel[];
  private rooms: RoomModel[];
  private payPoints: PayPointModel[];
  private selectedCompany: number;
  private selectedBuilding: number;
  private selectedRoom: number;
  private selectedPayPoint: number;
  private paymentAmount: number;

  private modeDetail: string;
  private modeType: ModeType;

  private success?: Boolean = null;

  private infoMessage: string = null;
  private successMessage: string = null;
  private errorMessage: string = null;

  /**
   * Function that takes all the injectables and makes the needed request to fetch all the required data
   * @param reqService RequestModuleService injectable
   * @param nfcService NfcControllerService injectable
   */
  constructor(
    private reqService: RequestModuleService,
    private nfcService: NfcControllerService
  ) { 
    this.refreshData();
    this.listen();
  }

  /**
   * Function that listens for NFC devices
   */
  listen() {
    this.nfcService.IsEnabled()
    .then(() => {
      this.nfcService.ReceiveData().subscribe(data => {
        let payload = this.nfcService.BytesToString(data.tag.ndefMessage[0].payload);      
        this.nfcService.Finish();
        try {
          let json = JSON.parse(payload.slice(3)); 
          this.handleNFCData(json);
        } catch (error) {
          this.showMessage(`Data received not in json format: ${error}`, MessageType.error, 0);
          this.listen();
        }
      });
    })
    .catch(() => {
      this.showMessage(`NFC seems to be off. Please try turing it on.`, MessageType.error, 0);
    })
  }

  /**
   * Function that handles incoming NFC shared data
   * @param data JSON received from device
   */
  handleNFCData(data: JSON){
    switch (this.modeType) {
      case ModeType.none:
        this.showMessage(`App not in any mode - didn't handle data.`, MessageType.info, 5000);
        break;
      case ModeType.accessPoint:
        this.handleAccessPoint(data);
        break;
      case ModeType.payPoint:
        this.handlePayPoint(data);
        break;
    }    
    this.listen();   
  }
  
  /**
   * Function that changes the display based on whether or not a request was successful
   * @param success Boolean
   */
  Display(success?: Boolean){
    this.success = success;   
    if (success === null) {  
      this.showMessage(``, MessageType.reset);
    }
  }

  /**
   * Function that handles incoming NFC shared data for access points
   * @param data JSON received from device
   */
  handleAccessPoint(data: JSON) {
    data["roomId"] = this.selectedRoom;
    try {
      this.reqService.attemptAccess(data).subscribe(res => {
        if (res['success'] === true) {
          this.Display(true);
          this.showMessage(`Access Granted`, MessageType.success, 0);
          this.reqService.dismissLoading();
        }
        else {
          this.Display(false);
          this.showMessage(`Access Denied: ${res['message']}`, MessageType.error, 0);
          this.reqService.dismissLoading();
        }
      });
    } catch (error) {
      this.Display(null);
      this.showMessage(`Data received not in json format: ${error}`, MessageType.error, 0);
      this.reqService.dismissLoading();
    }
  }

  /**
   * Function that handles incoming NFC shared data for payment points
   * @param data JSON received from device
   */
  handlePayPoint(data: JSON) {
    data["amount"] = this.paymentAmount;
    data["nfcPaymentPointId "] = this.selectedPayPoint;
    try {
      this.reqService.makePayment(data).subscribe(res => {
        if (res['success'] === true) {
          this.Display(true);
          this.showMessage(`Payment Made`, MessageType.success, 0);
          this.reqService.dismissLoading();
        }
        else {
          this.Display(false);
          this.showMessage(`Payment Failed: ${res['message']}`, MessageType.error, 0);
          this.reqService.dismissLoading();
        }
      });
    } catch (error) {
      this.Display(null);
      this.showMessage(`Data received not in json format: ${error}`, MessageType.error, 0);
      this.reqService.dismissLoading();
    }
  }

  /**
   * Function that reloads all the data from the service
   */
  refreshData(){
    this.changeMode(ModeType.none);

    this.companies = [];
    this.buildings = [];
    this.rooms = [];
    this.payPoints = [];
  
    this.selectedCompany = -1;
    this.selectedBuilding = -1;
    this.selectedRoom = -1;
    this.selectedPayPoint = -1;

    this.reqService.getAllAccessPoints().subscribe(res => {
      if (res['success'] === true) {
        let data = res['data'];
        data.forEach(company => {

          let buildings = company['buildings'];
          let newBuildings: BuildingModel[] = [];
          buildings.forEach(building => {
            let newBuilding = new BuildingModel(building['buildingId'], building['buildingName']);
            newBuildings.push(newBuilding);

            let rooms = building['rooms'];
            rooms.forEach(room => {
              let newRoom = new RoomModel(room['roomId'], room['roomName']);
              newBuilding.addRoom(newRoom);
            });

          });
          let newCompany = new CompanyModel(company['companyId'], company['companyName'], newBuildings);
          this.companies.push(newCompany)
        });

        this.reqService.getAllPaymentPoints().subscribe(res => {
          if (res['success'] === true) {
            let data = res['data'];
            data.forEach(company => {
    
              let buildings = company['buildings'];
              buildings.forEach(building => {
                let newBuilding = this.getBuildingById(building['buildingId'], this.getCompanyById(company['companyId']).getBuildings());
    
                let paymentPoints = building['paymentPoints'];
                paymentPoints.forEach(paymentPoint => {
                  let newPaymentPoints = new PayPointModel(paymentPoint['nfcPaymentPointId'], paymentPoint['description']);
                  newBuilding.addPayPoint(newPaymentPoints);
                });
    
              });
            });
            this.showMessage(`Loaded Data`, MessageType.success);
            this.reqService.dismissLoading();
          }
          else {
            this.showMessage(`Could not get all payment points: ${res['message']}`, MessageType.error);
            this.reqService.dismissLoading();
          }
        });
      }
      else {
        this.showMessage(`Could not get all access points: ${res['message']}`, MessageType.error);
        this.reqService.dismissLoading();
      }      
    });
  }

  /**
   * Function that changes the mode the app is in
   * @param mode ModeType which mode to switch to
   */
  changeMode(mode: ModeType){
    this.Display(null);
    this.modeType = mode;
    switch (mode){
      case ModeType.accessPoint:
        this.modeDetail = `Access Point`;
        break;
      case ModeType.payPoint:
        this.modeDetail = `Pay Point`;
        break;
      case ModeType.none:
        this.modeDetail = `No mode selected`;
        break;
    }
  }

  /**
   * Function that is used to set the device as an Access point simulator
   */
  actAsAccessPoint(){
    if (this.selectedRoom < 0) {
      this.showMessage('Select a room first', MessageType.info);
      return;
    }
    this.changeMode(ModeType.accessPoint);
  }

  /**
   * Function that is used to set the device as an Payment point simulator
   */
  actAsPayPoint() {
    if (this.selectedPayPoint < 0) {
      this.showMessage('Select a pay point first', MessageType.info);
      return;
    }
    if (this.paymentAmount === undefined || this.paymentAmount === null || this.paymentAmount < 0) {
      this.showMessage('Enter a non negative amount first', MessageType.info);
      return;
    }
    this.changeMode(ModeType.payPoint);
  }

  /**
   * Function that gets called when the company selection is changed - reset all things beneath it
   */
  changedCompany() {
    this.selectedBuilding = -1;
    this.selectedRoom = -1;
    this.selectedPayPoint = -1;

    this.buildings = [];
    this.rooms = [];
    this.payPoints = [];

    if (this.selectedCompany > -1) {
      this.buildings = this.getCompanyById(this.selectedCompany).getBuildings();    
    }
    this.changeMode(ModeType.none);
  }

  /**
   * Function that gets called when the building selection is changed - reset all things beneath it
   */
  changedBuilding() {
    this.selectedRoom = -1;
    this.selectedPayPoint = -1;

    this.rooms = [];
    this.payPoints = [];

    if (this.selectedBuilding > -1) {
      this.rooms = this.getBuildingById(this.selectedBuilding).getRooms();
      this.payPoints = this.getBuildingById(this.selectedBuilding).getPayPoints();    
    }
    this.changeMode(ModeType.none);
  }

  /**
   * Function that gets the company in the list of companies associated with a particular id
   * @param id number unique identifier of the company
   * @param companies Optional CompanyModel[] to look through
   * @return CompanyModel linked to id
   */
  private getCompanyById(id: number, companies?: CompanyModel[]){
    if (companies !== null && companies !== undefined) {
      return companies.find(company => {
        return company.getId() == id;
      });
    }
    else {
      return this.companies.find(company => {
        return company.getId() == id;
      });
    }
  }

  /**
   * Function that gets the building in the list of buildings associated with a particular id
   * @param id number unique identifier of the building
   * @param buildings Optional BuildingModel[] to look through
   * @return BuildingModel linked to id
   */
  private getBuildingById(id: number, buildings?: BuildingModel[]){
    if (buildings !== null && buildings !== undefined) {
      return buildings.find(building => {
        return building.getId() == id;
      });
    }
    else {
      return this.buildings.find(building => {
        return building.getId() == id;
      });
    }
  }

  /**
   * Function that displays a message to the user
   * @param message string to display to the user
   * @param type MessageType to display
   * @param timeout number of miliseconds before it disappears (0 = never)
   */
  private showMessage(message: string, type: number, timeout: number = 2500) {
    this.successMessage = null;
    this.infoMessage = null;
    this.errorMessage = null;
    switch(type) {
      case MessageType.success: 
        this.successMessage = message;
        if (timeout != 0) { setTimeout(() => { this.successMessage = null;}, timeout); }
        break;
      case MessageType.info:
        this.infoMessage = message;
        if (timeout != 0) { setTimeout(() => { this.infoMessage = null;}, timeout); }
        break;
      case MessageType.error:
        this.errorMessage = message;
        if (timeout != 0) { setTimeout(() => { this.errorMessage = null;}, timeout); }
        break;
    }
  }

}
