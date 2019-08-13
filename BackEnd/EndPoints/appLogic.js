/**
 *	File Name:      appLogic.js
 *	Project:        Smart-NFC-Application
 *	Organization:	VastExpanse
 *	Copyright:	    © Copyright 2019 University of Pretoria
 *	Classes:	    AppLogic
 *	Related documents:
 *
 *	Update History:
 *	Date		Author		Version		Changes
 *	-----------------------------------------------------------------------------------------
 *	2019/05/19	Tjaart		1.0		    Original
 *  2019/06/24  Tjaart      2.0         Added functions for demo 3
 *  2019/08/04  Tjaart      2.1         Extended the addTpaRoom function
 *
 *	Functional Description:	This class handles the functionality that will be requested by the
 *                          application to the backend system. It handles functionality like
 *                          when a user requests a business card from the server.
 *	Error Messages: None
 *	Assumptions:    None
 *	Constraints:    None
 */

const SharedLogic = require("./../SharedLogic/sharedLogic.js");

/**
 * 	Purpose:    This class handles the functionality that will be requested by the
 *              application to the backend system.
 *	Usage:		This class can be used to retrieve details from the backend system
 *              in order to generate a business card.
 *	@author:	Tjaart Booyens
 *	@version:	1.0
 */
class AppLogic{
    /**
     *  Constructor for the class that sets up certain properties as well as instantiate
     *  a new sharedLogic object.
     *
     *  @param req JSON Request sent from the application to the backend system
     *  @param res JSON Response sent back to the application
     */
    constructor(req, res){
        this.req = req;
        this.res = res;
        this.sharedLogic = new SharedLogic(this);
        this.body = "{}";
        this.endpoint = "";
    }

    /**
     *  Function that is called by server.js and extracts the post body, parse it
     *  into json object and validate the api key, sets up the endpoint and
     *  afterwards calls the serve function.
     */
    handle(){
        this.sharedLogic.initialHandle();
    }

    /**
     *  Function to handle the business logic of the class. It is called automatically
     *  once initialHandle() was successful. It calls endServe() in the sharedLogic
     *  class to return the response.
     */
    serve(){
        switch(this.endpoint){
            // Business Card
            case "getBusinessCard":
                this.getBusinessCard();
                break;

            // Employee Details
            case "getEmployeeDetails":
                this.getEmployeeDetails();
                break;

            // Visitor Package
            case "addVisitorPackage":
                this.addVisitorPackage();
                break;
            case "editVisitorPackage":
                this.editVisitorPackage();
                break;
            case "getVisitorPackage":
                this.getVisitorPackage();
                break;
            case "getVisitorPackages":
                this.getVisitorPackages();
                break;

            default:
                this.sharedLogic.endServe(false, "Invalid Endpoint", null);
        }
    }

    /**
     *  Function that returns the information needed to generate a business card for
     *  the user who requested it.
     *
     *  @param employeeId int ID of an employee
     *
     *  @return JSON {
     *                  businessCardId: string Concatenation of company and employee ID
     *                  companyName: string Name of the company
     *                  companyWebsite: string Link to the company's website
     *                  branchName: string Name of company branch
     *                  latitude: string Latitude value of building
     *                  longitude: string Longitude value of building
     *                  employeeName: string Name of the employee
     *                  employeeSurname: string Surname of the employee
     *                  employeeTitle: string Title of the employee
     *                  employeeCellphone: string Cellphone number of the employee
     *                  employeeEmail: string Email of the employee
     *               }
     */
    async getBusinessCard(){
        let success;
        let message;
        let data = {};

        let presentParams = false;
        let presentReturn = "";

        if(this.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }

        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";

            if(!this.sharedLogic.validateNonEmpty(this.body.employeeId)){
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }

            if(!invalidParams) {
                if(this.demoMode){
                    data.businessCardId = "0_0";
                    data.companyName = "Vast Expanse";
                    data.companyWebsite = "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications";
                    data.branchName = "University of Pretoria";
                    data.latitude = "10";
                    data.longitude = "11";
                    data.employeeName = "Tjaart";
                    data.employeeSurname = "Booyens";
                    data.employeeTitle = "Mr";
                    data.employeeCellphone = "0791807734";
                    data.employeeEmail = "u17021775@tuks.co.za";
                    this.sharedLogic.endServe(true, "Business card information loaded successfully - MOCK", data);
                }
                else{
                    let employeeData = await this.sharedLogic.crudController.getEmployeeByEmployeeId(this.body.employeeId);

                    if(employeeData.success){
                        let companyData = await this.sharedLogic.crudController.getCompanyByCompanyId(employeeData.data.companyId);

                        if(companyData.success){
                            let buildingData = await this.sharedLogic.crudController.getBuildingByBuildingId(employeeData.data.buildingId);

                            if(buildingData.success){
                                data.businessCardId = companyData.data.companyId + "_" + employeeData.data.employeeId;
                                data.companyName = companyData.data.companyName;
                                data.companyWebsite = companyData.data.companyWebsite;
                                data.branchName = buildingData.data.branchName;
                                data.latitude = buildingData.data.latitude;
                                data.longitude = buildingData.data.longitude;
                                data.employeeName = employeeData.data.firstName;
                                data.employeeSurname = employeeData.data.surname;
                                data.employeeTitle = employeeData.data.title;
                                data.employeeCellphone = employeeData.data.cellphone;
                                data.employeeEmail = employeeData.data.email;
                                this.sharedLogic.endServe(true, "Business card information loaded successfully", data);
                            }
                            else{
                                this.sharedLogic.endServe(buildingData.success, buildingData.message, buildingData.data);
                            }
                        }
                        else{
                            this.sharedLogic.endServe(companyData.success, companyData.message, companyData.data);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(employeeData.success, employeeData.message, employeeData.data);
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
     *  Function that returns only the employee details.
     *
     *  @param employeeId int ID of an employee
     *
     *  @return JSON {
     *                  building: JSON {
     *                                      buildingId: int ID of building
     *                                      latitude: string Latitude of building
     *                                      longitude: string Longitude of building
     *                                      branchName: string Name of building
     *                                 }
     *                  rooms: Array of JSON objects {
     *                                                  roomId: int ID of room
     *                                                  roomName: string Name of the room
     *                                                  parentRoomList: string List of parent rooms to the room
     *                                               }
     *                  wifi: JSON {
     *                                  wifiAccessParamsId: int ID of wifi access param
     *                                  ssid: string SSID of wifi access param
     *                                  networkType: string Type of wifi access param
     *                                  password: string Password of wifi access param
     *                             }
     *               }
     */
    async getEmployeeDetails(){
        let success;
        let message;
        let data = {};

        let presentParams = false;
        let presentReturn = "";

        if(this.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }

        if(!presentParams) {
            let invalidParams = false;
            let invalidReturn = "";

            if (!this.sharedLogic.validateNonEmpty(this.body.employeeId)) {
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }

            if(!invalidParams) {
                if(this.demoMode){
                    success = true;
                    message = "Successfully retrieved employee details - Mock";
                    data.building = {};
                    data.rooms = [];
                    data.wifi = {};

                    data.building.buildingId = 0;
                    data.building.latitude = "10";
                    data.building.longitude = "11";
                    data.building.branchName = "Mock Building";
                    data.rooms.push({roomId: 0,
                                     roomName: "Mock Room",
                                     parentRoomList: ""});
                    data.rooms.push({roomId: 1,
                                     roomName: "Mock Room 2",
                                     parentRoomList: "0"});
                    data.wifi.wifiAccessParamsId = 0;
                    data.wifi.ssid = "Mock Wifi";
                    data.wifi.networkType = "WPA";
                    data.wifi.password = "MockPass";
                    this.sharedLogic.endServe(success, message, data);
                }
                else {
                    let employee = await this.sharedLogic.crudController.getEmployeeByEmployeeId(this.body.employeeId);

                    if(employee.success){
                        let building = await this.sharedLogic.crudController.getBuildingByBuildingId(employee.data.buildingId);

                        if(building.success){
                            let rooms = await this.sharedLogic.crudController.getRoomsByBuildingId(employee.data.buildingId);

                            if(rooms.success){
                                let wifi = await this.sharedLogic.crudController.getWiFiParamsByWifiParamsId(building.data.wifiParamsId);

                                if(wifi.success){
                                    success = true;
                                    message = "Successfully retrieved employee details";
                                    data.building = building.data;
                                    data.rooms = rooms.data;
                                    data.wifi = wifi.data;
                                    this.sharedLogic.endServe(success, message, data);
                                }
                                else{
                                    this.sharedLogic.endServe(wifi.success, wifi.message, wifi.data);
                                }
                            }
                            else{
                                this.sharedLogic.endServe(rooms.success, rooms.message, rooms.data);
                            }
                        }
                        else{
                            this.sharedLogic.endServe(building.success, building.message, building.data);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(employee.success, employee.message, employee.data);
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
     *  Function that creates a new client and adds it to the database
     *
     *  @param macAddress string Mac Address of client device
     *
     *  @return JSON {
     *                  clientId: int ID for client
     *               }
     */
    async addClient(macAddress) {
        let data = {};

        if(this.demoMode){
            data.clientId = 0;
        }
        else{
            let ret = await this.sharedLogic.crudController.createClient(macAddress);

            if(ret.success){
                data.clientId = ret.data.clientId;
            }
            else{
                this.sharedLogic.endServe(ret.success, ret.message, ret.data);
            }
        }

        return data;
    }

    /**
     *  Function to return a client object
     *
     *  @param clientId int ID of client
     *
     *  @return JSON {
     *                  clientId: int ID of client
     *                  macAddress: string Mac Address of client device
     *               }
     */
    async getClient(clientId){
        let data = {};
        if(this.demoMode){
            data.clientId = 0;
            data.macAddress = "0";
        }
        else{
            let ret = await this.sharedLogic.crudController.getClientByClientId(clientId);

            if(ret.success){
                data.clientId = ret.data.clientId;
                data.macAddress = ret.data.macAddress;
            }
            else{
                this.sharedLogic.endServe(ret.success, ret.message, ret.data);
            }
        }
        return data;
    }

    /**
     *  Function to delete a client from the database
     *
     *  @param clientId int ID of client
     *
     *  @return JSON {
     *                  clientId: int ID of client
     *               }
     *
     *  @TODO complete
     */
    deleteClient(clientId){
        let data = {};
        if(this.demoMode){
            data;
        }
        else{
            this.sharedLogic.crudController.deleteClient(clientId, function (ret) {
                data = ret.data;
            });
        }
        return data;
    }

    /**
     *  Function to add temporary wifi access
     *
     *  @param wifiAccessParamsId int ID of WiFi access point
     *
     *  @return JSON {
     *                  wifiTempAccessId: int ID of temporary wifi access detail
     *               }
     */
    async addTempWifi(wifiAccessParamsId){
        let data = {};

        if(this.demoMode){
            data.wifiTempAccessId = 0;
        }
        else{
            let ret = await this.sharedLogic.crudController.createTempWifiAccess(wifiAccessParamsId);

            if(ret.success){
                data.wifiTempAccessId = ret.data.tempWifiAccessId
            }
            else{
                this.sharedLogic.endServe(ret.success, ret.message, ret.data);
            }
        }

        return data;
    }

    /**
     *  Function to edit temporary wifi access
     *
     *  @param wifiAccessParamsId int ID of WiFi access point
     *  @param wifiTempAccessId int ID of temporary wifi access
     *
     *  @return JSON {
     *                  wifiTempAccessId: int ID of temporary wifi access
     *               }
     */
    async editTempWifi(wifiTempAccessId, wifiAccessParamsId){
        let data = {};

        if(this.demoMode){
            data.wifiTempAccessId = 0;
        }
        else{
            let ret = await this.sharedLogic.crudController.updateTempWifiAccess(wifiTempAccessId, wifiAccessParamsId);

            if(ret.success){
                data.wifiTempAccessId = wifiTempAccessId;
            }
            else{
                this.sharedLogic.endServe(ret.success, ret.message, ret.data);
            }
        }

        return data;
    }

    /**
     *  Function to get temporary wifi access
     *
     *  @param wifiTempAccessId int ID of temporary wifi access
     *
     *  @return JSON {
     *                  wifiTempAccessId: ID of temporary wifi access
     *                  wifiAccessParamsId: ID of WiFi access point
     *               }
     */
    async getTempWifi(wifiTempAccessId){
        let data = {};

        if(this.demoMode){
            data.wifiTempAccessId = 0;
            data.wifiAccessParamsId = 0;
        }
        else{
            let ret = await this.sharedLogic.crudController.getTempWifiAccessByTempWifiAccessId(wifiTempAccessId);

            if(ret.success){
                data.wifiTempAccessId = ret.data.tempWifiAccessId;
                data.wifiAccessParamsId = ret.data.wifiParamsId;
            }
            else{
                this.sharedLogic.endServe(ret.success, ret.message, ret.data);
            }
        }

        return data;
    }

    /**
     *  Function to delete temporary wifi access
     *
     *  @param wifiTempAccessId int ID of temporary wifi access
     *
     *  @return JSON {
     *                  wifiTempAccess: int ID of temporary wifi access
     *               }
     *
     *  @TODO complete
     */
    deleteTempWifi(wifiTempAccessId){
        let data = {};
        if(this.demoMode){
            data;
        }
        else{
            this.sharedLogic.crudController.deleteTempWifiAccess(wifiTempAccessId, function (ret) {
                data = ret.data;
            });
        }
        return data;
    }

    /**
     *  Function to add a wallet
     *
     *  @param limit float Limit a customer can spend
     *  @param spent float Amount spent by customer
     *
     *  @return JSON {
     *                  walletId: int ID of customer wallet
     *               }
     */
    async addWallet(limit, spent){
        let data = {};

        if(this.demoMode){
            data.walletId = 0;
        }
        else{
            let ret = await this.sharedLogic.crudController.createWallet(limit, spent);

            if(ret.success){
                data.walletId = ret.data.linkWalletId;
            }
            else{
                this.sharedLogic.endServe(ret.success, ret.message, ret.data);
            }
        }

        return data;
    }

    /**
     *  Function to edit wallet details
     *
     *  @param walletId int ID of the wallet to update
     *  @param limit float Limit a customer can spend
     *
     *  @return JSON {
     *                  walletId: int ID of the wallet to update
     *               }
     */
    async editWallet(walletId, limit){
        let data = {};

        if(this.demoMode){
            data.walletId = 0;
        }
        else{
            let ret = await this.sharedLogic.crudController.updateWallet(walletId, limit, undefined);

            if(ret.success){
                data.walletId = walletId;
            }
            else{
                this.sharedLogic.endServe(ret.success, ret.message, ret.data);
            }
        }

        return data;
    }

    /**
     *  Function to retrieve wallet details
     *
     *  @param walletId int ID of the wallet to update
     *
     *  @return JSON {
     *                  walletId: int ID of wallet
     *                  limit: float Limit of the wallet
     *                  spent: float Amount spent on the wallet
     *               }
     */
    async getWallet(walletId){
        let data = {};
        if(this.demoMode){
            data.walletId = 0;
            data.limit = 0;
            data.spent = 0;
        }
        else{
            let ret = await this.sharedLogic.crudController.getWalletByLinkWalletId(walletId)

            if(ret.success){
                data.walletId = ret.data.linkWalletId;
                data.limit = ret.data.maxLimit;
                data.spent = ret.data.spent;
            }
            else{
                this.sharedLogic.endServe(ret.success, ret.message, ret.data);
            }
        }

        return data;
    }

    /**
     *  Function to delete wallet details
     *
     *  @param walletId int ID of the wallet to update
     *
     *  @return JSON {
     *
     *               }

     *  @TODO complete
     */
    deleteWallet(walletId){
        let data = {};
        if(this.demoMode){
            data;
        }
        else{
            this.sharedLogic.crudController.deleteWallet(walletId, function (ret) {
                data = ret.data;
            });
        }
        return data;
    }

    /**
     *  Function to add a new TPA
     *
     *  @return JSON {
     *                  tpaId: int ID of TPA created
     *               }
     */
    async addTpa(){
        let data = {};

        if(this.demoMode){
            data.tpaId = 0;
        }
        else{
            let ret = await this.sharedLogic.crudController.createTPA();

            if(ret.success){
                data.tpaId = ret.data.tpaId;
            }
            else{
                this.sharedLogic.endServe(ret.success, ret.message, ret.data);
            }
        }

        return data;
    }

    /**
     *  Function to retrieve a TPA
     *
     *  @param tpaId int ID of TPA
     *
     *  @return JSON {
     *                  tpaId: int ID of TPA
     *               }
     */
    async getTpa(tpaId){
        let data = {};

        if(this.demoMode){
            data.tpaId = 0;
        }
        else{
            let ret = await this.sharedLogic.crudController.getTPAByTpaId(tpaId);

            if(ret.success){
                data.tpaId = ret.data.tpaId;
            }
            else{
                this.sharedLogic.endServe(ret.success, ret.message, ret.data);
            }
        }

        return data;
    }

    /**
     *  Function to delete a TPA
     *
     *  @param tpaId int ID of TPA
     *
     *  @return JSON {
     *
     *               }
     *
     *  @TODO complete
     */
    deleteTpa(tpaId){
        let data = {};
        if(this.demoMode){
            data;
        }
        else{
            this.sharedLogic.crudController.deleteTpa(tpaId, function (ret) {
                data = ret.data;
            });
        }
        return data;
    }

    /**
     *  Function to add a room to the TPA
     *
     *  @param tpaId int ID of TPA
     *  @param roomId int ID of room client needs access to
     *
     *  @return JSON {
     *                  tpa_roomId: int ID of TPAxROOM
     *               }
     */
    async addTpaRoom(tpaId, roomId){
        let data = {};

        if(this.demoMode){
            data.tpa_roomId = 0;
        }
        else{
            let roomData = await this.sharedLogic.crudController.getRoomByRoomId(roomId);

            if(roomData.success){
                let parentList = roomData.data.parentRoomList.split(',');

                for(let i=0; i<parentList.length; i++){
                    let ret = await this.sharedLogic.crudController.createTPAxRoom(tpaId, parentList[i]);
                    if(ret.success){
                        data.tpa_roomId = ret.data.tpa_roomId;
                    }
                    else{
                        this.sharedLogic.endServe(ret.success, ret.message, ret.data);
                    }
                }

                let ret = await this.sharedLogic.crudController.createTPAxRoom(tpaId, roomId);
                if(ret.success){
                    data.tpa_roomId = ret.data.tpaxroomId;
                }
                else{
                    this.sharedLogic.endServe(ret.success, ret.message, ret.data);
                }
            }
            else{
                this.sharedLogic.endServe(roomData.success, roomData.message, roomData.data);
            }
        }

        return data;
    }

    /**
     *  Function to edit a room for a TPA
     *
     *  @param tpaIdCurrent int ID of current TPA
     *  @param roomIdCurrent int ID of the current room
     *  @param tpaId int ID of new TPA
     *  @param roomId int ID of new room
     *
     *  @return JSON {
     *                  tpa_roomId: int ID of TPAxRoom
     *               }
     */
    async editTpaRoom(tpaIdCurrent, roomIdCurrent, tpaId, roomId){
        let data = {};

        if(this.demoMode){
            data.tpa_roomId = tpaId + "_" + roomId;
        }
        else{

            // delete current rooms
            let roomData = await this.sharedLogic.crudController.getRoomByRoomId(roomIdCurrent);

            if(roomData.success){
                let parentList = roomData.data.parentRoomList.split(',');

                for(let i=0; i<parentList.length; i++){
                    let ret = await this.sharedLogic.crudController.deleteTPAxRoom(tpaIdCurrent, parentList[i]);
                    if(!ret.success){
                        this.sharedLogic.endServe(ret.success, ret.message, ret.data);
                    }
                }

                let ret = await this.sharedLogic.crudController.deleteTPAxRoom(tpaIdCurrent, roomIdCurrent);
                if(!ret.success){
                    this.sharedLogic.endServe(ret.success, ret.message, ret.data);
                }
            }
            else{
                this.sharedLogic.endServe(roomData.success, roomData.message, roomData.data);
            }

            // make new rooms
            data = await this.addTpaRoom(tpaId, roomId);
        }

        return data;
    }

    /**
     *  Function to retrieve the rooms of a TPA
     *
     *  @param tpaId int ID of TPA
     *
     *  @return JSON {
     *                  // return
     *               }
     */
    async getTpaRoom(tpaId){
        let data = {};

        if(this.demoMode){
            //data;
        }
        else{
            let ret = await this.sharedLogic.crudController.getTPAxRoomsByTpaId(tpaId);

            if(ret.success){
                // return
            }
            else{
                this.sharedLogic.endServe(ret.success, ret.message, ret.data);
            }
        }

        return data;
    }

    /**
     *  Function to delete a room from a TPA
     *
     *  @param tpaId int ID of TPA
     *  @param roomId int ID of Room
     *
     *  @return JSON {
     *
     *               }
     *
     *  @TODO complete
     */
    deleteTpaRoom(tpaId, roomId){
        let data = {};
        if(this.demoMode){
            data;
        }
        else{
            this.sharedLogic.crudController.deleteTPAxRoom(tpaId, roomId,function (ret) {
                data = ret.data;
            });
        }
        return data;
    }

    /**
     *  Function to add a visitor package
     *
     *  @param employeeId int ID of employee that created the visitor package
     *  @param startTime date Start Date of the visitor package
     *  @param endTime date End Date of the visitor package
     *  @param macAddress string Mac Address of client device
     *  @param wifiAccessParamsId int ID of WiFi access point
     *  @param roomId int ID of the room client needs access to
     *  @param limit float Limit a customer can spend
     *  @param spent float Amount spent by customer
     *
     *  @return JSON {
     *                  visitorPackageId: int ID of visitor package created
     *               }
     */
    async addVisitorPackage(){
        let success;
        let message;
        let data = {};

        let presentParams = false;
        let presentReturn = "";

        if(this.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }

        if(this.body.startTime === undefined){
            presentParams = true;
            presentReturn += "startTime, ";
        }

        if(this.body.endTime === undefined){
            presentParams = true;
            presentReturn += "endTime, ";
        }

        if(this.body.macAddress === undefined){
            presentParams = true;
            presentReturn += "macAddress, ";
        }

        if(this.body.wifiAccessParamsId === undefined){
            presentParams = true;
            presentReturn += "wifiAccessParamsId, ";
        }

        if(this.body.roomId === undefined){
            presentParams = true;
            presentReturn += "roomId, ";
        }

        if(this.body.limit === undefined){
            presentParams = true;
            presentReturn += "limit, ";
        }

        if(this.body.spent === undefined){
            presentParams = true;
            presentReturn += "spent, ";
        }

        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";

            if(!this.sharedLogic.validateNonEmpty(this.body.employeeId)){
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }

            if(!this.sharedLogic.validateNonEmpty(this.body.startTime)){
                invalidParams = true;
                invalidReturn += "startTime, ";
            }

            if(!this.sharedLogic.validateNonEmpty(this.body.endTime)){
                invalidParams = true;
                invalidReturn += "endTime, ";
            }

            if(!this.sharedLogic.validateNonEmpty(this.body.macAddress)){
                invalidParams = true;
                invalidReturn += "macAddress, ";
            }

            if(!invalidParams) {
                if(this.body.macAddress !== null){
                    if(this.body.startTime !== null) {
                        if(this.body.endTime !== null) {
                            if(this.body.wifiAccessParamsId === null && this.body.roomId === null && (this.body.limit === null && this.body.spent === null)){
                                this.sharedLogic.endServe(false, "Invalid Parameters: at least one package options need to be selected", null);
                            }
                            else {
                                if(this.demoMode){
                                    data.visitorPackageId = 0;
                                    this.sharedLogic.endServe(true, "Visitor Package created - MOCK", data);
                                }
                                else {
                                    let client = {};
                                    let wifi = {};
                                    let tpa = {};
                                    let tpa_room = {};
                                    let wallet = {};
                                    let visitorPackage = {};

                                    let ret = await this.sharedLogic.crudController.getClientByMacAddress(this.body.macAddress);
                                    if(ret.success)
                                        client = ret.data;
                                    else
                                        client = await this.addClient(this.body.macAddress);

                                    if(this.body.wifiAccessParamsId !== null)
                                        wifi = await this.addTempWifi(this.body.wifiAccessParamsId);

                                    if(this.body.roomId !== null){
                                        tpa = await this.addTpa();
                                        tpa_room = await this.addTpaRoom(tpa.tpaId, this.body.roomId);
                                    }

                                    if(this.body.limit !== null && this.body.spent !== null)
                                        wallet = await this.addWallet(this.body.limit, this.body.spent);

                                    if(Object.entries(wifi).length !== 0 && Object.entries(tpa_room).length === 0 && Object.entries(wallet).length === 0){
                                        visitorPackage = await this.sharedLogic.crudController.createVisitorPackage(wifi.wifiTempAccessId,
                                            null,
                                            null,
                                            this.body.employeeId,
                                            client.clientId,
                                            this.body.startTime,
                                            this.body.endTime)
                                    }
                                    else if(Object.entries(wifi).length !== 0 && Object.entries(tpa_room).length !== 0 && Object.entries(wallet).length === 0){
                                        visitorPackage = await this.sharedLogic.crudController.createVisitorPackage(wifi.wifiTempAccessId,
                                            tpa.tpaId,
                                            null,
                                            this.body.employeeId,
                                            client.clientId,
                                            this.body.startTime,
                                            this.body.endTime)
                                    }
                                    else if(Object.entries(wifi).length !== 0 && Object.entries(tpa_room).length === 0 && Object.entries(wallet).length !== 0){
                                        visitorPackage = await this.sharedLogic.crudController.createVisitorPackage(wifi.wifiTempAccessId,
                                            null,
                                            wallet.walletId,
                                            this.body.employeeId,
                                            client.clientId,
                                            this.body.startTime,
                                            this.body.endTime)
                                    }
                                    else if(Object.entries(wifi).length === 0 && Object.entries(tpa_room).length !== 0 && Object.entries(wallet).length === 0){
                                        visitorPackage = await this.sharedLogic.crudController.createVisitorPackage(null,
                                            tpa.tpaId,
                                            null,
                                            this.body.employeeId,
                                            client.clientId,
                                            this.body.startTime,
                                            this.body.endTime)
                                    }
                                    else if(Object.entries(wifi).length === 0 && Object.entries(tpa_room).length !== 0 && Object.entries(wallet).length !== 0){
                                        visitorPackage = await this.sharedLogic.crudController.createVisitorPackage(null,
                                            tpa.tpaId,
                                            wallet.walletId,
                                            this.body.employeeId,
                                            client.clientId,
                                            this.body.startTime,
                                            this.body.endTime)
                                    }
                                    else if(Object.entries(wifi).length === 0 && Object.entries(tpa_room).length === 0 && Object.entries(wallet).length !== 0){
                                        visitorPackage = await this.sharedLogic.crudController.createVisitorPackage(null,
                                            null,
                                            wallet.walletId,
                                            this.body.employeeId,
                                            client.clientId,
                                            this.body.startTime,
                                            this.body.endTime)
                                    }
                                    else if(Object.entries(wifi).length !== 0 && Object.entries(tpa_room).length !== 0 && Object.entries(wallet).length !== 0){
                                        visitorPackage = await this.sharedLogic.crudController.createVisitorPackage(wifi.wifiTempAccessId,
                                            tpa.tpaId,
                                            wallet.walletId,
                                            this.body.employeeId,
                                            client.clientId,
                                            this.body.startTime,
                                            this.body.endTime)
                                    }

                                    if(visitorPackage.success){
                                        success = visitorPackage.success;
                                        message = visitorPackage.message;
                                        data.visitorPackageId = visitorPackage.data.visitorPackageId;
                                        this.sharedLogic.endServe(success, message, data);
                                    }
                                    else{
                                        this.sharedLogic.endServe(visitorPackage.success, visitorPackage.message, visitorPackage.data);
                                    }
                                }
                            }
                        }
                        else{
                            this.sharedLogic.endServe(false, "Invalid Parameters: endTime cannot be null", null);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(false, "Invalid Parameters: startTime cannot be null", null);
                    }
                }
                else{
                    this.sharedLogic.endServe(false, "Invalid Parameters: macAddress cannot be null", null);
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
     *  Function to edit a visitor package
     *
     *  @param visitorPackageId int ID of visitor package to edit
     *  @param employeeId int ID of employee that created the visitor package
     *  @param startTime date Start Date of the visitor package
     *  @param endTime date End Date of the visitor package
     *  @param wifiAccessParamsId int ID of WiFi access point
     *  @param roomId int ID of room
     *  @param limit float Limit a customer can spent
     *
     *  @return JSON {
     *                  visitorPackageId: int ID of visitor package created
     *               }
     */
    async editVisitorPackage(){
        let success;
        let message;
        let data = {};

        let presentParams = false;
        let presentReturn = "";

        if(this.body.visitorPackageId === undefined){
            presentParams = true;
            presentReturn += "visitorPackageId, ";
        }

        if(this.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }

        if(this.body.startTime === undefined){
            presentParams = true;
            presentReturn += "startTime, ";
        }

        if(this.body.endTime === undefined){
            presentParams = true;
            presentReturn += "endTime, ";
        }

        if(this.body.wifiAccessParamsId === undefined){
            presentParams = true;
            presentReturn += "wifiAccessParamsId, ";
        }

        if(this.body.roomId === undefined){
            presentParams = true;
            presentReturn += "roomId, ";
        }

        if(this.body.limit === undefined){
            presentParams = true;
            presentReturn += "limit, ";
        }

        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";

            if(!this.sharedLogic.validateNonEmpty(this.body.visitorPackageId)){
                invalidParams = true;
                invalidReturn += "visitorPackageId, ";
            }

            if(!this.sharedLogic.validateNonEmpty(this.body.employeeId)){
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }

            if(!this.sharedLogic.validateNonEmpty(this.body.startTime)){
                invalidParams = true;
                invalidReturn += "startTime, ";
            }

            if(!this.sharedLogic.validateNonEmpty(this.body.endTime)){
                invalidParams = true;
                invalidReturn += "endTime, ";
            }

            if(!invalidParams) {
                if(this.body.startTime !== null){
                    if(this.body.endTime !== null){
                        if(this.body.wifiAccessParamsId === null && this.body.roomId === null && this.body.limit === null){
                            data.visitorPackageId = 0;
                            this.sharedLogic.endServe(true, "Edited Visitor Package - MOCK", data);
                        }
                        else{
                            if(this.demoMode){
                                success = true;
                                message = "Edited Visitor Package - MOCK";
                                data.visitorPackageId = 0;
                                this.sharedLogic.endServe(success, message, data);
                            }
                            else{
                                let visitorPackage = await this.sharedLogic.crudController.getVisitorPackageByVisitorPackageId(this.body.visitorPackageId);

                                let wifi = {};
                                let tpa = {};
                                let tpa_room = {};
                                let wallet = {};

                                // EDIT WIFI
                                if(this.body.wifiAccessParamsId !== null){
                                    if(visitorPackage.data.tempWifiAccessId === null){
                                        wifi = await this.addTempWifi(this.body.wifiAccessParamsId);
                                    }
                                    else{
                                        wifi = await this.editTempWifi(visitorPackage.data.tempWifiAccessId, this.body.wifiAccessParamsId);
                                    }
                                }
                                else if(this.body.wifiAccessParamsId === null && visitorPackage.data.tempWifiAccessId !== null){
                                    wifi.wifiTempAccessId = null;
                                }

                                // EDIT TPA
                                if(this.body.roomId !== null){
                                    if(visitorPackage.data.tpaId === null){
                                        tpa = await this.addTpa();
                                        tpa_room = await this.addTpaRoom(tpa.tpaId, this.body.roomId);
                                    }
                                    else{
                                        let ret = await this.sharedLogic.crudController.getTPAxRoomsByTpaId(visitorPackage.data.tpaId);
                                        tpa_room = await this.editTpaRoom(ret.data[0].tpaId, ret.data[0].roomId, ret.data[0].tpaId, this.body.roomId);
                                    }
                                }
                                else if(this.body.roomId === null && visitorPackage.data.tpaId !== null){
                                    tpa.tpaId = null;
                                }

                                // EDIT WALLET
                                if(this.body.limit !== null) {
                                    if(visitorPackage.data.linkWalletId === null){
                                        wallet = await this.addWallet(this.body.limit, 0);
                                    }
                                    else{
                                        wallet = await this.editWallet(visitorPackage.data.linkWalletId, this.body.limit);
                                    }
                                }
                                else if(this.body.limit === null && visitorPackage.data.linkWalletId === null){
                                    wallet.walletId = null;
                                }

                                // EDIT VISITORPACKAGE
                                let newVisitorPackage = await this.sharedLogic.crudController.updateVisitorPackage(visitorPackage.data.visitorPackageId,
                                    wifi.wifiTempAccessId,
                                    tpa.tpaId,
                                    wallet.walletId,
                                    visitorPackage.data.employeeId,
                                    visitorPackage.data.clientId,
                                    this.body.startTime,
                                    this.body.endTime);

                                if(newVisitorPackage.success){
                                    success = newVisitorPackage.success;
                                    message = newVisitorPackage.message;
                                    data.visitorPackageId = this.body.visitorPackageId;
                                    this.sharedLogic.endServe(success, message, data);
                                }
                                else{
                                    this.sharedLogic.endServe(visitorPackage.success, visitorPackage.message, visitorPackage.data);
                                }
                            }
                        }
                    }
                    else{
                        this.sharedLogic.endServe(false, "Invalid Parameters: endTime cannot be null", null);
                    }
                }
                else{
                    this.sharedLogic.endServe(false, "Invalid Parameters: startTime cannot be null", null);
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

        if(this.body.visitorPackageId === undefined){
            presentParams = true;
            presentReturn += "visitorPackageId, ";
        }

        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";

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
                    data = await this.visitorPackage(this.body.visitorPackageId);
                    this.sharedLogic.endServe(true, "Retrieved Visitor Package", data);
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
     *  Function to retrieve all visitor packages for an employee
     *
     *  @param employeeId int ID of the employee
     *
     *  @return JSON [
     *                  {
     *                      visitorPackageId: int ID of the visitor package
     *                      companyName: string Name of company
     *                      latitude: string Latitude of building
     *                      longitude: string Longitude of building
     *                      branchName: string Name of building
     *                      ssid: string SSID of wifi access param
     *                      networkType: string Type of wifi access param
     *                      password: string Password of wifi access param
     *                      roomName: string Name of the room
     *                      startTime: date Start date of the visitor package
     *                      endTime: date End date of the visitor package
     *                      limit: double Limit for the client
     *                      spent: amount the client spent
     *                  }, ..
     *              ]
     */
    async getVisitorPackages(){
        let success;
        let message;
        let data = {};

        let presentParams = false;
        let presentReturn = "";

        if(this.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }

        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";

            if(!this.sharedLogic.validateNonEmpty(this.body.employeeId)){
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }

            if(!invalidParams) {
                if(this.demoMode){
                    let arr = [];

                    let data1 = {};
                    data1.companyName = "Vast Expanse";
                    data1.latitude = "2000";
                    data1.longitude = "2000";
                    data1.branchName = "Pretoria";
                    data1.ssid = "Vast Expanse";
                    data1.networkType = "WPA";
                    data1.password = "test";
                    data1.roomName = "room1";
                    data1.startTime = "10:00";
                    data1.endTime = "10:00";
                    data1.limit = "100.00";
                    data1.spent = "50.00";

                    let data2 = {};
                    data2.companyName = "Vast Expanse";
                    data2.latitude = "2000";
                    data2.longitude = "2000";
                    data2.branchName = "Pretoria";
                    data2.ssid = "Vast Expanse";
                    data2.networkType = "WPA";
                    data2.password = "test";
                    data2.roomName = "room1";
                    data2.startTime = "10:00";
                    data2.endTime = "10:00";
                    data2.limit = "100.00";
                    data2.spent = "50.00";

                    arr.push(data1);
                    arr.push(data2);

                    data = arr;

                    this.sharedLogic.endServe(true, "Retrieved Visitor Packages - MOCK", data);
                }
                else{
                    let visitorPackages = await this.sharedLogic.crudController.getVisitorPackagesByEmployeeId(this.body.employeeId);

                    if(visitorPackages.success){
                        let arr = [];
                        for(let i=0; i<visitorPackages.data.length; i++){
                            let p = await this.visitorPackage(visitorPackages.data[i].visitorPackageId);
                            if(!this.isEmpty(p)) {
                                arr.push(p);
                            }
                        }
                        data = arr;
                        this.sharedLogic.endServe(true, "Retrieved Visitor Packages", data);
                    }
                    else{
                        this.sharedLogic.endServe(true, "Retrieved Visitor Packages", []);
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
                    else{
                        this.sharedLogic.endServe(companyData.success, companyData.message, companyData.data);
                    }

                    let buildingData = await this.sharedLogic.crudController.getBuildingByBuildingId(employeeData.data.buildingId);

                    if(buildingData.success){
                        let wifiData = await this.sharedLogic.crudController.getWiFiParamsByWifiParamsId(buildingData.data.wifiParamsId);

                        if(wifiData.success){
                            data.ssid = wifiData.data.ssid;
                            data.networkType = wifiData.data.networkType;
                            data.password = wifiData.data.password;
                        }
                        else{
                            this.sharedLogic.endServe(wifiData.success, wifiData.message, wifiData.data);
                        }

                        data.branchName = buildingData.data.branchName;
                        data.latitude = buildingData.data.latitude;
                        data.longitude = buildingData.data.longitude;
                    }
                    else{
                        this.sharedLogic.endServe(buildingData.success, buildingData.message, buildingData.data);
                    }
                }
                else{
                    this.sharedLogic.endServe(employeeData.success, employeeData.message, employeeData.data);
                }

                if(visitorPackageData.data.tpaId != null){
                    let tpaRoomData = await this.sharedLogic.crudController.getTPAxRoomsByTpaId(visitorPackageData.data.tpaId);

                    if(tpaRoomData.success){
                        let roomData =  await this.sharedLogic.crudController.getRoomByRoomId(tpaRoomData.data[tpaRoomData.data.length-1].roomId);

                        if(roomData.success){
                            data.roomName = roomData.data.roomName;
                        }
                        else{
                            this.sharedLogic.endServe(roomData.success, roomData.message, roomData.data);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(tpaRoomData.success, tpaRoomData.message, tpaRoomData.data);
                    }
                }

                if(visitorPackageData.data.linkWalletId != null){
                    let walletData = await this.sharedLogic.crudController.getWalletByLinkWalletId(visitorPackageData.data.linkWalletId);

                    if(walletData.success){
                        data.limit = walletData.data.maxLimit;
                        data.spent = walletData.data.spent;
                    }
                    else{
                        this.sharedLogic.endServe(walletData.success, walletData.message, walletData.data);
                    }
                }

                data.startTime = visitorPackageData.data.startTime;
                data.endTime = visitorPackageData.data.endTime;
            }
        }
        else {
            this.sharedLogic.endServe(visitorPackageData.success, visitorPackageData.message, visitorPackageData.data);
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
     * Function to check if an object is empty or not
     *
     * @param obj
     * @return {boolean}
     */
    isEmpty(obj) {
        for(let key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
}

module.exports = AppLogic;