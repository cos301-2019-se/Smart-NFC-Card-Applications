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
*	2019/08/03	Wian		  1.0		    Original
*	2019/08/10	Wian		  1.1 	    Added requests for access and payments
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
import { LoadingController } from '@ionic/angular';

/**
* Purpose:	This class provides the injectable service
*	Usage:		This class can be used to make http requests to the back-end by calling its public function
*	@author:	Wian du Plooy
*	@version:	1.2
*/
@Injectable({
  providedIn: 'root'
})
export class RequestModuleService {

  static demoMode: boolean = false;

  loadingModal: HTMLIonLoadingElement; 
  baseUrl: string = "https://smart-nfc-application.herokuapp.com";

  accessPointsStub: JSON = JSON.parse(`{
    "success": true,
    "message": "All Data retrieved",
    "data": [
        {
            "companyName": "Us",
            "companyId": 2,
            "buildings": []
        },
        {
            "companyName": "Link",
            "companyId": 1,
            "buildings": [
                {
                    "buildingId": 1,
                    "buildingName": "Pretoria Head Office",
                    "rooms": [
                        {
                            "roomId": 1,
                            "roomName": "Lobby"
                        },
                        {
                            "roomId": 2,
                            "roomName": "Houston"
                        },
                        {
                            "roomId": 3,
                            "roomName": "Canteen"
                        }
                    ]
                },
                {
                    "buildingId": 2,
                    "buildingName": "Johannesburg Office",
                    "rooms": []
                }
            ]
        }
    ]
  }`);  

  payPointsStub: JSON = JSON.parse(`{
    "success": true,
    "message": "All Data retrieved",
    "data": [
        {
            "companyName": "Us",
            "companyId": 2,
            "buildings": []
        },
        {
            "companyName": "Link",
            "companyId": 1,
            "buildings": [
                {
                    "buildingId": 1,
                    "buildingName": "Pretoria Head Office",
                    "paymentPoints": []
                },
                {
                    "buildingId": 2,
                    "buildingName": "Johannesburg Office",
                    "paymentPoints": [
                        {
                            "nfcPaymentPointId": 1,
                            "description": "Kauai"
                        },
                        {
                            "nfcPaymentPointId": 2,
                            "description": "Steers"
                        }
                    ]
                }
            ]
        }
    ]
  }`);

  grantAccessStub: JSON = JSON.parse(`{
    "success": true,
    "message": "Access Granted.",
    "data": {}
  }`);

  makePaymentStub: JSON = JSON.parse(`{
    "success": false,
    "message": "Insufficient funds.",
    "data": {}
  }`);

  /**
   * Constructor that takes all injectables
   * @param http HttpClient injectable
   * @param loadingController: LoadingController
   */
  constructor(
    private http: HttpClient,
    private loadingController: LoadingController
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
    return this.http.post(url, body);
  }

  /**
   * Makes a post request using http, without opening loading model
   * @param url string where to post to
   * @param body JSON data to send
   * @return Observable response from post request
   */
  private postNoWait(url: string, body?: JSON) {
    return this.http.post(url, body);
  }

  /**
   * Function that gets all the data regarding the access points
   * @return Observable<Object> response containing json from back-end server 
   */
  getAllAccessPoints(){
    if(RequestModuleService.demoMode) {
      return new Observable<Object>(observer => {
        observer.next(this.accessPointsStub);
        observer.complete();
      });
    }
    else {
      return this.post(`${this.baseUrl}/access/getAllCompanyBuildingRooms`, JSON.parse('{}'));
    }
  }

  /**
   * Function that gets all the data regarding the payment points
   * @return Observable<Object> response containing json from back-end server 
   */
  getAllPaymentPoints(){
    if(RequestModuleService.demoMode) {
      return new Observable<Object>(observer => {
        observer.next(this.payPointsStub);
        observer.complete();
      });
    }
    else {
      return this.post(`${this.baseUrl}/payment/getAllCompanyBuildingPaymentPoints`, JSON.parse('{}'));
    }
  }

  /**
   * Function that sees if the device should receive access
   * @param body JSON containing info about device trying to gain access
   * @return Observable<Object> response containing json from back-end server 
   */
  attemptAccess(body: JSON){
    if(RequestModuleService.demoMode) {
      return new Observable<Object>(observer => {
        observer.next(this.grantAccessStub);
        observer.complete();
      });
    }
    else {
      return this.post(`${this.baseUrl}/access/getAccess`, body);
    }
  }

  /**
   * Function that tries to make a payment
   * @param body JSON containing info about device trying to make a payment
   * @return Observable<Object> response containing json from back-end server 
   */
  makePayment(body: JSON){
    if(RequestModuleService.demoMode) {
      return new Observable<Object>(observer => {
        observer.next(this.makePaymentStub);
        observer.complete();
      });
    }
    else {
      return this.post(`${this.baseUrl}/payment/makePayment`, body);
    }
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
    if (this.loadingModal) {
      this.loadingModal.dismiss();
      this.loadingModal = null;
    }
  }
}
