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

  loadingModal: HTMLIonLoadingElement; 
  baseUrl: string = "https://smart-nfc-application.herokuapp.com";

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
