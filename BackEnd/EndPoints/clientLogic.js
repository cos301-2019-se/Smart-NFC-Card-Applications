/**
 *	File Name:	    clientLogic.js
 *	Project:		Smart-NFC-Application
 *	Orginization:	VastExpanse
 *	Copyright:	    © Copyright 2019 University of Pretoria
 *	Classes:        CrudController
 *	Related documents:
 *
 *	Update History:
 *	Date		Author		Version		Changes
 *	-----------------------------------------------------------------------------------------
 *	2019/07/27	Tjaart		1.0		    Original
 *
 *	Functional Description:		 This class is the interface used by the Outside Components of the Link System to 
 *                               make payments. This class performs all the validation checks necessary for performing transactions.
 *	Error Messages:
 *	Assumptions: 	This file assumes that a there exists a crudController to access the database and sharedLogic for common functions
 *
 *	Constraints: 	None
 */

/**
* 	Purpose:	This class facilitates Client Requests for clients without a profile
*	Usage:		This class allows the client to update visitor packages without a api key
*	@author:	Tjaart Booyens
*	@version:	1.0
*/


let SharedLogic = require('../SharedLogic/sharedLogic.js');

class ClientLogic {
    /**
     *  Constructor for the class that sets up certain properties as well as instantiate
     *  a new sharedLogic object.
     *
     *  @param req JSON Request sent from the application to the backend system
     *  @param res JSON Response sent back to the application
     */
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.sharedLogic = new SharedLogic(this);
        this.body = "{}";
        this.endpoint = "";
    }

    /**
    *  Function that is called by server.js and extracts the post body, parse it
    *  into json object, sets up the endpoint and calls the serve function.
    */
    handle() {
        this.constructBody(); //instead of using shared logic, just borrow some of the body construction logic
    }

    constructBody() {
        this.body = [];
        this.req
            .on('data', (chunk) => {
                this.body.push(chunk);
            })
            .on('end', () => {
                this.body = Buffer.concat(this.body).toString();
                this.convertBodyToJSON();
            });
    }

    /**
     * MODIFIED from shared logic version: no need for API KEY in client logic. MAC addresses are checked
     *  This function parses the String representation of the body into an object, assuming that the String
	 * 	is formatted as a JSON object. The result is a Javascript object, stored in this.from.body, which the
	 *	(Other)Logic classes can then use to their discretion. 
     */
    convertBodyToJSON() {
        if (this.body === "") {
            this.sharedLogic.endServe(false, "No POST body received", null);
        }
        else {
            try {
                this.body = JSON.parse(this.body);
                this.demoMode = this.body.demoMode;
                this.demoMode = this.body.demoMode;
                this.endpoint = this.req.url.substring(this.req.url.substring(1).indexOf("/") + 2);
                this.serve();
            }
            catch (e) {
                if (e instanceof SyntaxError) {
                    this.sharedLogic.endServe(false, "Invalid JSON object sent: " + e.message, null);
                }
                else {
                    throw e;
                }
            }
        }
    }

    serve() {
        switch (this.endpoint) {

            // Visitor Package
            case "getVisitorPackage":
                this.getVisitorPackage();
                break;

            default:
                this.sharedLogic.endServe(false, "Invalid Endpoint", null);
        }
    }

    /**
     *  Function to retrieve a visitor package
     *
     *  @param visitorPackageId int ID of visitor package
     *
     *  @return JSON {
     *                  visitorPackageId: int ID of the visitor package
     *                  companyName: string Name of company
     *                  latitude: string Latitude of building
     *                  longitude: string Longitude of building
     *                  branchName: string Name of building
     *                  ssid: string SSID of wifi access param
     *                  networkType: string Type of wifi access param
     *                  password: string Password of wifi access param
     *                  roomName: string Name of the room
     *                  startTime: date Start date of the visitor package
     *                  endTime: date End date of the visitor package
     *                  limit: double Limit for the client
     *                  spent: amount the client spent
     *               }
     */
    async getVisitorPackage(){
        let success;
        let message;
        let data = {};

        let presentParams = false;
        let presentReturn = "";

        if(this.body.macAddress === undefined){
            presentParams = true;
            presentReturn += "macAddress, ";
        }

        if(this.body.visitorPackageId === undefined){
            presentParams = true;
            presentReturn += "visitorPackageId, ";
        }

        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";

            if(!this.sharedLogic.validateNonEmpty(this.body.macAddress)){
                invalidParams = true;
                invalidReturn += "macAddress, ";
            }

            if(!this.sharedLogic.validateNonEmpty(this.body.visitorPackageId)){
                invalidParams = true;
                invalidReturn += "visitorPackageId, ";
            }

            if(!invalidParams) {
                if(this.demoMode){
                    data.companyName = "Vast Expanse";
                    data.latitude = "2000";
                    data.longitude = "2000";
                    data.branchName = "Pretoria";
                    data.ssid = "Vast Expanse";
                    data.networkType = "WPA";
                    data.password = "test";
                    data.roomName = "room1";
                    data.startTime = "10:00";
                    data.endTime = "10:00";
                    data.limit = "100.00";
                    data.spent = "50.00";
                    this.sharedLogic.endServe(true, "Retrieved Visitor Package - MOCK", data);
                }
                else{
                    let valid = await this.validateMacAddress(this.body.macAddress, this.body.visitorPackageId);

                    if(valid){
                        data = await this.visitorPackage(this.body.visitorPackageId);
                        this.sharedLogic.endServe(true, "Retrieved Visitor Package", data);
                    }
                    else{
                        this.sharedLogic.endServe(true, "Invalid Mac Address", {});
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: " + invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: " + presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     *  Function to retrieve a visitor package
     *
     *  @param visitorPackageId int ID of visitor package
     * 
     *  @return JSON {
     *                  visitorPackageId: int ID of visitorPackage
     *                  companyName: string Name of company
     *                  latitude: string Latitude of building
     *                  longitude: string Longitude of building
     *                  branchName: string Name of building
     *                  ssid: string SSID of wifi access param
     *                  networkType: string Type of wifi access param
     *                  password: string Password of wifi access param
     *                  roomName: string Name of the room
     *                  startTime: date Start date of the visitor package
     *                  endTime: date End date of the visitor package
     *                  limit: double Limit for the client
     *                  spent: amount the client spent
     *               }
     */
    async visitorPackage(visitorPackageId){
        let data = {};

        let visitorPackageData = await this.sharedLogic.crudController.getVisitorPackageByVisitorPackageId(visitorPackageId);

        if(visitorPackageData.success){

            if(this.isVisitorPackageActive(visitorPackageData.data.endTime)){
                data.visitorPackageId = visitorPackageId;

                let employeeData = await this.sharedLogic.crudController.getEmployeeByEmployeeId(visitorPackageData.data.employeeId);

                if(employeeData.success){
                    let companyData = await this.sharedLogic.crudController.getCompanyByCompanyId(employeeData.data.companyId);

                    if(companyData.success){
                        data.companyName = companyData.data.companyName;
                    }

                    let buildingData = await this.sharedLogic.crudController.getBuildingByBuildingId(employeeData.data.buildingId);

                    if(buildingData.success){
                        let wifiData = await this.sharedLogic.crudController.getWiFiParamsByWifiParamsId(buildingData.data.wifiParamsId);

                        if(wifiData.success){

                            if(visitorPackageData.data.tempWifiAccessId != null){
                                data.ssid = wifiData.data.ssid;
                                data.networkType = wifiData.data.networkType;
                                data.password = wifiData.data.password;
                            }
                        }

                        data.branchName = buildingData.data.branchName;
                        data.latitude = buildingData.data.latitude;
                        data.longitude = buildingData.data.longitude;
                    }
                }

                if(visitorPackageData.data.tpaId != null){
                    let tpaRoomData = await this.sharedLogic.crudController.getTPAxRoomsByTpaId(visitorPackageData.data.tpaId);

                    if(tpaRoomData.success){
                        let roomData =  await this.sharedLogic.crudController.getRoomByRoomId(tpaRoomData.data[tpaRoomData.data.length-1].roomId);

                        if(roomData.success){
                            data.roomName = roomData.data.roomName;
                        }
                    }
                }

                if(visitorPackageData.data.linkWalletId != null){
                    let walletData = await this.sharedLogic.crudController.getWalletByLinkWalletId(visitorPackageData.data.linkWalletId);

                    if(walletData.success){
                        data.limit = walletData.data.maxLimit;
                        data.spent = walletData.data.spent;
                    }
                }

                data.startTime = visitorPackageData.data.startTime;
                data.endTime = visitorPackageData.data.endTime;
            }
        }
        return data;
    }

    /**
     * Function to check if the visitor package is active or not
     *
     * @param eDate date End date of the visitor package
     * @return {boolean}
     */
    isVisitorPackageActive(eDate) {
        let endDate = new Date(eDate);
        let currentDate = new Date();
        if (currentDate > endDate) {
            return false;
        }
        return true;
    }

    /**
     * Function to see if the visitor package and mac address are linked
     * @param macAddress
     * @param visitorPackageId
     */
    async validateMacAddress(macAddress, visitorPackageId) {
        let clientMacData = await this.sharedLogic.crudController.getClientByMacAddress(macAddress);

        if(clientMacData.success){
            let visitorPackageData = await this.sharedLogic.crudController.getVisitorPackageByVisitorPackageId(visitorPackageId);

            if(visitorPackageData.success){
                let clientIdData = await this.sharedLogic.crudController.getClientByClientId(visitorPackageData.data.clientId);

                if(clientIdData.success){
                    return clientMacData.data.clientId === clientIdData.data.clientId && clientMacData.data.macAddress === clientIdData.data.macAddress;
                }
            }
        }
    }
}

module.exports = ClientLogic;
