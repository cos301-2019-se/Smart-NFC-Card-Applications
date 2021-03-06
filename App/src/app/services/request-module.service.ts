/**
*	File Name:	    request-module.service.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      RequestModuleService
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/05/19	Wian		  1.0		    Original
*	2019/06/27	Wian		  1.1		    Added Functions for Creating Visitor Packages
*	2019/07/09	Wian		  1.2		    Service now automatcially adds api key to the json body using appendApiKey()
*	2019/08/02	Wian		  1.3		    Added loading controller for when a request is pending
*	2019/08/17	Wian		  1.4		    getVisitorPackage now uses device uniqueID instead of apiKey
*
*	Functional Description:   This class provides a request service to the application that
*                           is used to make http requests to the back-end
*	Error Messages:   “Error”
*	Assumptions:  That you have an internet connection
*	Constraints: 	None
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { LoadingController } from '@ionic/angular';
import { UniqueIdService } from './unique-id.service';
import { SharedModule } from '../shared.module';

/**
* Purpose:	This class provides the injectable service
*	Usage:		This class can be used to make http requests to the back-end by calling its public function
*	@author:	Wian du Plooy
*	@version:	1.4
*/
@Injectable({
  providedIn: 'root'
})
export class RequestModuleService {

  static demoMode: boolean = false;
  apiKeyName: string = 'apiKey';
  apiKey: string = '';
  loadingModal: HTMLIonLoadingElement;  

  baseUrl: string = "https://smart-nfc-application.herokuapp.com";
  loginStub: JSON = JSON.parse(`{
    "success": true,
    "message": "Login successful.",
    "data": {
        "apiKey": "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^",
        "id": 0
    }
  }`);
  logoutStub: JSON = JSON.parse(`{ 
    "success" : true,
    "message" : "Logout successful.",
    "data" : { } 
  }`);
  businessCardStub: JSON = JSON.parse(`{
    "success": true,
    "message": "Business card information loaded successfully",
    "data": {
        "employeeTitle": "Mr",
        "employeeName": "Piet",
        "employeeSurname": "Pompies",
        "employeeCellphone": "0791637273",
        "employeeEmail": "piet.pompies@gmail.com",
        "companyName": "Vast Expanse",
        "website": "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications"
    }
  }`);
  visitorPackageStub: JSON = JSON.parse(`{
    "success": true,
    "message": "Business card information loaded successfully",
    "data": {
        "visitorPackageId": 0
    }
  }`);
  employeePackagesStub: JSON = JSON.parse(`{
    "success": true,
    "message": "Retrieved visitor packages",
    "data": []
  }`);
  employeeDetailsStub: JSON = JSON.parse(`{
    "success": true,
    "message": "Successfully retrieved employee details",
    "data":{
      "building": {
        "branchName": "Building Name",
        "latitude": -24.1234,
        "longitude": 27.891
      },
      "rooms": [
        {"roomId": 0, "roomName":"Lobby"},
        {"roomId": 1, "roomName":"Office 1"},
        {"roomId": 2, "roomName":"Office 2"},
        {"roomId": 3, "roomName":"Office 3"},
        {"roomId": 4, "roomName":"Labs"}
      ],
      "wifi": {
        "wifiParamsId": 0,
        "ssid": "DemoSSID",
        "password": "Demo1234",
        "networkType": "WPA2"
      }
    }
  }`);

  /**
   * Constructor that takes all injectables
   * @param http HttpClient injectable
   * @param storage LocalStorageService injectable
   * @param loadingController: LoadingController
   * @param uidService: UniqueIdService
   */
  constructor(
    private storage: LocalStorageService,
    private http: HttpClient,
    private loadingController: LoadingController,
    private uidService: UniqueIdService
  ) { }

  /**
   * Makes a get request using http
   * @param url string what to get
   * @return Observable response from get request
   */
  private get(url: string) {
    this.presentLoading();
    return this.http.get(url);
  }

  /**
   * Makes a post request using http
   * @param url string where to post to
   * @param body JSON data to send
   * @return Observable response from post request
   */
  private post(url: string, body?: JSON) {
    this.presentLoading();
    body = this.appendApiKey(body);
    return this.http.post(url, body);
  }

  /**
   * Makes a post request using http, without opening loading model
   * @param url string where to post to
   * @param body JSON data to send
   * @return Observable response from post request
   */
  private postNoWait(url: string, body?: JSON) {
    body = this.appendApiKey(body);
    return this.http.post(url, body);
  }

  /**
   * Function appends the api key to a json object
   * @param json JSON to append the api key to 
   */
  private appendApiKey(json?: JSON){
    if (json == undefined || json == null) {
      json = JSON.parse('{}');
    }
    if (this.apiKey == null || this.apiKey == '') {
      return json;
    }
    json[this.apiKeyName] = this.apiKey;
    return json;
  }

  /**
   * Function to login a user
   * @param username string user's username / email
   * @param password string user's password
   * @return Observable<Object> response containing json from back-end server
   */
  login(username: string, password: string) {
    if(RequestModuleService.demoMode) {
      this.apiKey = this.loginStub['data']['apiKey'];
      return new Observable<Object>(observer => {
        observer.next(this.loginStub);
        observer.complete();
      });
    }
    else {
      this.apiKey = null;
      let json: JSON = JSON.parse(`{ "username": "${username.trim()}", "password": "${password.trim()}" }`);
      return this.post(`${this.baseUrl}/app/login`, json);
    }
  }

  /**
   * Function to logout a user
   * @return Observable<Object> response containing json from back-end server
   */
  logout() {
    //if(this.demoMode) {
      return new Observable<Object>(observer => {
        observer.next(this.logoutStub);
        observer.complete();
      });
    /*}
    else {
      return this.post(`${this.baseUrl}/app/logout`);
    }*/
  }

  /**
   * Function to check if user is logged in
   * @return Observable<Object> response containing json from back-end server
   */
  checkLoggedIn() {
    if(RequestModuleService.demoMode) {
      if(this.loginStub['data']['apiKey'] == this.apiKey){
        return new Observable<Object>(observer => {
          observer.next(this.loginStub);
          observer.complete();
        });
      }
      else {
        return new Observable<Object>(observer => {
          observer.next(this.logoutStub);
          observer.complete();
        });
      }
    }
    else {
      return this.post(`${this.baseUrl}/app/checkLoggedIn`);
    }
  }

  /**
   * Function to get business card data
   * @param employeeId number Employee's id to get his business card
   * @return Observable<Object> response containing json from back-end server
   */
  getBusinessCard(employeeId: number) {
    if(RequestModuleService.demoMode) {
      return new Observable<Object>(observer => {
        observer.next(this.businessCardStub);
        observer.complete();
      });
    }
    else {
      let json: JSON = JSON.parse(`{ "employeeId": ${employeeId} }`);
      return this.post(`${this.baseUrl}/app/getBusinessCard`, json);
    }
  }

  /**
   * Function to add a visitor package to the database
   * @param employeeId number Employee's id
   * @param startTime string DateTime of when the package becomes valid
   * @param endTime string DateTime of when the package expires
   * @param macAddress string Mac Address of the client
   * @param wifiParamsId number WiFi's id visitor may connect to
   * @param roomId number Room's id visitor is visiting (furthest into the building)
   * @param limit number Max number of credits visitor can spend
   * @param spent number Credits already spent on the virtual card (defaults to 0)
   * @return Observable<Object> response containing json from back-end server
   */
  addVisitorPackage(employeeId: number, startTime: string, endTime: string, macAddress: string, wifiParamsId: number, roomId: number, limit: number, spent: number = 0) {
    if (RequestModuleService.demoMode) {
      return new Observable<Object>(observer => {
        observer.next(this.visitorPackageStub);
        observer.complete();
      });
    }
    else {
      let json: JSON = JSON.parse(`{"employeeId": ${employeeId}, "startTime": "${startTime}", "endTime": "${endTime}", "macAddress": "${macAddress}", 
      "wifiAccessParamsId": ${wifiParamsId}, "roomId": ${roomId}, "limit": ${limit}, "spent": ${spent}}`);
      return this.post(`${this.baseUrl}/app/addVisitorPackage`, json);
    }
  }

  /**
   * Function to edit a visitor package in the database
   * @param packageId number Id of package to update
   * @param employeeId number Employee's id
   * @param startTime string DateTime of when the package becomes valid
   * @param endTime string DateTime of when the package expires
   * @param wifiParamsId number WiFi's id visitor may connect to
   * @param roomId number Room's id visitor is visiting (furthest into the building)
   * @param limit number Max number of credits visitor can spend
   * @param spent number Credits already spent on the virtual card (defaults to 0)
   * @return Observable<Object> response containing json from back-end server
   */
  updateVisitorPackage(packageId: number, employeeId: number, startTime: string, endTime: string, wifiParamsId: number, roomId: number, limit: number) {
    if (RequestModuleService.demoMode) {
      return new Observable<Object>(observer => {
        observer.next(this.visitorPackageStub);
        observer.complete();
      });
    }
    else {
      let json: JSON = JSON.parse(`{"visitorPackageId": ${packageId}, "employeeId": ${employeeId}, "startTime": "${startTime}", "endTime": "${endTime}", 
      "wifiAccessParamsId": ${wifiParamsId}, "roomId": ${roomId}, "limit": ${limit}}`);
      return this.post(`${this.baseUrl}/app/editVisitorPackage`, json);
    }
  }

  /**
   * Function to edit a visitor package in the database
   * @param packageId number Id of package to update
   * @return Observable<Object> response containing json from back-end server
   */
  deleteVisitorPackage(packageId: number) {
    if (RequestModuleService.demoMode) {
      return new Observable<Object>(observer => {
        observer.next(this.visitorPackageStub);
        observer.complete();
      });
    }
    else {
      let json: JSON = JSON.parse(`{"visitorPackageId": ${packageId}}`);
      return this.post(`${this.baseUrl}/app/deleteVisitorPackage`, json);
    }
  }

  /**
   * Function to get a specific visitor package from the database
   * @param packageId number Id of package to fetch
   * @return Observable<Object> response containing json from back-end server
   */
  getVisitorPackage(packageId: number){
    if (RequestModuleService.demoMode) {
      return new Observable<Object>(observer => {
        observer.next(this.visitorPackageStub);
        observer.complete();
      });
    }
    else {
      let uid = this.uidService.getUniqueId();
      let json: JSON = JSON.parse(`{"visitorPackageId": ${packageId}, "macAddress":"${uid}"}`);
      return this.post(`${this.baseUrl}/client/getVisitorPackage`, json);
    }
  }

  /**
   * Function to get all visitor packages of an employee from the database
   * @param employeeId number Id of employee's packages to fetch
   * @return Observable<Object> response containing json from back-end server
   */
  getAllEmployeeVisitorPackage(employeeId: number){
    if (RequestModuleService.demoMode) {
      return new Observable<Object>(observer => {
        observer.next(this.employeePackagesStub);
        observer.complete();
      });
    }
    else {
      let json: JSON = JSON.parse(`{"employeeId": ${employeeId}}`);
      return this.post(`${this.baseUrl}/app/getVisitorPackages`, json);
    }
  }

  /**
   * Function that gets details of the employee to populate an account object
   * @param employeeId number id of the employee
   * @return Observable<Object> response containing json from back-end server
   */
  getEmployeeDetails(employeeId: number){
    if (RequestModuleService.demoMode) {
      return new Observable<Object>(observer => {
        observer.next(this.employeeDetailsStub);
        observer.complete();
      });
    }
    else {
      let json: JSON = JSON.parse(`{"employeeId": ${employeeId}}`);
      return this.post(`${this.baseUrl}/app/getEmployeeDetails`, json);
    }
  }

  /**
   * Function that sets the api for the module to use
   * @param apiKey string api key
   */
  setApiKey(apiKey: string){
    this.apiKey = apiKey;
  }

  /**
   * Function that opens loading modal to prevent user from clicking buttons
   */
  private async presentLoading() {
    if (this.loadingModal == null) {
      this.loadingModal = await this.loadingController.create({
        message: 'Please wait',
        spinner: 'bubbles'
      });
      await this.loadingModal.present();
    }
  }

  /**
   * Function that closes the loading modal - should be called by functions calling request functions
   */
  dismissLoading(){
    setTimeout(() => {
      if (this.loadingModal) {
        this.loadingModal.dismiss();
        this.loadingModal = null;
      }
    }, 2 * SharedModule.timeoutDelay + 1);
  }
}
