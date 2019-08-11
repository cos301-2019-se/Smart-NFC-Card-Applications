/**
 *	File Name:	    accessLogic.js
 *	Project:		Smart-NFC-Application
 *	Orginization:	VastExpanse
 *	Copyright:	    © Copyright 2019 University of Pretoria
 *	Classes:        accessLogic
 *	Related documents:
 *
 *	Update History:
 *	Date		Author		Version		Changes
 *	-----------------------------------------------------------------------------------------
 *	2019/07/27	Duncan		1.0		    Original
 *
 *	Functional Description:		 This class will be used by the Link mobile app to allow access to certain rooms in a building
 *	Error Messages:
 *	Assumptions: 	This file assumes that a there exists a crudController to access the database and sharedLogic for common functions
 *
 *	Constraints: 	None
 */

/**
 * 	Purpose:	This class facilitates NFC Access Points
 *	Usage:		This class allows the caller to get access to certain rooms which he/she is permitted access to
 *	@author:	Duncan Vodden
 *	@version:	1.0
 */

let SharedLogic = require('./../SharedLogic/sharedLogic.js');

class AccessLogic {
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
     * MODIFIED from shared logic version: no need for API KEY in payment logic. MAC addresses are checked
     *  This function parses the String representation of the body into an object, assuming that the String]
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
            case "getAccess":
                this.getAccess();
                break;

            case "getAllCompanyBuildingRooms":
                this.getAllCompanyBuildingRooms();
                break;

            default:
                this.sharedLogic.endServe(false, "Invalid Endpoint", null);
        }
    }



    /**
     * Function used to get access to a given room
     * @param roomId int The ID of the NFC payment point to pay
     * @param visitorPackageId int The ID of the visitorPackage
     * @param macAddress string The unique identifier for the client
     */
    async getAccess() {

        let message;
        let data = new Object();
        let success;

        //check to see if parameters are present
        let presentParams = false;
        let presentReturn = "";

        if(this.body.roomId === undefined){
            presentParams = true;
            presentReturn += "roomId, ";
        }
        if(this.body.visitorPackageId === undefined){
            presentParams = true;
            presentReturn += "visitorPackageId, ";
        }
        if(this.body.macAddress === undefined){
            presentParams = true;
            presentReturn += "macAddress, ";
        }

        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";

            if(!this.sharedLogic.validateNonEmpty(this.body.roomId) || !this.sharedLogic.validateNumeric(this.body.roomId)){
                invalidParams = true;
                invalidReturn += "roomId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.visitorPackageId)  || !this.sharedLogic.validateNumeric(this.body.visitorPackageId)){
                invalidParams = true;
                invalidReturn += "visitorPackageId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.macAddress)){
                invalidParams = true;
                invalidReturn += "macAddress, ";
            }

            if(!invalidParams){

                if(this.demoMode){
                    message = " Access Allowed ! - Mock";
                    success = true;
                    this.sharedLogic.endServe(success, message, {});
                }
                else{
                    //fetch the visitor package
                    let visitorPackage = await this.sharedLogic.crudController.getVisitorPackageByVisitorPackageId(this.body.visitorPackageId);
                    if (!visitorPackage.success){
                        return this.sharedLogic.endServe(false, visitorPackage.message, null);
                    }

                    if (this.isVisitorPackageExpired(visitorPackage.data.startTime, visitorPackage.data.endTime)){
                        return this.sharedLogic.endServe(false, "Visitor Package has expired", null);
                    }

                    //now that it is certain the package is not expired, proceed to validate the package
                    let clientDetails = await this.sharedLogic.crudController.getClientByClientId(visitorPackage.data.clientId);
                    if (!clientDetails.success)
                        return this.sharedLogic.endServe(false, clientDetails.message, null);

                    //check mac address
                    if (clientDetails.data.macAddress.toUpperCase() !== this.body.macAddress.toUpperCase())
                        return this.sharedLogic.endServe(false, "Mac Address of device does not match the client of the wallet", null);

                    let accessDetails = await this.sharedLogic.crudController.getTPAxRoomsByTpaId(visitorPackage.data.tpaId);
                    if (!accessDetails.success)
                        return this.sharedLogic.endServe(false, accessDetails.message, null);

                    let tpaAndRoomsArray = accessDetails.data;
                    if (tpaAndRoomsArray.length === 0)
                        return this.sharedLogic.endServe(false, "No rooms found which this visitor package can access", null);

                    let hasAccess = false;
                    for(let countRooms = 0; countRooms<tpaAndRoomsArray.length; countRooms++){
                        if(tpaAndRoomsArray[countRooms].roomId === this.body.roomId){
                            hasAccess = true;
                            break;
                        }
                    }

                    if(hasAccess){
                        return this.sharedLogic.endServe(true, "Access Granted", {});
                    }
                    else{
                        return this.sharedLogic.endServe(false, "No Access Granted", null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                return this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            return this.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * Function used by access simulator to get all companies, buildings rooms
     * NB THIS FUNCTION IS ONLY FOR DEMONSTATION OF ACCESS CONTROL PURPOSES
     */
    async getAllCompanyBuildingRooms(){
        let dataArray = [];
        let companies = await this.sharedLogic.crudController.getAllCompanies();
        if(!companies)
            return this.sharedLogic.endServe(companies.success, companies.message, null);
        companies = companies.data;
        //get all companies
        for(let countCompanies = 0; countCompanies<companies.length;countCompanies++){
            dataArray.push({});
            dataArray[countCompanies].companyName = companies[countCompanies].companyName;
            dataArray[countCompanies].companyId = companies[countCompanies].companyId;
            dataArray[countCompanies].buildings = [];

            //get all buildings
            let buildings = await this.sharedLogic.crudController.getBuildingsByCompanyId(companies[countCompanies].companyId);
            if(buildings.success){
                buildings = buildings.data;
                for(let countBuildings = 0; countBuildings<buildings.length; countBuildings++){
                    dataArray[countCompanies].buildings.push({});
                    dataArray[countCompanies].buildings[countBuildings].buildingId = buildings[countBuildings].buildingId;
                    dataArray[countCompanies].buildings[countBuildings].buildingName = buildings[countBuildings].branchName;
                    dataArray[countCompanies].buildings[countBuildings].rooms = [];

                    //get all rooms
                    let rooms = await this.sharedLogic.crudController.getRoomsByBuildingId(buildings[countBuildings].buildingId);
                    if(rooms.success){
                        rooms = rooms.data;
                        for(let countRooms = 0; countRooms<rooms.length; countRooms++){
                            dataArray[countCompanies].buildings[countBuildings].rooms.push({});
                            dataArray[countCompanies].buildings[countBuildings].rooms[countRooms].roomId = rooms[countRooms].roomId;
                            dataArray[countCompanies].buildings[countBuildings].rooms[countRooms].roomName = rooms[countRooms].roomName;
                        }
                    }
                }
            }
        }
        this.sharedLogic.endServe(true,"All Data retrieved", dataArray);

    }

    isVisitorPackageExpired(sDate,eDate) {
        var startDate = new Date(sDate);
        var endDate = new Date(eDate);
        var currentDate = new Date();
        if (currentDate > endDate || currentDate < startDate) {
            return true;
        }
        return false;
    }

    validateMacAddress(mac) {
        if (/^[0-9a-f]{1,2}([\.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}$/i.test(mac)) {
            return true;
        }
        return false;
    }
}

module.exports = AccessLogic;
