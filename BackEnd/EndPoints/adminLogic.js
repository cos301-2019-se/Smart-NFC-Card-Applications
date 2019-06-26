/**
 *	File Name:	    adminLogic.js
 *	Project:		Smart-NFC-Application
 *	Orginization:	VastExpanse
 *	Copyright:	    © Copyright 2019 University of Pretoria
 *	Classes:        AppLogic
 *	Related documents:
 *
 *	Update History:
 *	Date		Author		Version		Changes
 *	-----------------------------------------------------------------------------------------
 *	2019/05/19	Duncan		1.0		Original
 *  2019/05/22  Tjaart      1.1     Fixed require filename - sharedLogic.js
 *  2019/06/24  Duncan      2.0     Started functions for demo 3
 *
 *	Functional Description:		 This class is used by our Link Admin Application in order
 *	                            to facilitate all operations needed for the correct operation
 *	                            of the Admin of a company and Link
 *	Error Messages:
 *	Assumptions: 	This file assumes that a there exists a 'sharedLogic' and a 'crudController'
 *                  class.
 *	Constraints: 	None
 */

var SharedLogic = require('./../SharedLogic/sharedLogic.js');
var me = null;

/**
 * 	Purpose:	This class is to allow the admin application of Link to complete its needed operations
 *	Usage:		The class will be used by having /admin/functionName at the end of the http request where
 *              function name is the function the admin application wants to use
 *	@author:	Duncan Vodden
 *	@version:	1.0
 */
class AdminLogic
{
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
     *  into json object and validate the api key/ login , sets up the endpoint and
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
        switch(this.endpoint)
        {
            //Companies
            case "addCompany":
                this.addCompany();  //TEST
                break;
            case "editCompany":
                this.editCompany(); //TEST
                break;
            case "deleteCompany":
                this.deleteCompany();//DONT DO
                break;
            case "getCompanyByCompanyId":
                this.getCompanyByCompanyId();//TEST
                break;
            case "getCompanyByPasswordId":
                this.getCompanyByPasswordId();//TEST
                break;
            case "getCompanies":
                this.getCompanies();//INTEGRATE
                break;

            //Buildings
            case "addBuilding":
                this.addBuilding();//TEST
                break;
            case "editBuilding":
                this.editBuilding();//TEST
                break;
            case "deleteBuilding":
                this.deleteBuilding();//DONT DO
                break;
            case "getBuildingByBuildingId":
                this.getBuildingByBuildingId();//TEST
                break;
            case "getBuildingByCompanyId":
                this.getBuildingByCompanyId();//TEST
                break;

            //Rooms
            case "addRoom":
                this.addRoom();//TEST
                break;
            case "editRoom":
                this.editRoom();//TEST
                break;
            case "deleteRoom":
                this.deleteRoom();//DONT DO
                break;
            case "getRoomByRoomId":
                this.getRoomByRoomId();//TEST
                break;
            case "getRoomsByBuildingId":
                this.getRoomsByBuildingId();//TEST
                break;

            //Employees
            case "addEmployee":
                this.addEmployee();//TEST
                break;
            case "addEmployees":
                this.addEmployees();//TODO
                break;
            case "editEmployee":
                this.editEmployee();//TEST
                break;
            case "deleteEmployee":
                this.deleteEmployee();//DONT DO
                break;
            case "getEmployeeByEmployeeId":
                this.getEmployeeByEmployeeId();//TEST
                break;
            case "getEmployeeByCompanyId":
                this.getEmployeeByCompanyId();//TEST
                break;
            case "getEmployeeByBuildingId":
                this.getEmployeeByBuildingId();//TEST
                break;

            //password
            case "editPassword":
                this.editPassword();//TEST
                break;

            //wifiParams
            case "editWifiParam":
                this.editWifiParam();//TEST
                break;

            default:
                this.sharedLogic.endServe(false, "Invalid Endpoint", null);
        }
    }

    /**
     *  Function that is called to create a company, will use SharedLogic's crudController in order to
     *  complete the operation
     *
     *  @param  companyName string The company name
     *  @param  companyWebsite string The website belonging to the company
     *  @param  companyUsername string The username of the company - for login purposes
     *  @param  companyPassword string the password of the company - for login purposes
     *
     *  @return JSON {
     *                  companyId : int The ID of the company being added
     *               }
     */
    addCompany(){
        var message;
        var data = new Object();
        var success;

        //check to see if parameters are present
        var presentParams = false;
        var presentReturn = "";

        if(me.body.companyName === undefined){
            presentParams = true;
            presentReturn += "companyName, ";
        }
        if(me.body.companyWebsite === undefined){
            presentParams = true;
            presentReturn += "companyWebsite, ";
        }
        if(me.body.companyUsername === undefined){
            presentParams = true;
            presentReturn += "companyUsername, ";
        }
        if(me.body.companyPassword === undefined){
            presentParams = true;
            presentReturn += "companyPassword, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.companyName)){
                invalidParams = true;
                invalidReturn += "companyName, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.companyWebsite)){
                invalidParams = true;
                invalidReturn += "companyWebsite, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.companyUsername)){
                invalidParams = true;
                invalidReturn += "companyUsername, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.companyPassword)){
                invalidParams = true;
                invalidReturn += "companyPassword, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    data.companyId = 0;
                    message = me.body.companyName + " Added! - Mock";
                    success = true;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    var salt = me.sharedLogic.genSalt();
                    var hash = me.sharedLogic.passwordHash(me.body.companyPassword,salt);
                    var expDate = me.sharedLogic.getDate(0);
                    var apiKey = me.sharedLogic.genApiKey(); //need to check for duplicates

                    var passwordObj = new Object();
                    while(passwordObj===undefined || (passwordObj.message.includes("apiKeyThing") && !passwordObj.message.includes("duplicateUsernameThing"))){//TODO change param to actual string if duplicate API KEYS
                        me.sharedLogic.crudController.createPassword(me.body.companyUsername, hash, salt, apiKey, expDate, function(password){
                            passwordObj = password;
                        });
                    }

                    if(passwordObj.success){

                        me.sharedLogic.crudController.createCompany(me.body.companyName, me.body.companyWebsite, passwordObj.data.passwordId, function (companyObj) {

                            if (companyObj.success) {
                                data = companyObj.data;
                                message = me.body.companyName + " Added!";
                                success = true;
                                me.sharedLogic.endServe(success, message, data);
                            } else {
                                data = null;
                                message = companyObj.message;
                                success = false;
                                me.sharedLogic.endServe(success, message, data);
                            }
                        });
                    }
                    else{
                        data = null;
                        message = passwordObj.message;
                        success = false;
                        me.sharedLogic.endServe(success, message, data);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     *  Function that is called to edit a companies details
     *
     *  @param companyId
     *  @param companyName
     *  @param companyWebsite
     *  @param companyUsername
     *
     *  @return JSON {
     *                  companyId : int The company ID that has just be edited
     *               }
     */
    editCompany(){
        var message;
        var data = new Object();
        var success;

        //check to see if parameters are present
        var presentParams = false;
        var presentReturn = "";

        if(me.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        if(me.body.companyName === undefined){
            presentParams = true;
            presentReturn += "companyName, ";
        }
        if(me.body.companyWebsite === undefined){
            presentParams = true;
            presentReturn += "companyWebsite, ";
        }
        if(me.body.companyUsername === undefined){
            presentParams = true;
            presentReturn += "companyWebsite, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.companyId) || !me.sharedLogic.validateNumeric(me.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.companyName)){
                invalidParams = true;
                invalidReturn += "companyName, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.companyWebsite)){
                invalidParams = true;
                invalidReturn += "companyWebsite, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.companyUsername)){
                invalidParams = true;
                invalidReturn += "companyUsername, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    data.companyId = me.body.companyId;
                    message = me.body.companyName + " edited! - Mock";
                    success = true;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.updateCompany(me.body.companyId, me.body.companyName, me.body.companyWebsite, undefined, function(companyObj){
                       if(companyObj.success){
                           success = companyObj.success;
                           message = me.body.companyName + " edited!";
                           data.companyId = me.body.companyId;
                           me.sharedLogic.endServe(success, message, data);
                       }
                       else{
                           success = companyObj.success;
                           message = companyObj.message;
                           data = null;
                           me.sharedLogic.endServe(success, message, data);
                       }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     *  This function is used by the Link admin to delete an existing company
     *
     *  @param companyId int The company to be deleted
     *
     *  @return JSON {
     *                  companyId : int The ID of the company just deleted
     *               }
     */
    deleteCompany(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.companyId = this.body.companyId;
                    message = "Company Deleted! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Delete Company not implemented";
                    data = null;
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    /**
     * Function used to get an individual company Object using the company ID
     *
     * @param companyId int The ID used to retrieve the company object
     *
     * @return JSON {
     *                  companyName string The name of the company retrieved
     *                  companyWebsite string The website of the company
     *                  companyId int the ID of the retrieved company
     *                  passwordId int The ID of the password record belonging to that company
     *              }
     */
    getCompanyByCompanyId(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.companyId) || !me.sharedLogic.validateNumeric(me.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    data.companyName = "Vast Expanse";
                    data.companyWebsite = "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications";
                    data.companyId = me.body.companyId;
                    data.passwordId = 0;
                    message = "Retrieved "+data.companyName+"! - Mock";
                    success = true;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.getCompanyByCompanyId(me.body.companyId, function(companyObj){
                        if(companyObj.success){
                            success = companyObj.success;
                            message = "Retrieved "+ companyObj.data.companyName+"!";
                            data = companyObj.data;
                            me.sharedLogic.endServe(success, message, data);

                        }else{
                            success = companyObj.success;
                            message = companyObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * Function used to get an individual company Object using the Password ID
     *
     * @param passwordId int The ID used to retrieve the company object
     *
     * @return JSON {
     *                  companyName string The name of the company retrieved
     *                  companyWebsite string The website of the company
     *                  companyId int the ID of the retrieved company
     *                  passwordId int The ID of the password record belonging to that company
     *              }
     */
    getCompanyByPasswordId(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.passwordId === undefined){
            presentParams = true;
            presentReturn += "passwordId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.passwordId) || !me.sharedLogic.validateNumeric(me.body.passwordId)){
                invalidParams = true;
                invalidReturn += "passwordId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    data.companyName = "Vast Expanse";
                    data.companyWebsite = "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications";
                    data.companyId = 0;
                    data.passwordId = me.body.passwordId;
                    message = "Retrieved "+data.companyName+"! - Mock";
                    success = true;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.getCompanyByPasswordId(me.body.passwordId, function(companyObj){
                        if(companyObj.success){
                            success = companyObj.success;
                            message = "Retrieved "+ companyObj.data.companyName+"!";
                            data = companyObj.data;
                            me.sharedLogic.endServe(success, message, data);

                        }else{
                            success = companyObj.success;
                            message = companyObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This function will be used by Link admins to get a list of all the registered companies
     *
     * @return Array of JSON {
     *                          //TODO
     *                      }
     */
    getCompanies(){
        var message;
        var success;
        var data = new Object();
        if(this.demoMode){
            //return mock data
            success = false;
            message = "Get Companies body not known";
            data = null;
        }
        else{
            //return data from crudController
            success = false;
            message = "Get Companies not integrated";
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    /**
     * This function will be used to create buildings belonging to a specific company
     *
     * @param buildingBranchName string The Name of the branch i.e Link Johannesburg
     * @param buildingLatitude string The latitude of the building being created
     * @param buildingLongitude string The longitude of the building being created
     * @param companyId int The company ID that the building belongs to
     * @param networkSsid string The name of the wifi for guests to connect for
     * @param networkType string The type of the wifi network for guests to connect to
     * @param networkPassword string The password for the wifi network for access to the wifi for guests
     *
     * @return JSON {
     *                  buildingId int The ID of the building
     *              }
     */
    addBuilding(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.buildingBranchName === undefined){
            presentParams = true;
            presentReturn += "buildingBranchName, ";
        }
        if(me.body.buildingLatitude === undefined){
            presentParams = true;
            presentReturn += "buildingLatitude, ";
        }
        if(me.body.buildingLongitude === undefined){
            presentParams = true;
            presentReturn += "buildingLongitude, ";
        }
        if(me.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        if(me.body.networkSsid === undefined){
            presentParams = true;
            presentReturn += "networkSsid, ";
        }
        if(me.body.networkType === undefined){
            presentParams = true;
            presentReturn += "networkType, ";
        }
        if(me.body.networkPassword === undefined){
            presentParams = true;
            presentReturn += "networkPassword, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.buildingBranchName)){
                invalidParams = true;
                invalidReturn += "buildingBranchName, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.buildingLatitude)){
                invalidParams = true;
                invalidReturn += "buildingLatitude, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.buildingLongitude)){
                invalidParams = true;
                invalidReturn += "buildingLongitude, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.companyId) || !me.sharedLogic.validateNumeric(me.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.networkSsid)){
                invalidParams = true;
                invalidReturn += "networkSsid, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.networkType)){
                invalidParams = true;
                invalidReturn += "networkType, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.networkPassword)){
                invalidParams = true;
                invalidReturn += "networkPassword, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    data.buildingId = 0;
                    message = "Building added! - Mock";
                    success = true;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.createWiFiParams(me.body.networkSsid, me.body.networkType, me.body.networkPassword, function(wifiObj) {
                        if(wifiObj.success){
                            me.sharedLogic.crudController.createBuilding(me.body.buildingLatitude, me.body.buildingLongitude, me.body.buildingBranchName, me.body.companyId, wifiObj.data.wifiParamsId, function(buildingObj){
                                if(buildingObj.success){
                                    success = buildingObj.success;
                                    message =  me.body.buildingBranchName+" created!";
                                    data = buildingObj.data;
                                    me.sharedLogic.endServe(success, message, data);
                                }
                                else{
                                    success = buildingObj.success;
                                    message = buildingObj.message;
                                    data = null;
                                    me.sharedLogic.endServe(success, message, data);
                                }
                            });
                        }
                        else{
                          success = wifiObj.success;
                          message = wifiObj.message;
                          data = null;
                          me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This function will be used to update a buildings details
     *
     * @param buildingId int The building ID of the building to be changed
     * @param buildingBranchName string The new name of the branch
     * @param buildingLatitude string The new Latitude of the branch
     * @param buildingLongitude string the new Longitude of the branch
     *
     * @return JSON {
     *                  buildingId int The ID of the building being updated
     *              }
     */
    editBuilding(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        if(me.body.buildingBranchName === undefined){
            presentParams = true;
            presentReturn += "buildingBranchName, ";
        }
        if(me.body.buildingLatitude === undefined){
            presentParams = true;
            presentReturn += "buildingLatitude, ";
        }
        if(me.body.buildingLongitude === undefined){
            presentParams = true;
            presentReturn += "buildingLongitude, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.buildingId) || !me.sharedLogic.validateNumeric(me.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.buildingBranchName)){
                invalidParams = true;
                invalidReturn += "buildingBranchName, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.buildingLatitude)){
                invalidParams = true;
                invalidReturn += "buildingLatitude, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.buildingLongitude)){
                invalidParams = true;
                invalidReturn += "buildingLongitude, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.wifiParamId) || !me.sharedLogic.validateNumeric(me.body.wifiParamId)){
                invalidParams = true;
                invalidReturn += "wifiParamId, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.networkSsid)){
                invalidParams = true;
                invalidReturn += "networkSsid, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.networkType)){
                invalidParams = true;
                invalidReturn += "networkType, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.networkPassword)){
                invalidParams = true;
                invalidReturn += "networkPassword, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    data.buildingId = me.body.buildingId;
                    message = "Building edited! - Mock";
                    success = true;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController

                    me.sharedLogic.crudController.updateBuilding(me.body.buildingId, me.body.buildingLatitude, me.body.buildingLongitude, me.body.buildingBranchName,  undefined, undefined, function(buildingObj){
                        if(buildingObj.success){
                            success = buildingObj.success;
                            message = "Building Edited!";
                            data.buildingId = me.body.buildingId;
                        }
                        else{
                            success = buildingObj.success;
                            message = buildingObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     *  This function is used by the company admin to delete an existing building
     *
     *  @param buildingId int The building to be deleted
     *
     *  @return JSON {
     *                  buildingId : int The ID of the building just deleted
     *               }
     */
    deleteBuilding(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingId) || !this.sharedLogic.validateNumeric(this.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.buildingId = this.body.buildingId;
                    message = "Building Deleted! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Delete building not implemented";
                    data = null;
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    /**
     * This function will be used to return a single Building object
     *
     * @param buildingId int The building ID used to get the building object
     *
     * @return JSON {
     *                  buildingId int The ID belonging to the Building
     *                  latitude string The latitude of the building
     *                  longitude string the longitude of the building
     *                  branchName string the name of the building
     *                  companyId int the ID of the company that the building belongs to
     *                  wifiParamsId int the ID of the wifi params that belong to the building
     *              }
     */
    getBuildingByBuildingId(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.buildingId) || !me.sharedLogic.validateNumeric(me.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    success = true;
                    message = "Retrieved Building! - mock";
                    data.buildingId = me.body.buildingId ;
                    data.latitude = "20,120,10";
                    data.longitude = "20,120,10";
                    data.branchName = "Vast Expanse JHB";
                    data.companyId = 0 ;
                    data.wifiParamsId = 0;

                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.getBuildingByBuildingId(me.body.buildingId, function(buildingObj){

                       if(buildingObj.success){
                           success = buildingObj.success;
                           message = "Building Retrieved!";
                           data = buildingObj.data;
                           me.sharedLogic.endServe(success, message, data);
                       }
                       else{
                           success = buildingObj.success;
                           message = buildingObj.message;
                           data = null;
                           me.sharedLogic.endServe(success, message, data);
                       }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This function will be used to retrieve all the buildings belonging to a certain company
     *
     * @param companyId int the company that the building objects belong to
     *
     * @return an Array of JSON {
     *                  buildingId int The ID belonging to the Building
     *                  latitude string The latitude of the building
     *                  longitude string the longitude of the building
     *                  branchName string the name of the building
     *                  companyId int the ID of the company that the building belongs to
     *                  wifiParamsId int the ID of the wifi params that belong to the building
     *                          }
     */
    getBuildingByCompanyId(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.companyId) || !me.sharedLogic.validateNumeric(me.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    success = true;
                    message = "Retrieved Building! - mock";
                    data = [];
                    data.push({
                        buildingId : 0,
                        buildingLatitude : "20,120,10",
                        buildingLongitude : "20,120,10",
                        buildingBranchName : "Vast Expanse JHB",
                        companyId : me.body.companyId,
                        wifiParamsId : 0
                    });

                    data.push({
                        buildingId : 1,
                        buildingLatitude : "20,120,10",
                        buildingLongitude : "20,120,10",
                        buildingBranchName : "Vast Expanse PTA",
                        companyId : me.body.companyId,
                        wifiParamsId : 1
                    });

                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.getBuildingByCompanyId(me.body.buildingId, function(buildingObj){

                        if(buildingObj.success){
                            success = buildingObj.success;
                            message = "Buildings Retrieved!";
                            data = buildingObj.data;
                            me.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            success = buildingObj.success;
                            message = buildingObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This Function used to add a room to a specific buildings
     *
     * @param roomName string The name of the room being added
     * @param parentRoomList string A comma separated list of the rooms preceding the room being added
     * @param buildingId int the building
     *
     * @return JSON {
     *                  roomId
     *              }
     */
    addRoom(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.roomName === undefined){
            presentParams = true;
            presentReturn += "roomName, ";
        }
        if(me.body.parentRoomList === undefined){
            presentParams = true;
            presentReturn += "parentRoomList, ";
        }
        if(me.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.roomName)){
                invalidParams = true;
                invalidReturn += "roomName, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.parentRoomList)){
                invalidParams = true;
                invalidReturn += "parentRoomList, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.buildingId) || !me.sharedLogic.validateNumeric(me.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    data.roomId = 0;
                    message = "Room added! - Mock";
                    success = true;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.createRoom(me.body.roomName, me.body.parentRoomList, me.body.buildingId, function(roomObj){
                        if(roomObj.success){
                            success = roomObj.success;
                            message = me.body.roomName + " added!";
                            data = roomObj.data;
                            me.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            success = roomObj.success;
                            message = roomObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This Function will be used to edit a room belonging to a building
     *
     * @param roomId int The ID of the room to be changed
     * @param roomName string The new name of the room being changed
     * @param parentRoomList string a comma separated list of the parent rooms
     *
     * @return JSON {
     *                  roomId int The ID of the room just changed
     *              }
     */
    editRoom(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.roomId === undefined){
            presentParams = true;
            presentReturn += "roomId, ";
        }
        if(me.body.roomName === undefined){
            presentParams = true;
            presentReturn += "roomName, ";
        }
        if(me.body.parentRoomList === undefined){
            presentParams = true;
            presentReturn += "parentRoomList, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.roomId) || !me.sharedLogic.validateNumeric(me.body.roomId)){
                invalidParams = true;
                invalidReturn += "roomId, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.roomName)){
                invalidParams = true;
                invalidReturn += "roomName, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.parentRoomList)){
                invalidParams = true;
                invalidReturn += "parentRoomList, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    data.roomId = me.body.roomId;
                    message = "Room edited! - Mock";
                    success = true;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.updateRoom(me.body.roomId, me.body.roomName, me.body.parentRoomList, undefined, function(roomObj){
                        if(roomObj.success){
                            success = roomObj.success;
                            message = "Room updated!";
                            data.roomId = me.body.roomId;
                            me.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            success = roomObj.success;
                            message = roomObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     *  This function is used by the company admin to delete an existing room
     *
     *  @param roomId int The room to be deleted
     *
     *  @return JSON {
     *                  roomId : int The ID of the room just deleted
     *               }
     */
    deleteRoom(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(this.body.roomId === undefined){
            presentParams = true;
            presentReturn += "roomId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.roomId) || !this.sharedLogic.validateNumeric(this.body.roomId)){
                invalidParams = true;
                invalidReturn += "roomId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.roomId = this.body.roomId;
                    message = "Building Deleted! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Delete room not implemented";
                    data = null;
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    /**
     * This function will be used to return a single Room object
     *
     * @param roomId int The Room ID used to get the Room object
     *
     * @return JSON {
     *                  roomId int The ID of the retrieved Room
     *                  roomName string The name of the Room being retrieved
     *                  parentRoomList string The comma seperated list of the parent rooms
     *                  buildingId int the Id of the building that the rooms belong to
     *              }
     */
    getRoomByRoomId(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.roomId === undefined){
            presentParams = true;
            presentReturn += "roomId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.roomId) || !me.sharedLogic.validateNumeric(me.body.roomId)){
                invalidParams = true;
                invalidReturn += "roomId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    success = true;
                    message = "Room Retrieved!- Mock";
                    data.roomId = 2;
                    data.roomName = "Houston";
                    data.parentRoomList = "0,1";
                    data.buildingId = 0;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.getRoomByRoomId(me.body.roomId, function(roomObj){
                        if(roomObj.success){
                            success = roomObj.success;
                            message = "Room Retrieved!";
                            data = roomObj.data;
                            me.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            success = roomObj.success;
                            message = roomObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This function will be used to retrieve all the buildings belonging to a certain company
     *
     * @param buildingId int the Building ID that the rooms belong to
     *
     * @return an Array of JSON {
     *                              roomId int The ID of the retrieved Room
     *                              roomName string The name of the Room being retrieved
     *                              parentRoomList string The comma seperated list of the parent rooms
     *                              buildingId int the Id of the building that the rooms belong to
     *                          }
     */
    getRoomsByBuildingId(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.buildingId) || !me.sharedLogic.validateNumeric(me.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    success = true;
                    message = "Rooms Retrieved!- Mock";
                    data = [];
                    data.push({
                        roomId : 2,
                        roomName : "Houston",
                        parentRoomList : "0,1",
                        buildingId : 0,
                    });
                    data.push({
                        roomId : 3,
                        roomName : "Houston",
                        parentRoomList : "0,1,2",
                        buildingId : 0,
                    });
                        me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.getRoomsByBuildingId(me.body.getRoomsByBuildingId, function(roomObj){
                        if(roomObj.success){
                            success = roomObj.success;
                            message = "Rooms Retrieved!";
                            data = roomObj.data;
                            me.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            success = roomObj.success;
                            message = roomObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * Function that is called to create an employee, will use SharedLogic's crudController in order
     * to complete the operation. It will create an Employee belonging to the Company ID passed in through
     * the parameter
     *
     * @param   employeeName string The name of the employee
     * @param   employeeSurname string The surname of the employee
     * @param   employeeTitle string The Title of the employee e.g Mr/Mrs
     * @param   employeeCellphone string The Cellphone number of the employee
     * @param   employeeEmail string The email address of the employee - used for login purposes
     * @param   companyId int The ID of the company to which the employee is being added to
     * @param   buildingId int The building that the employee works at
     * @param   employeePassword string The Password chosen by the employee - for login purposes
     *
     * @return JSON {
     *                  employeeId : int The ID of the employee being added
     *              }
     */
    addEmployee(){
        var data = new Object();
        var message;
        var success;

        //check if parameters are present
        var presentParams = false;
        var presentReturn = "";

        if(me.body.employeeName === undefined){
            presentParams = true;
            presentReturn += "employeeName, ";
        }
        if(me.body.employeeSurname === undefined){
            presentParams = true;
            presentReturn += "employeeSurname, ";
        }
        if(me.body.employeeTitle === undefined){
            presentParams = true;
            presentReturn += "employeeTitle, ";
        }
        if(me.body.employeeCellphone === undefined){
            presentParams = true;
            presentReturn += "employeeCellphone, ";
        }
        if(me.body.employeeEmail === undefined){
            presentParams = true;
            presentReturn += "employeeEmail, ";
        }
        if(me.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        if(me.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        if(me.body.employeePassword === undefined){
            presentParams = true;
            presentReturn += "employeePassword, ";
        }
        //if parameters are present, validate if correct format
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.employeeName) || !me.sharedLogic.validateAlpha(me.body.employeeName)){
                invalidParams = true;
                invalidReturn += "employeeName, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.employeeSurname) || !me.sharedLogic.validateAlpha(me.body.employeeSurname)){
                invalidParams = true;
                invalidReturn += "employeeSurname, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.employeeTitle)){
                invalidParams = true;
                invalidReturn += "employeeTitle, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.employeeCellphone) || !me.sharedLogic.validateCellphone(me.body.employeeCellphone)){
                invalidParams = true;
                invalidReturn += "employeeCellphone, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.employeeEmail) || !me.sharedLogic.validateEmail(me.body.employeeEmail)){
                invalidParams = true;
                invalidReturn += "employeeEmail, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.companyId) || !me.sharedLogic.validateNumeric(me.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.buildingId) || !me.sharedLogic.validateNumeric(me.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.employeePassword)){
                invalidParams = true;
                invalidReturn += "employeePassword, ";
            }
            //if valid parameters then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    data.employeeId = 0;
                    message = "Employee Added! - Mock";
                    success = true;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController

                    var salt = me.sharedLogic.genSalt();
                    var hash = me.sharedLogic.passwordHash(me.body.companyPassword,salt);
                    var expDate = me.sharedLogic.getDate(0);
                    var apiKey = me.sharedLogic.genApiKey(); //need to check for duplicates

                    var passwordObj = new Object();
                    while(passwordObj===undefined || (passwordObj.message.includes("apiKeyThing") && !passwordObj.message.includes("duplicateUsernameThing"))){//TODO change param to actual string if duplicate API KEYS
                        me.sharedLogic.crudController.createPassword(me.body.employeeEmail, hash, salt, apiKey, expDate, function(password){
                            passwordObj = password;
                        });
                    }

                    if(passwordObj.success){
                        me.sharedLogic.crudController.createEmployee(me.body.employeeName, me.body.employeeSurname,
                                                                    me.body.employeeTitle, me.body.employeeCellphone,
                                                                    me.body.employeeEmail, me.body.companyId,
                                                                    passwordObj.data.passwordId, function(employeeObj){
                            if(employeeObj.success){
                                success = employeeObj.success;
                                message = "Employee Added!";
                                data = employeeObj.data;
                                me.sharedLogic.endServe(success, message, data);
                            }
                            else{
                                success = employeeObj.success;
                                message = employeeObj.message;
                                data = null;
                                me.sharedLogic.endServe(success, message, data);
                            }
                        });
                    }
                    else{
                        success = passwordObj.success;
                        message = passwordObj.success;
                        data = null;
                        me.sharedLogic.endServe(success, message, data);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * Function to add a bulk amount of employees, it will create employees belonging to a company ID
     * Params are an array of objects containing the parameters
     *
     * @param   employeeName string The name of the employee
     * @param   employeeSurname string The surname of the employee
     * @param   employeeTitle string The Title of the employee e.g Mr/Mrs
     * @param   employeeCellphone string The Cellphone number of the employee
     * @param   employeeEmail string The email address of the employee - used for login purposes
     * @param   companyId int The ID of the company to which the employee is being added to
     * @param   buildingId int The building that the employee works at
     * @param   employeePassword string The Password chosen by the employee - for login purposes
     */
    addEmployees(){}

    /**
     * Function used to change an employees details
     *
     * @param employeeId int The ID of the employee to be changed
     * @param employeeName string The name of the employee
     * @param employeeSurname string The surname of the employee
     * @param employeeTitle string The Title of the employee e.g Mr/Mrs
     * @param employeeCellphone string The Cellphone number of the employee
     * @param employeeEmail string The email address of the employee - used for login purposes
     * @param buildingId int The building that the employee works at
     *
     * @return JSON {
     *                  employeeId : int The ID of the employee being added
     *              }
     */
    editEmployee(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }
        if(me.body.employeeName === undefined){
            presentParams = true;
            presentReturn += "employeeName, ";
        }
        if(me.body.employeeSurname === undefined){
            presentParams = true;
            presentReturn += "employeeSurname, ";
        }
        if(me.body.employeeTitle === undefined){
            presentParams = true;
            presentReturn += "employeeTitle, ";
        }
        if(me.body.employeeCellphone === undefined){
            presentParams = true;
            presentReturn += "employeeCellphone, ";
        }
        if(me.body.employeeEmail === undefined){
            presentParams = true;
            presentReturn += "employeeEmail, ";
        }
        if(me.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.employeeId) || !me.sharedLogic.validateNumeric(me.body.employeeId)){
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.employeeName) || !me.sharedLogic.validateAlpha(me.body.employeeName)){
                invalidParams = true;
                invalidReturn += "employeeName, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.employeeSurname) || !me.sharedLogic.validateAlpha(me.body.employeeSurname)){
                invalidParams = true;
                invalidReturn += "employeeSurname, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.employeeTitle)){
                invalidParams = true;
                invalidReturn += "employeeTitle, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.employeeCellphone) || !me.sharedLogic.validateCellphone(me.body.employeeCellphone)){
                invalidParams = true;
                invalidReturn += "employeeCellphone, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.employeeEmail) || !me.sharedLogic.validateEmail(me.body.employeeEmail)){
                invalidParams = true;
                invalidReturn += "employeeEmail, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.buildingId) || !me.sharedLogic.validateNumeric(me.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    data.employeeId = me.body.employeeId;
                    message = "Employee edited! - Mock";
                    success = true;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.updateEmployee(me.body.employeeId, me.body.employeeName, me.body.employeeSurname, me.body.employeeTitle,
                                                                me.body.employeeCellphone, me.body.employeeEmail, undefined, me.body.buildingId,
                                                                undefined, function(employeeObj){
                        if(employeeObj.success){
                            success = employeeObj.success;
                            message = "Employee Edited!";
                            data.employeeId = me.body.employeeId;
                            me.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            success = employeeObj.success;
                            message = employeeObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     *  This function is used by the company admin to delete an existing Employee
     *
     *  @param employeeId int The Employee to be deleted
     *
     *  @return JSON {
     *                  employeeId : int The ID of the Employee just deleted
     *               }
     */
    deleteEmployee(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(this.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeId) || !this.sharedLogic.validateNumeric(this.body.employeeId)){
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.employeeId = this.body.employeeId;
                    message = "employeeId Deleted! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Delete Employee not implemented";
                    data = null;
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    /**
     * This function will be used to return a single Employee object
     *
     * @param employeeId int The Employee ID used to get the Employee object
     *
     * @return JSON {
     *                 employeeId int The ID belonging to that employee
     *                 firstName string The name of the employee
     *                 surname string The surname of the employee
     *                 title string The title of the employee
     *                 cellphone string the cell number of the employee
     *                 email string the email address of the employee
     *                 companyId int the Company ID that the employee belongs to
     *                 buildingId int the Building ID where the employee works for
     *                 passwordId int The Password ID belonging to the Employee
     *              }
     */
    getEmployeeByEmployeeId(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.employeeId) || !me.sharedLogic.validateNumeric(me.body.employeeId)){
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    success = true;
                    message = "Employee Retrieved! - Mock";
                    data.employeeId = 0;
                    data.firstName = "Piet";
                    data.surname = "Pompies";
                    data.title = "Mr";
                    data.cellphone = "0791637273";
                    data.email = "piet.pompies@gmail.com";
                    data.companyId = 0;
                    data.buildingId = 0;
                    data.passwordId = 0;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.getEmployeeByEmployeeId(me.body.employeeId, function(employeeObj){
                        if(employeeObj.success){
                            success = employeeObj.success;
                            message = "Employee Retrieved!";
                            data = employeeObj.data;
                            me.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            success = employeeObj.success;
                            message = employeeObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This function will be used to return a single Employee object
     *
     * @param companyId int The company ID used to get the Employee object
     *
     * @return an Array of JSON {
     *                 employeeId int The ID belonging to that employee
     *                 firstName string The name of the employee
     *                 surname string The surname of the employee
     *                 title string The title of the employee
     *                 cellphone string the cell number of the employee
     *                 email string the email address of the employee
     *                 companyId int the Company ID that the employee belongs to
     *                 buildingId int the Building ID where the employee works for
     *                 passwordId int The Password ID belonging to the Employee
     *              }
     */
    getEmployeeByCompanyId(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.companyId) || !me.sharedLogic.validateNumeric(me.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    success = true;
                    message = "Employees Retrieved!- Mock";
                    data = [];
                    data.push({
                        employeeId:0,
                        firstName:"Duncan",
                        surname:"Vodden",
                        title:"Mr",
                        cellphone:"0724904115",
                        email:"duncan@gmail.com",
                        companyId:me.body.companyId,
                        buildingId:0,
                        passwordId:0
                    });
                    data.push({
                        employeeId : 1,
                        firstName : "Piet",
                        surname : "Pompies",
                        title : "Mr",
                        cellphone : "0791637273",
                        email : "piet.pompies@gmail.com",
                        companyId : me.body.companyId,
                        buildingId : 0,
                        passwordId : 0
                    });
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.getEmployeeByCompanyId(me.body.companyId, function(employeeObj){
                        if(employeeObj.success){
                            success = employeeObj.success;
                            message = "Employees Retrieved!";
                            data = employeeObj.data;
                            me.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            success = employeeObj.success;
                            message = employeeObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This function will be used to return a single Employee object
     *
     * @param buildingId int The building ID used to get the Employee object
     *
     * @return an Array of JSON {
     *                 employeeId int The ID belonging to that employee
     *                 firstName string The name of the employee
     *                 surname string The surname of the employee
     *                 title string The title of the employee
     *                 cellphone string the cell number of the employee
     *                 email string the email address of the employee
     *                 companyId int the Company ID that the employee belongs to
     *                 buildingId int the Building ID where the employee works for
     *                 passwordId int The Password ID belonging to the Employee
     *              }
     */
    getEmployeeByBuildingId(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.buildingId) || !me.sharedLogic.validateNumeric(me.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    success = true;
                    message = "Employees Retrieved!- Mock";
                    data = [];
                    data.push({
                            employeeId : 0,
                            firstName : "Duncan",
                            surname : "Vodden",
                            title : "Mr",
                            cellphone : "0724904115",
                            email: "duncan@gmail.com",
                            companyId: 0,
                            buildingId: me.body.buildingId,
                            passwordId: 0
                    });
                    data.push({
                        employeeId : 1,
                        firstName : "Piet",
                        surname : "Pompies",
                        title : "Mr",
                        cellphone : "0791637273",
                        email : "piet.pompies@gmail.com",
                        companyId : 0,
                        buildingId : me.body.buildingId,
                        passwordId : 1
                    });
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.getEmployeeByBuildingId(me.body.buildingId, function(employeeObj){
                        if(employeeObj.success){
                            success = employeeObj.success;
                            message = "Employees Retrieved!";
                            data = employeeObj.data;
                            me.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            success = employeeObj.success;
                            message = employeeObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This Function will be used to change the password
     *
     * @params apiKey
     * @params username
     * @params oldPassword
     * @params newPassword
     *
     * @return {}
     */
    editPassword(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.apiKey === undefined){
            presentParams = true;
            presentReturn += "apiKey, ";
        }
        if(me.body.username === undefined){
            presentParams = true;
            presentReturn += "username, ";
        }
        if(me.body.oldPassword === undefined){
            presentParams = true;
            presentReturn += "oldPassword, ";
        }
        if(me.body.newPassword === undefined){
            presentParams = true;
            presentReturn += "newPassword, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!me.sharedLogic.validateNonEmpty(me.body.apiKey)){
                invalidParams = true;
                invalidReturn += "apiKey, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.username)){
                invalidParams = true;
                invalidReturn += "username, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.oldPassword)){
                invalidParams = true;
                invalidReturn += "oldPassword, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.newPassword)){
                invalidParams = true;
                invalidReturn += "newPassword, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    success = true;
                    message = "Password Successfully changed!";
                    data = null;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.getPasswordByApiKey(me.body.apiKey, function(apiKeyObj){
                        if(apiKeyObj.success){
                            if(apiKeyObj.data.hash === me.sharedLogic.passwordHash(me.body.oldPassword,apiKeyObj.data.salt)){
                                var newSalt = me.sharedLogic.genSalt();
                                me.sharedLogic.crudController.updatePassword(undefined, me.body.username, me.sharedLogic.passwordHash(me.body.newPassword,newSalt), newSalt, undefined, undefined, function(passwordObj){
                                   if(passwordObj.success) {
                                        success = passwordObj.success;
                                        message = "Password Successfully changed!";
                                        data = null;
                                        me.sharedLogic.endServe(success, message, data);
                                   }
                                   else{
                                       success = passwordObj.success;
                                       message = passwordObj.message;
                                       data = null;
                                       me.sharedLogic.endServe(success, message, data);
                                   }
                                });
                            }else{
                                success = false;
                                message = "Old Passwords do not match";
                                data = null;
                                me.sharedLogic.endServe(success, message, data);
                            }

                        }else{
                            success = apiKeyObj.success;
                            message = apiKeyObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This function will be used to edit wifi details of a building
     *
     * @param wifiParamsId int The wifi param ID corresponding to the wifi table belonging to that building
     * @param networkSsid string The new network SSID of the building
     * @param networkType string The new Type of the network of the building
     * @param networkPassword string The new Password of the network
     *
     * @return JSON {
     *                  wifiParamsId int The ID belonging to the wifi params for a building
     *              }
     */
    editWifiParam(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(me.body.wifiParamsId === undefined){
            presentParams = true;
            presentReturn += "wifiParamsId, ";
        }
        if(me.body.networkSsid === undefined){
            presentParams = true;
            presentReturn += "networkSsid, ";
        }
        if(me.body.networkType === undefined){
            presentParams = true;
            presentReturn += "networkType, ";
        }
        if(me.body.networkPassword === undefined){
            presentParams = true;
            presentReturn += "networkPassword, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";

            if(!me.sharedLogic.validateNonEmpty(me.body.wifiParamsId) || !me.sharedLogic.validateNumeric(me.body.wifiParamsId)){
                invalidParams = true;
                invalidReturn += "wifiParamsId, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.networkSsid)){
                invalidParams = true;
                invalidReturn += "networkSsid, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.networkType)){
                invalidParams = true;
                invalidReturn += "networkType, ";
            }
            if(!me.sharedLogic.validateNonEmpty(me.body.networkPassword)){
                invalidParams = true;
                invalidReturn += "networkPassword, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(me.demoMode){
                    //return mock data
                    data.wifiParamsId = me.body.wifiParamsId;
                    message = "WiFi edited! - Mock";
                    success = true;
                    me.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    me.sharedLogic.crudController.updateWiFiParams(me.body.wifiParamsId, me.body.networkSsid, me.body.networkType, me.body.networkPassword, function(wifiObj){
                        if(wifiObj.success){
                            success = wifiObj.success;
                            message = "WiFi Edited!";
                            data.wifiParamsId = me.body.wifiParamsId;
                        }
                        else{
                            success = wifiObj.success;
                            message = wifiObj.message;
                            data = null;
                            me.sharedLogic.endServe(success, message, data);
                        }
                    });
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                me.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            me.sharedLogic.endServe(success, message, data);
        }
    }
}

module.exports = AdminLogic;
