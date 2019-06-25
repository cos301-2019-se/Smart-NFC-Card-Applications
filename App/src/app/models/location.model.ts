/**
*	File Name:	        location.model.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	    VastExpanse
*	Copyright:	        © Copyright 2019 University of Pretoria
*	Classes:	        LocationModel
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/06/25	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the location model
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

/**
*   Purpose:	This class provides the LocationModel model
*	Usage:		This class can be used to generate location objects
*	@author:	Wian du Plooy
*	@version:	1.0
*/
export class LocationModel {    
    private latitude: number = 0;
    private longitude: number = 0;

    /**
     * Function constructs a location object
     * @param _latitude number to set as latitude
     * @param _longitude number to set as longitude
     * @return LocationModel object
     */
    constructor(_latitude: number, _longitude: number){
        this.setLatitude(_latitude);
        this.setLongitude(_longitude);
    }

    /**
     * Setter for latitude
     * @param _latitude number to set as latitude 
     */
    setLatitude(_latitude: number){
        this.latitude = _latitude;
    }

    /**
     * Setter for longitude
     * @param _longitude number to set as latitude 
     */
    setLongitude(_longitude: number){
        this.longitude = _longitude;
    }

    /**
     * Getter for latitude
     * @return number latitude
     */
    getLatitude(){
        return this.latitude;
    }

    /**
     * Getter for longitude
     * @return number longitude
     */
    getLongitude(){
        return this.longitude;
    }
}