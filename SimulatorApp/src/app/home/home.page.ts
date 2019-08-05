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

export enum MessageType{
    success, info, error, reset
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private companies: CompanyModel[] = [];
  private buildings: BuildingModel[] = [];
  private rooms: RoomModel[] = [];
  private payPoints: PayPointModel[] = [];

  private selectedCompany: number = -1;
  private selectedBuilding: number = -1;
  private selectedRoom: number = -1;
  private selectedPayPoint: number = -1;

  private mode: string = 'No mode selected';
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

    reqService.getAllAccessPoints().subscribe(res => {
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

        reqService.getAllPaymentPoints().subscribe(res => {
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
          }
          else {
            this.showMessage(`Could not get all payment points: ${res['message']}`, MessageType.error);
          }
        });
      }
      else {
        this.showMessage(`Could not get all access points: ${res['message']}`, MessageType.error);
      }
    });
  }

  /**
   * Function that is used to set the device as an Access point simulator
   */
  actAsAccessPoint(){
    if (this.selectedRoom < 0) {
      this.showMessage('Select a room first', MessageType.info);
      return;
    }
    this.mode = `Access Point`;
  }

  /**
   * Function that is used to set the device as an Payment point simulator
   */
  actAsPayPoint() {
    if (this.selectedPayPoint < 0) {
      this.showMessage('Select a pay point first', MessageType.info);
      return;
    }
    this.mode = `Pay Point`;
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
    this.mode = `No mode selected`;
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
    this.mode = `No mode selected`;
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
