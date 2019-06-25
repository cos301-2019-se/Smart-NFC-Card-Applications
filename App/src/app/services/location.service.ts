/**
*	File Name:	    location.service.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      LocationService
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/06/25	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the location service to other components
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator/ngx';
import { LocationModel } from '../models/location.model';

/**
* Purpose:	This class provides the location service injectable
*	Usage:		This class can be used to open a navigation app of your choice with the start -and destination point is already set
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@Injectable({
  providedIn: 'root'
})
export class LocationService {

  /**
   * Constructor that takes all injectables
   * @param geolocation Geolocation injectable
   * @param launchNavigator LaunchNavigator injectable
   */
  constructor (
    private geolocation: Geolocation, 
    private launchNavigator: LaunchNavigator
  ) { }

  /**
   * Function that launches your default navigator app with the source and destination already set
   * @param source LocationModel where to start
   * @param destination LocationModel where to end
   * @return Promise<any> of the navigator launch
   */
  getDirections(source: LocationModel, destination: LocationModel){
    let options: LaunchNavigatorOptions = {
      start: [source.getLatitude(), source.getLongitude()]
    };
    return this.launchNavigator.navigate([destination.getLatitude(), destination.getLongitude()], options)
  }

  /**
   * Function that gets your current position
   * @return Promise<Geolocation> of the current position
   */
  getCurrentPosition(){
    return this.geolocation.getCurrentPosition();
  }

  /**
   * Function that gets your current position and gives you directions to the given latitude and longitude
   * @param latitude number latitude of the destination
   * @param longitude number longitude of the destination
   * @param accept Function that should trigger if it can navigate you
   * @param reject Function that should trigger if it cannot navigate you
   */
  navigate(latitude: number, longitude: number, accept: Function, reject: Function){
    let source: LocationModel;
    let destination: LocationModel = new LocationModel(latitude, longitude);
    this.getCurrentPosition()
    .then(res => {
      source = new LocationModel(res.coords.latitude, res.coords.longitude);
      return this.getDirections(source, destination);
    }).catch(err => reject(err))    
    .then(accept()).catch(err => reject(err))
    
  }
}
