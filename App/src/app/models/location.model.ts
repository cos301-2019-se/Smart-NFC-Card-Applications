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
    private label: string = "";

    /**
     * Function constructs a location object
     * @param latitude number to set as latitude
     * @param longitude number to set as longitude
     * @return LocationModel object
     */
    constructor(latitude: number, longitude: number, label: string){
        this.setLatitude(latitude);
        this.setLongitude(longitude);
        this.setLabel(label);
    }

    /**
     * Setter for latitude
     * @param latitude number to set as latitude 
     */
    setLatitude(latitude: number){
        this.latitude = latitude;
    }

    /**
     * Setter for longitude
     * @param longitude number to set as latitude 
     */
    setLongitude(longitude: number){
        this.longitude = longitude;
    }

    /**
     * Setter for label
     * @param label string to set as the label 
     */
    setLabel(label: string){
        this.label = label;
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

    /**
     * Getter for label
     * @return string label
     */
    getLabel(){
        return this.label;
    }
}