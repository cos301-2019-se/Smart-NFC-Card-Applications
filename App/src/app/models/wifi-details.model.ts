/**
*	File Name:	        wifi-details.model.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	    VastExpanse
*	Copyright:	        © Copyright 2019 University of Pretoria
*	Classes:	        WifiDetailsModel
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/07/13	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the wifi details model
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

/**
*   Purpose:	This class provides the WifiDetails model
*	Usage:		This class can be used to store wifi details of the employee's building
*	@author:	Wian du Plooy
*	@version:	1.0
*/
export class WifiDetailsModel {    
    private id: number;
    private ssid: string;
    private type: string;
    private password: string;

    /**
     * Function that creates WifiDetails objects
     * @param id number id as in database (wifiAccessParamsId)
     * @param ssid string name of the wifi network
     * @param type string algorithm of the wifi network
     * @param password string password of the wifi network
     */
    constructor(id: number, ssid: string, type: string, password: string){
        this.id = id;
        this.ssid = ssid;
        this.type = type;
        this.password = password;
    }

    /**
     * Function that return the id of the Wifi Details
     * @return number id
     */
    getId(){
        return this.id;
    }

    /**
     * Function that return the ssid of the Wifi Details
     * @return string ssid
     */
    getSsid(){
        return this.ssid;
    }

    /**
     * Function that return the type of the Wifi Details
     * @return string type
     */
    getType(){
        return this.type;
    }

    /**
     * Function that return the password of the Wifi Details
     * @return string password
     */
    getPassword(){
        return this.password;
    }
}