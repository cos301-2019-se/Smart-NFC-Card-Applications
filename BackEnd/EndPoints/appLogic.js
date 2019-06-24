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
 *  2019/06/24  Tjaart      2.0         Added functions
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
                this.getBusinessCard();     // INTEGRATE
                break;
            // Client
            case "addClient":
                this.addClient();           // TODO
                break;
            case "editClient":
                this.editClient();          // TODO
                break;
            case "getClient":
                this.getClient();           // TODO
                break;
            case "deleteClient":
                this.deleteClient();        // TODO
                break;
            // WIFI
            case "addTempWifi":
                this.addTempWifi();         // TODO
                break;
            case "editTempWifi":
                this.editTempWifi();        // TODO
                break;
            case "getTempWifi":
                this.getTempWifi();         // TODO
                break;
            case "deleteTempWifi":
                this.deleteTempWifi();      // TODO
                break;
            // TPA

            // Wallet

            // Visitor Package
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
     *                  employeeName: string Name of the employee
     *                  employeeSurname: string Surname of the employee
     *                  cellphone: string Cellphone number of the employee
     *                  email: string Email of the employee
     *                  companyName: string Name of the company
     *                  website: string Link to the company's website
     *               }
     *
     *  @TODO Integrate with CrudController and Application
     */
    getBusinessCard(){
        let success;
        let message;
        let data = {};

        // check to see if parameters are present
        let presentParams = false;
        let presentReturn = "";

        if(this.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }

        // check if the parameters are valid if present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";

            if(!this.sharedLogic.validateNonEmpty(this.body.employeeId) || !this.sharedLogic.validateNumeric(this.body.employeeId)){
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }

            if(!invalidParams){
                if(this.demoMode){
                    // return mock data
                    success = true;
                    message = "Business card information loaded successfully - Mock";
                    data.employeeTitle = "Mr";
                    data.employeeName = "Tjaart";
                    data.employeeSurname = "Booyens";
                    data.employeeCellphone = "0791807734";
                    data.employeeEmail = "u17021775@tuks.co.za";
                    data.companyName = "Vast Expanse";
                    data.website = "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications";
                }
                else{
                    // return data from crudController
                    let employeeData = this.sharedLogic.crudController.getEmployee(this.body.employeeId);

                    if(employeeData.success){
                        let companyData = this.sharedLogic.crudController.getCompany(employeeData.data.companyId);

                        if(companyData.success){
                            let buildingData = this.sharedLogic.crudController.getBuilding(employeeData.data.buildingId);

                            if(buildingData.success){
                                success = true;
                                message = "Business card information loaded successfully";
                                data.companyName = companyData.data.companyName;
                                data.companyWebsite = companyData.data.companyWebsite;
                                data.branchName = buildingData.data.branchName;
                                data.latitude = buildingData.data.latitude;
                                data.longitude = buildingData.data.longitude;
                                data.employeeName = employeeData.data.employeeName;
                                data.employeeSurname = employeeData.data.employeeSurname;
                                data.employeeTitle = employeeData.data.employeeTitle;
                                data.employeeCellphone = employeeData.data.employeeCellphone;
                                data.employeeEmail = employeeData.data.employeeEmail;
                            }
                            else{
                                success = companyData.success;
                                message = companyData.message;
                                data = companyData.data;
                            }
                        }
                        else{
                            success = companyData.success;
                            message = companyData.message;
                            data = companyData.data;
                        }
                    }
                    else{
                        success = employeeData.success;
                        message = employeeData.message;
                        data = employeeData.data;
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: " + invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
            }
        }
        else{
            success = false;
            message = "Missing Parameters: " + presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    /**
     *  Function that creates a new client and adds it to the database
     *
     *  @param macAddress string Mac Address of clients device
     *
     *  @return JSON {
     *                  clientId: int ID for client
     *               }
     */
    addClient() {
        let success;
        let message;
        let data = {};

        // check to see if parameters are present
        let presentParams = false;
        let presentReturn = "";

        if (this.body.macAddress === undefined) {
            presentParams = true;
            presentReturn += "macAddress, ";
        }

        // check if the parameters are valid if present
        if (!presentParams) {
            let invalidParams = false;
            let invalidReturn = "";

            if (!this.sharedLogic.validateNonEmpty(this.body.employeeId) || !this.sharedLogic.validateNumeric(this.body.employeeId)) {
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }

        }
        else{
            success = false;
            message = "Missing Parameters: " + presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    /**
     *  Function to edit a clients details
     *
     *  @param clientId int ID of client
     *
     *  @return JSON {
     *                  clientId: int ID of client
     *               }
     */
    editClient(){

    }

    /**
     *  Function to return a client object
     *
     *  @param clientId int ID of client
     *
     *  @return JSON {
     *
     *               }
     */
    getClient(){

    }

    /**
     *  Function to delete a client from the database
     *
     *  @param clientId int ID of client
     *
     *  @return JSON {
     *                  clientId: int ID of client
     *               }
     */
    deleteClient(){

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
    addTempWifi(){

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
    editTempWifi(){

    }

    /**
     *  Function to get temporary wifi access
     *
     *  @param wifiTempAccessId int ID of temporary wifi access
     *
     *  @return JSON {
     *
     *               }
     */
    getTempWifi(){

    }

    /**
     *  Function to delete temporary wifi access
     *
     *  @param wifiTempAccess int ID of temporary wifi access
     *
     *  @return JSON {
     *                  wifiTempAccess: int ID of temporary wifi access
     *               }
     */
    deleteTempWifi(){

    }
}

module.exports = AppLogic;