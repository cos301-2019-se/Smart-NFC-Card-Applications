/**
*	File Name:	    wifi.service.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      WifiService
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/06/25	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the wifi service to other components
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { Injectable } from '@angular/core';
declare var WifiWizard2: any;

/**
* Purpose:	This class provides the wifi service injectable
*	Usage:		This class can be used to connect to wifi hotspots given the correct SSID and Password
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Injectable({
  providedIn: 'root'
})
export class WifiService {

  private hotspot = (typeof WifiWizard2 === 'undefined') ?  null : WifiWizard2;
  constructor() {}

  /**
   * Function that connects device to a WiFi network
   * @param ssid string network name
   * @param password string network password
   * @param algorithm string algorithm type used (WPA, WPA2, or WEP)
   * @return Promise<void> whether or not connected
   */
  async connectToWifi(ssid: string, password: string, algorithm: string){
    if (this.hotspot == null || this.hotspot == undefined) {
      return new Promise(() => {
        console.log('WiFi Service Down');
      });
    }
    algorithm = algorithm == "WPA2"? "WPA" : algorithm;
    console.log(ssid, password, algorithm);
    return await this.hotspot.connect(ssid, null, password, algorithm, false)
  }

  /**
   * Function that checks if device WiFi is on
   * @return boolean whether or not it is on
   */
  isOn(){
    if (this.hotspot == null || this.hotspot == undefined) {
      return new Promise(() => {
        console.log('WiFi Service Down');
      });
    }
    return this.hotspot.isWifiEnabled();
  }

  /**
   * Function that toggles device WiFi on/off
   * @param enabled boolean whether or not you want the wifi on or off
   */
  setWifiStatus(enabled: boolean){
    if (this.hotspot == null || this.hotspot == undefined) {
      console.log('WiFi Service Down');
      return;
    }
    this.hotspot.setWifiEnabled(enabled);
  }
}
