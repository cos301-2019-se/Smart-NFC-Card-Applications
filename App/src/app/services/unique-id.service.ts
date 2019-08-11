/**
*	File Name:	    unique-id.service.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      UniqueIdService
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/08/11	Wian		  1.0		    Original
*
*	Functional Description:   This service is used to get the one of the device's unique id's
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/
import { Injectable } from '@angular/core';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

/**
* Purpose:	This class provides the other components a way to get the device's MAC
*	Usage:		This class can injected as a service and its getUniqueId can be called
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Injectable({
  providedIn: 'root'
})
export class UniqueIdService {

  private idType: string = 'UUID';

  /**
   * Function that takes all the injectables and constructs the service
   * @param uid Uid injectable
   * @param androidPermissions AndroidPermissions injectable 
   */
  constructor(
    private uid: Uid,
    private androidPermissions: AndroidPermissions
  ) {
    this.getPermission();
  }

  /**
   * Function that returns the unique ID according to the idType constant
   * @return string unique ID
   */
  getUniqueId(){
    switch(this.idType) {
      case "IMEI":
        return this.uid.IMEI;
      case "ICCID":
        return this.uid.ICCID;
      case "IMSI":
        return this.uid.IMSI;
      case "MAC":
        return this.uid.MAC;
      case "UUID":
        return this.uid.UUID;
    }
  }

  /**
   * Function that gets the permission for reading the phone state
   */
  private getPermission(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE)
    .then(res => {
      if(res.hasPermission) {
        // TODO: Handle Case when permission was granted
      }
      else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(res => {
          // App has to be restarted before deviceIDs can be fetched
          // TODO: Handle Case when permission was granted
        }).catch(error => {
          // TODO: Handle Error
        });
      }
    }).catch(error => {
      // TODO: Handle Error
    });
  }
}
