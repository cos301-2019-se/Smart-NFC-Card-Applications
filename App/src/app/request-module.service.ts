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
*
*	Functional Description:   This class provides a request service to the application that
*                           is used to make http requests to the back-end
*	Error Messages:   “Error”
*	Assumptions:  That you have an internet connection
*	Constraints: 	None
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
* Purpose:	This class provides the injectable service
*	Usage:		This class can be used to make http requests to the back-end by calling its public function
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Injectable({
  providedIn: 'root'
})
export class RequestModuleService {

  demoMode: boolean = false;
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

  /**
   * Constructor that takes all injectables
   * @param http HttpClient injectable
   */
  constructor(
    private http: HttpClient
  ) { }

  /**
   * Makes a get request using http
   * @param url string what to get
   * @return Observable response from get request
   */
  private get(url: string) {
    return this.http.get(url);
  }

  /**
   * Makes a post request using http
   * @param url string where to post to
   * @param body JSON data to send
   * @return Observable response from post request
   */
  private post(url: string, body: JSON) {
    return this.http.post(url, body);
  }

  /**
   * Function to login a user
   * @param username string user's username / email
   * @param password string user's password
   * @return JSON response from back-end server
   */
  login(username: string, password: string) {
    if(this.demoMode) {
      return this.loginStub;
    }
    else {
      let json: JSON = JSON.parse(`{ "username": "${username.trim()}", "password": "${password.trim()}" }`);
      return this.post(`${this.baseUrl}/app/login`, json);
    }
  }

  /**
   * Function to logout a user
   * @return JSON response from back-end server
   */
  logout() {
    if(this.demoMode) {
      return this.logoutStub;
    }
    else {
      //return this.get(`${this.baseUrl}/app/logout`);
      return this.logoutStub;
    }
  }

  /**
   * Function to check if user is logged in
   * @param api string stored api of the user
   * @return JSON response from back-end server
   */
  checkLoggedIn(api: string) {
    if(this.demoMode) {
      if(this.loginStub['data']['apiKey'] == api){
        return this.loginStub;
      }
      else {
        return this.logoutStub;
      }
    }
    else {
      return this.post(`${this.baseUrl}/app/checkLoggedIn`, JSON.parse(`{apiKey: ${api}}`));
    }
  }

  /**
   * Function to get business card data
   * @param employeeId number Employee's id to get his business card
   * @param apiKey string API Key to authenticate request
   * @return JSON response from back-end server
   */
  getBusinessCard(employeeId: number, apiKey: string) {
    if(this.demoMode) {
      return this.businessCardStub;
    }
    else {
      let json: JSON = JSON.parse(`{ "employeeId": ${employeeId}, "apiKey": "${apiKey}" }`);
      return this.post(`${this.baseUrl}/app/getBusinessCard`, json);
    }
  }
}