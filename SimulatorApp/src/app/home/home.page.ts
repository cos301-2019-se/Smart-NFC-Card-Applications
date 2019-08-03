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

  constructor(
    private reqService: RequestModuleService,
    private nfcService: NfcControllerService
  ) { 
    let payPoint1: PayPointModel = new PayPointModel(0, 'Steers');
    let payPoint2: PayPointModel = new PayPointModel(1, 'KFC');
    let payPoint3: PayPointModel = new PayPointModel(2, 'McDonalds');

    let room1: RoomModel = new RoomModel(0, 'New York');
    let room2: RoomModel = new RoomModel(1, 'Houston');
    let room3: RoomModel = new RoomModel(2, 'New York');

    let building1: BuildingModel = new BuildingModel(0, 'EPI-USE Offices');
    building1.addRoom(room1);
    building1.addRoom(room2);
    building1.addRoom(room3);
    building1.addPayPoint(payPoint1);
    building1.addPayPoint(payPoint2);
    building1.addPayPoint(payPoint3);

    let buildings1: BuildingModel[] = [];
    buildings1.push(building1);

    let company1: CompanyModel = new CompanyModel(0, 'EPI-USE', buildings1);
    this.companies.push(company1);
  }

  actAsAccessPoint(){
    if (this.selectedRoom < 0) {
      this.showMessage('Select a room first', MessageType.info);
      return;
    }
    this.mode = `Access Point`;
  }

  actAsPayPoint() {
    if (this.selectedPayPoint < 0) {
      this.showMessage('Select a pay point first', MessageType.info);
      return;
    }
    this.mode = `Pay Point`;
  }

  changedCompany() {
    this.selectedBuilding = -1;
    this.selectedRoom = -1;
    this.selectedPayPoint = -1;

    this.buildings = null;
    this.rooms = null;
    this.payPoints = null;

    this.buildings = this.getCompanyById(this.selectedCompany).getBuildings();
  }

  changedBuilding() {
    this.selectedRoom = -1;
    this.selectedPayPoint = -1;

    this.rooms = null;
    this.payPoints = null;

    this.rooms = this.getBuildingById(this.selectedBuilding).getRooms();
    this.payPoints = this.getBuildingById(this.selectedBuilding).getPayPoints();
  }

  private getCompanyById(id: number){
    return this.companies.find(company => {
      return company.getId() == id;
    });
  }

  private getBuildingById(id: number){
    return this.buildings.find(building => {
      return building.getId() == id;
    });
  }

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
