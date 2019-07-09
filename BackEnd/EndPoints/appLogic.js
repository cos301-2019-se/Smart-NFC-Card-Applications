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
 *
 *	Functional Description:	This class handles the functionality that will be requested by the
 *                          application to the backend system. It handles functionality like
 *                          when a user requests a business card from the server.
 *	Error Messages: None
 *	Assumptions:    None
 *	Constraints:    None
 */

const SharedLogic = require("./../SharedLogic/sharedLogic.js");
let me = null;

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
        me = this;
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

            // Visitor Package
            case "addVisitorPackage":
                this.addVisitorPackage();   // TODO
                break;
            case "editVisitorPackage":
                this.editVisitorPackage();  // TODO
                break;
            case "getVisitorPackage":
                this.getVisitorPackage();   // TODO
                break;
            case "getVisitorPackages":
                this.getVisitorPackages();  // TODO
                break;
            case "deleteVisitorPackage":
                this.deleteVisitorPackage();// TODO
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

        if(me.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }

        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";

            if(!me.sharedLogic.validateNonEmpty(me.body.employeeId)){
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }

            if(!invalidParams) {
                if(me.demoMode){
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
                    me.sharedLogic.endServe(true, "Business card information loaded successfully - MOCK", data);
                }
                else{
                    let employeeData = await me.sharedLogic.crudController.getEmployeeByEmployeeId(me.body.employeeId);

                    if(employeeData.success){
                        let companyData = await me.sharedLogic.crudController.getCompanyByCompanyId(employeeData.data.companyId);

                        if(companyData.success){
                            let buildingData = await me.sharedLogic.crudController.getBuildingByBuildingId(employeeData.data.buildingId);

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
                                me.sharedLogic.endServe(true, "Business card information loaded successfully", data);
                            }
                            else{
                                me.sharedLogic.endServe(buildingData.success, buildingData.message, buildingData.data);
                            }
                        }
                        else{
                            me.sharedLogic.endServe(companyData.success, companyData.message, companyData.data);
                        }
                    }
                    else{
                        me.sharedLogic.endServe(employeeData.success, employeeData.message, employeeData.data);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: " + invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: " + presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
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
     *
     *  @TODO Test
     */
    async addClient(macAddress) {
        let data = {};

        if(me.demoMode){
            data.clientId = 0;
        }
        else{
            let ret = await me.sharedLogic.crudController.createClient(macAddress);

            if(ret.success){
                data.clientId = ret.data.clientId;
            }
            else{
                me.sharedLogic.endServe(ret.success, ret.message, ret.data);
            }
        }

        return data;
    }

    /**
     *  Function to edit a clients details
     *
     *  @param clientId int ID of client
     *  @param macAddress string Mac Address of client device
     *
     *  @return JSON {
     *
     *               }
     *
     *  @TODO Test
     */
    editClient(clientId, macAddress){
        let data = {};
        if(this.demoMode){
            data.clientId = 0;
        }
        else{
            me.sharedLogic.crudController.updateClient(clientId, macAddress, function (ret) {
                data = ret.data;
            });
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
     *
     *  @TODO Test
     */
    getClient(clientId){
        let data = {};
        if(this.demoMode){
            data.clientId = 0;
            data.macAddress = "0";
        }
        else{
            me.sharedLogic.crudController.getClientByClientId(clientId, function (ret) {
                data.clientId = ret.data.clientId;
                data.macAddress = ret.data.macAddress;
            });
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
     *  @TODO Test
     */
    deleteClient(clientId){
        let data = {};
        if(this.demoMode){
            data;
        }
        else{
            me.sharedLogic.crudController.deleteClient(clientId, function (ret) {
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
     *
     *  @TODO Test
     */
    async addTempWifi(wifiAccessParamsId){
        let data = {};

        if(this.demoMode){
            data.wifiTempAccessId = 0;
        }
        else{
            let ret = await me.sharedLogic.crudController.createTempWifiAccess(wifiAccessParamsId);

            if(ret.success){
                data.wifiTempAccessId = ret.data.tempWifiAccessId
            }
            else{
                me.sharedLogic.endServe(ret.success, ret.message, ret.data);
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
     *
     *               }
     *
     *  @TODO Test
     */
    editTempWifi(wifiAccessParamsId, wifiTempAccessId){
        let data = {};
        if(this.demoMode){
            data;
        }
        else{
            me.sharedLogic.crudController.updateTempWifiAccess(wifiAccessParamsId, wifiTempAccessId, function (ret) {
                data = ret.data;
            });
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
     *
     *  @TODO Test
     */
    getTempWifi(wifiTempAccessId){
        let data = {};
        if(this.demoMode){
            data.wifiTempAccessId = 0;
            data.wifiAccessParamsId = 0;
        }
        else{
            me.sharedLogic.crudController.getTempWifiAccessByTempWifiAccessId(wifiTempAccessId, function (ret) {
                data.wifiTempAccessId = ret.data.tempWifiAccessId;
                data.wifiAccessParamsId = ret.data.wifiParamsId;
            });
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
     *  @TODO Integrate with CrudController and Application
     *  @TODO Return correct data
     *  @TODO Test
     */
    deleteTempWifi(wifiTempAccessId){
        let data = {};
        if(this.demoMode){
            data;
        }
        else{
            me.sharedLogic.crudController.deleteTempWifiAccess(wifiTempAccessId, function (ret) {
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
     *
     *  @TODO Test
     */
    async addWallet(limit, spent){
        let data = {};

        if(this.demoMode){
            data.walletId = 0;
        }
        else{
            let ret = await me.sharedLogic.crudController.createWallet(limit, spent);

            if(ret.success){
                data.walletId = ret.data.linkWalletId;
            }
            else{
                me.sharedLogic.endServe(ret.success, ret.message, ret.data);
            }
        }

        return data;
    }

    /**
     *  Function to edit wallet details
     *
     *  @param walletId int ID of the wallet to update
     *  @param limit float Limit a customer can spend
     *  @param spent float Amount spent by customer
     *
     *  @return JSON {
     *
     *               }
     *
     *  @TODO Test
     */
    editWallet(walletId, limit, spent){
        let data = {};
        if(this.demoMode){
            data;
        }
        else{
            me.sharedLogic.crudController.updateWallet(walletId, limit, spent, function (ret) {
                data = ret.data;
            });
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
     *
     *  @TODO Test
     */
    getWallet(walletId){
        let data = {};
        if(this.demoMode){
            data.walletId = 0;
            data.limit = 0;
            data.spent = 0;
        }
        else{
            me.sharedLogic.crudController.getWalletByLinkWalletId(walletId, function (ret) {
                data.walletId = ret.data.linkWalletId;
                data.limit = ret.data.maxLimit;
                data.spent = ret.data.spent;
            });
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

     *  @TODO Test
     */
    deleteWallet(walletId){
        let data = {};
        if(this.demoMode){
            data;
        }
        else{
            me.sharedLogic.crudController.deleteWallet(walletId, function (ret) {
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
     *
     *  @TODO Test
     */
    async addTpa(){
        let data = {};

        if(this.demoMode){
            data.tpaId = 0;
        }
        else{
            let ret = await me.sharedLogic.crudController.createTPA();

            if(ret.success){
                data.tpaId = ret.data.tpaId;
            }
            else{
                me.sharedLogic.endServe(ret.success, ret.message, ret.data);
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
     *
     *  @TODO Test
     */
    getTpa(tpaId){
        let data = {};
        if(this.demoMode){
            data.tpaId = 0;
        }
        else{
            me.sharedLogic.crudController.getTPAByTpaId(tpaId, function (ret) {
                data.tpaId = ret.data.tpaId;
            });
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
     *  @TODO Test
     */
    deleteTpa(tpaId){
        let data = {};
        if(this.demoMode){
            data;
        }
        else{
            me.sharedLogic.crudController.deleteTpa(tpaId, function (ret) {
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
     *
     *  @TODO Test
     */
    async addTpaRoom(tpaId, roomId){
        let data = {};

        if(this.demoMode){
            data.tpa_roomId = 0;
        }
        else{
            let ret = await me.sharedLogic.crudController.createTPAxRoom(tpaId, roomId);

            if(ret.success){
                data.tpa_roomId = ret.data.tpa_roomId;
            }
            else{
                me.sharedLogic.endServe(ret.success, ret.message, ret.data);
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
     *
     *               }
     *
     *  @TODO Test
     */
    editTpaRoom(tpaIdCurrent, roomIdCurrent, tpaId, roomId){
        let data = {};
        if(this.demoMode){
            data;
        }
        else{
            me.sharedLogic.crudController.updateTPAxRoom(tpaIdCurrent, roomIdCurrent, tpaId, roomId,function (ret) {
                data = ret.data;
            });
        }
        return data;
    }

    // /**
    //  *  Function to retrieve the rooms of a TPA
    //  *
    //  *  @param tpaId int ID of TPA
    //  *
    //  *  @return JSON {
    //  *
    //  *               }
    //  *
    //  *  @TODO Integrate with CrudController and Application
    //  *  @TODO Return correct data
    //  *  @TODO Test
    //  */
    // getTpaRoom(tpaId){
    //     let data = {};
    //     if(this.demoMode){
    //         data;
    //     }
    //     else{
    //         me.sharedLogic.crudController.updateTpaRoom(tpaIdCurrent, roomIdCurrent, tpaId, roomId,function (ret) {
    //             data = ret.data;
    //         });
    //     }
    //     return data;
    // }

    /**
     *  Function to delete a room from a TPA
     *
     *  @param tpaId int ID of TPA
     *  @param roomId int ID of Room
     *
     *  @return JSON {
     *
     *               }
     */
    deleteTpaRoom(tpaId, roomId){
        let data = {};
        if(this.demoMode){
            data;
        }
        else{
            me.sharedLogic.crudController.deleteTPAxRoom(tpaId, roomId,function (ret) {
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
     *
     *  @TODO Integrate with CrudController and Application
     *  @TODO Return correct data
     *  @TODO Test
     */
    async addVisitorPackage(){
        let success;
        let message;
        let data = {};

        let presentParams = false;
        let presentReturn = "";

        if(me.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }

        if(me.body.startTime === undefined){
            presentParams = true;
            presentReturn += "startTime, ";
        }

        if(me.body.endTime === undefined){
            presentParams = true;
            presentReturn += "endTime, ";
        }

        if(me.body.macAddress === undefined){
            presentParams = true;
            presentReturn += "macAddress, ";
        }

        if(me.body.wifiAccessParamsId === undefined){
            presentParams = true;
            presentReturn += "wifiAccessParamsId, ";
        }

        if(me.body.roomId === undefined){
            presentParams = true;
            presentReturn += "roomId, ";
        }

        if(me.body.limit === undefined){
            presentParams = true;
            presentReturn += "limit, ";
        }

        if(me.body.spent === undefined){
            presentParams = true;
            presentReturn += "spent, ";
        }

        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";

            if(!me.sharedLogic.validateNonEmpty(me.body.employeeId)){
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }

            if(!me.sharedLogic.validateNonEmpty(me.body.startTime)){
                invalidParams = true;
                invalidReturn += "startTime, ";
            }

            if(!me.sharedLogic.validateNonEmpty(me.body.endTime)){
                invalidParams = true;
                invalidReturn += "endTime, ";
            }

            if(!me.sharedLogic.validateNonEmpty(me.body.macAddress)){
                invalidParams = true;
                invalidReturn += "macAddress, ";
            }

            if(!invalidParams) {
                if(me.body.macAddress !== null){
                    if(this.body.startTime !== null) {
                        if(this.body.endTime !== null) {
                            if(this.body.wifiAccessParamsId === null && this.body.roomId === null && (this.body.limit === null && this.body.spent === null)){
                                me.sharedLogic.endServe(false, "Invalid Parameters: at least one package options need to be selected", null);
                            }
                            else {
                                if(this.demoMode){
                                    data.visitorPackageId = 0;
                                    me.sharedLogic.endServe(true, "Visitor Package created - MOCK", data);
                                }
                                else {
                                    let client = {};
                                    let wifi = {};
                                    let tpa = {};
                                    let tpa_room = {};
                                    let wallet = {};
                                    let visitorPackage = {};

                                    client = await me.addClient(me.body.macAddress);

                                    if(me.body.wifiAccessParamsId !== null)
                                        wifi = await me.addTempWifi(me.body.wifiAccessParamsId);

                                    if(me.body.roomId !== null){
                                        tpa = await me.addTpa();
                                        tpa_room = await me.addTpaRoom(tpa.tpaId, me.body.roomId);
                                    }

                                    if(me.body.limit !== null && me.body.spent !== null)
                                        wallet = await me.addWallet(me.body.limit, me.body.spent);

                                    if(Object.entries(wifi).length !== 0 && Object.entries(tpa_room).length === 0 && Object.entries(wallet).length === 0){
                                        visitorPackage = await me.sharedLogic.crudController.createVisitorPackage(wifi.wifiTempAccessId,
                                            null,
                                            null,
                                            me.body.employeeId,
                                            client.clientId,
                                            me.body.startTime,
                                            me.body.endTime)
                                    }
                                    else if(Object.entries(wifi).length !== 0 && Object.entries(tpa_room).length !== 0 && Object.entries(wallet).length === 0){
                                        visitorPackage = await me.sharedLogic.crudController.createVisitorPackage(wifi.wifiTempAccessId,
                                            tpa.tpaId,
                                            null,
                                            me.body.employeeId,
                                            client.clientId,
                                            me.body.startTime,
                                            me.body.endTime)
                                    }
                                    else if(Object.entries(wifi).length !== 0 && Object.entries(tpa_room).length === 0 && Object.entries(wallet).length !== 0){
                                        visitorPackage = await me.sharedLogic.crudController.createVisitorPackage(wifi.wifiTempAccessId,
                                            null,
                                            wallet.walletId,
                                            me.body.employeeId,
                                            client.clientId,
                                            me.body.startTime,
                                            me.body.endTime)
                                    }
                                    else if(Object.entries(wifi).length === 0 && Object.entries(tpa_room).length !== 0 && Object.entries(wallet).length === 0){
                                        visitorPackage = await me.sharedLogic.crudController.createVisitorPackage(null,
                                            tpa.tpaId,
                                            null,
                                            me.body.employeeId,
                                            client.clientId,
                                            me.body.startTime,
                                            me.body.endTime)
                                    }
                                    else if(Object.entries(wifi).length === 0 && Object.entries(tpa_room).length !== 0 && Object.entries(wallet).length !== 0){
                                        visitorPackage = await me.sharedLogic.crudController.createVisitorPackage(null,
                                            tpa.tpaId,
                                            wallet.walletId,
                                            me.body.employeeId,
                                            client.clientId,
                                            me.body.startTime,
                                            me.body.endTime)
                                    }
                                    else if(Object.entries(wifi).length === 0 && Object.entries(tpa_room).length === 0 && Object.entries(wallet).length !== 0){
                                        visitorPackage = await me.sharedLogic.crudController.createVisitorPackage(null,
                                            null,
                                            wallet.walletId,
                                            me.body.employeeId,
                                            client.clientId,
                                            me.body.startTime,
                                            me.body.endTime)
                                    }
                                    else if(Object.entries(wifi).length !== 0 && Object.entries(tpa_room).length !== 0 && Object.entries(wallet).length !== 0){
                                        visitorPackage = await me.sharedLogic.crudController.createVisitorPackage(wifi.wifiTempAccessId,
                                            tpa.tpaId,
                                            wallet.walletId,
                                            me.body.employeeId,
                                            client.clientId,
                                            me.body.startTime,
                                            me.body.endTime)
                                    }

                                    if(visitorPackage.success){
                                        success = visitorPackage.success;
                                        message = visitorPackage.message;
                                        data.visitorPackageId = visitorPackage.data.visitorPackageId;
                                        me.sharedLogic.endServe(success, message, data);
                                    }
                                    else{
                                        me.sharedLogic.endServe(visitorPackage.success, visitorPackage.message, visitorPackage.data);
                                    }
                                }
                            }
                        }
                        else{
                            me.sharedLogic.endServe(false, "Invalid Parameters: endTime cannot be null", null);
                        }
                    }
                    else{
                        me.sharedLogic.endServe(false, "Invalid Parameters: startTime cannot be null", null);
                    }
                }
                else{
                    me.sharedLogic.endServe(false, "Invalid Parameters: macAddress cannot be null", null);
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: " + invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: " + presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     *  Function to edit a visitor package
     *
     *  @param visitorPackageId int ID of visitor package to edit
     *  @param employeeId int ID of employee that created the visitor package
     *  @param startTime date Start Date of the visitor package
     *  @param endTime date End Date of the visitor package
     *  @param macAddress string Mac Address of client device
     *  @param wifiAccessParamsId int ID of WiFi access point
     *  @param limit float Limit a customer can spend
     *  @param spent float Amount spent by customer
     *
     *  @return JSON {
     *                  visitorPackageId: int ID of visitor package created
     *               }
     *
     *  @TODO Integrate with CrudController and Application
     *  @TODO Return correct data
     *  @TODO Test
     */
    editVisitorPackage(){
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

            if(!this.sharedLogic.validateNonEmpty(this.body.macAddress)){
                invalidParams = true;
                invalidReturn += "macAddress, ";
            }

            if(!this.sharedLogic.validateNonEmpty(this.body.wifiAccessParamsId)){
                invalidParams = true;
                invalidReturn += "wifiAccessParamsId, ";
            }

            if(!this.sharedLogic.validateNonEmpty(this.body.roomId)){
                invalidParams = true;
                invalidReturn += "roomId, ";
            }

            if(!this.sharedLogic.validateNonEmpty(this.body.limit)){
                invalidParams = true;
                invalidReturn += "limit, ";
            }

            if(!this.sharedLogic.validateNonEmpty(this.body.spent)){
                invalidParams = true;
                invalidReturn += "spent, ";
            }

            if(!invalidParams) {
                if(this.body.macAddress !== null){
                    if(this.body.startTime !== null){
                        if(this.body.endTime !== null){
                            if(this.body.wifiAccessParamsId === null && this.body.roomId === null && (this.body.limit === null && this.body.spent === null)){
                                me.sharedLogic.endServe(false, "Invalid Parameters: at least one package options need to be selected", null);
                            }
                            else{
                                let clientData;
                                let wifiData;
                                let tpaData;
                                let tpaRoomData;
                                let walletData;

                                // ADD CLIENT
                                clientData = this.addClient();

                                // ADD WIFI
                                if(this.body.wifiAccessParamsId !== null)
                                    wifiData = this.addTempWifi();

                                // ADD TPA
                                if(this.body.roomId !== null){
                                    tpaData = this.addTpa();
                                    tpaRoomData = this.addTpaRoom();
                                }

                                // ADD WALLET
                                if(this.body.limit !== null && this.body.spent !== null)
                                    walletData = this.addWallet();

                                me.sharedLogic.crudController.createVisitorPackage(wifiData.wifiTempAccessId, tpaData.tpaId, walletData.walletId, this.body.employeeId, clientData.clientId, this.body.startTime, this.body.endTime, function (ret) {
                                    success = ret.success;
                                    message = ret.message;
                                    data.visitorPackageId = ret.data.visitorPackageId;
                                    me.sharedLogic.endServe(success, message, data);
                                })
                            }
                        }
                        else{
                            me.sharedLogic.endServe(false, "Invalid Parameters: endTime cannot be null", null);
                        }
                    }
                    else{
                        me.sharedLogic.endServe(false, "Invalid Parameters: startTime cannot be null", null);
                    }
                }
                else{
                    me.sharedLogic.endServe(false, "Invalid Parameters: macAddress cannot be null", null);
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: " + invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: " + presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     *  Function to retrieve a visitor package
     *
     *  @param visitorPackageId int ID of visitor package
     *
     *  @return JSON {
     *
     *               }
     *
     *  @TODO Integrate with CrudController and Application
     *  @TODO Return correct data
     *  @TODO Test
     */
    getVisitorPackage(){

    }

    /**
     *  Function to retrieve all visitor packages for an employee
     *
     *  @param employeeId int ID of the employee
     *
     *  @return JSON array
     *
     *  @TODO Integrate with CrudController and Application
     *  @TODO Return correct data
     *  @TODO Test
     */
    getVisitorPackages(){

    }

    /**
     *  Function to delete a visitor package
     *
     *  @param visitorPackageId int ID of visitor package
     *
     *  @return JSON {
     *
     *               }
     *
     *  @TODO Integrate with CrudController and Application
     *  @TODO Return correct data
     *  @TODO Test
     */
    deleteVisitorPackage(){

    }
}

module.exports = AppLogic;