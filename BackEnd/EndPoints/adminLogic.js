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
// var demoMode = true;

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
                this.addCompany();  //INTEGRATE
                break;
            case "editCompany":
                this.editCompany(); //INTEGRATE
                break;
            case "deleteCompany":
                this.deleteCompany();//INTEGRATE - DONT DO
                break;
            case "getCompany":
                this.getCompany();//INTEGRATE
                break;
            case "getCompanies":
                this.getCompanies();//INTEGRATE
                break;

            //Buildings
            case "addBuilding":
                this.addBuilding();//INTEGRATE
                break;
            case "editBuilding":
                this.editBuilding();//INTEGRATE
                break;
            case "deleteBuilding":
                this.deleteBuilding();//INTEGRATE - DONT DO
                break;
            case "getBuilding":
                this.getBuilding();//INTEGRATE
                break;
            case "getBuildings":
                this.getBuildings();//INTEGRATE
                break;

            //Rooms
            case "addRoom":
                this.addRoom();//INTEGRATE
                break;
            case "editRoom":
                this.editRoom();//INTEGRATE
                break;
            case "deleteRoom":
                this.deleteRoom();//INTEGRATE - DONT DO
                break;
            case "getRoom":
                this.getRoom();//INTEGRATE
                break;
            case "getRooms":
                this.getRooms();//INTEGRATE
                break;

            //Employees
            case "addEmployee":
                this.addEmployee();//INTEGRATE
                break;
            case "addEmployees":
                this.addEmployees();//TODO
                break;
            case "editEmployee":
                this.editEmployee();//INTEGRATE
                break;
            case "deleteEmployee":
                this.deleteEmployee();//INTEGRATE - DONT DO
                break;
            case "getEmployee":
                this.getEmployee();//INTEGRATE
                break;
            case "getEmployees":
                this.getEmployees();//INTEGRATE
                break;

            //password
            case "editPassword":
                this.editPassword();//INTEGRATE
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

        if(this.body.companyName === undefined){
            presentParams = true;
            presentReturn += "companyName, ";
        }
        if(this.body.companyWebsite === undefined){
            presentParams = true;
            presentReturn += "companyWebsite, ";
        }
        if(this.body.companyUsername === undefined){
            presentParams = true;
            presentReturn += "companyUsername, ";
        }
        if(this.body.companyPassword === undefined){
            presentParams = true;
            presentReturn += "companyPassword, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.companyName)){
                invalidParams = true;
                invalidReturn += "companyName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyWebsite)){
                invalidParams = true;
                invalidReturn += "companyWebsite, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyUsername)){
                invalidParams = true;
                invalidReturn += "companyUsername, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyPassword)){
                invalidParams = true;
                invalidReturn += "companyPassword, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.companyId = 0;
                    message = this.body.companyName + " Added! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    var passwordId = this.sharedLogic.crudController.createPassword(this.body.companyUsername, this.body.companyPassword);

                    if(passwordId.success){

                        var companyId = this.sharedLogic.crudController.createCompany(this.body.companyName, this.body.companyWebsite, passwordId.data.passwordId);

                        if(companyId.success){
                            data.companyId = companyId.data.companyId;
                            message = this.body.companyName + " Added!";
                            success = true;
                        }
                        else{
                            data = null;
                            message = companyId.message;
                            success = false;
                        }
                    }
                    else{
                        data = null;
                        message = passwordId.message;
                        success = false
                    }
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

        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        if(this.body.companyName === undefined){
            presentParams = true;
            presentReturn += "companyName, ";
        }
        if(this.body.companyWebsite === undefined){
            presentParams = true;
            presentReturn += "companyWebsite, ";
        }
        if(this.body.companyUsername === undefined){
            presentParams = true;
            presentReturn += "companyWebsite, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyName)){
                invalidParams = true;
                invalidReturn += "companyName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyWebsite)){
                invalidParams = true;
                invalidReturn += "companyWebsite, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyUsername)){
                invalidParams = true;
                invalidReturn += "companyUsername, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.companyId = this.body.companyId;
                    message = this.body.companyName + " edited! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Edit Company not integrated yet";
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
     *                  //TODO
     *              }
     */
    getCompany(){
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
                    data.companyName = "Vast Expanse";
                    data.website = "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications";
                    data.companyId = this.body.companyId;
                    data.passwordId = 0;
                    message = "Retrieved "+data.companyName+"! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Get Company not integrated";
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

        if(this.body.buildingBranchName === undefined){
            presentParams = true;
            presentReturn += "buildingBranchName, ";
        }
        if(this.body.buildingLatitude === undefined){
            presentParams = true;
            presentReturn += "buildingLatitude, ";
        }
        if(this.body.buildingLongitude === undefined){
            presentParams = true;
            presentReturn += "buildingLongitude, ";
        }
        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        if(this.body.networkSsid === undefined){
            presentParams = true;
            presentReturn += "networkSsid, ";
        }
        if(this.body.networkType === undefined){
            presentParams = true;
            presentReturn += "networkType, ";
        }
        if(this.body.networkPassword === undefined){
            presentParams = true;
            presentReturn += "networkPassword, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingBranchName)){
                invalidParams = true;
                invalidReturn += "buildingBranchName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingLatitude)){
                invalidParams = true;
                invalidReturn += "buildingLatitude, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingLongitude)){
                invalidParams = true;
                invalidReturn += "buildingLongitude, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.networkSsid)){
                invalidParams = true;
                invalidReturn += "networkSsid, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.networkType)){
                invalidParams = true;
                invalidReturn += "networkType, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.networkPassword)){
                invalidParams = true;
                invalidReturn += "networkPassword, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.buildingId = 0;
                    message = "Building added! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Add Building not integrated";
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
     * This function will be used to update a buildings details
     *
     * @param buildingId int The building ID of the building to be changed
     * @param buildingBranchName string The new name of the branch
     * @param buildingLatitude string The new Latitude of the branch
     * @param buildingLongitude string the new Longitude of the branch
     * @param wifiParamId int The wifi param ID corresponding to the wifi table belonging to that building
     * @param networkSsid string The new network SSID of the building
     * @param networkType string The new Type of the network of the building
     * @param networkPassword string The new Password of the network
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

        if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        if(this.body.buildingBranchName === undefined){
            presentParams = true;
            presentReturn += "buildingBranchName, ";
        }
        if(this.body.buildingLatitude === undefined){
            presentParams = true;
            presentReturn += "buildingLatitude, ";
        }
        if(this.body.buildingLongitude === undefined){
            presentParams = true;
            presentReturn += "buildingLongitude, ";
        }
        if(this.body.wifiParamId === undefined){
            presentParams = true;
            presentReturn += "wifiParamId, ";
        }
        if(this.body.networkSsid === undefined){
            presentParams = true;
            presentReturn += "networkSsid, ";
        }
        if(this.body.networkType === undefined){
            presentParams = true;
            presentReturn += "networkType, ";
        }
        if(this.body.networkPassword === undefined){
            presentParams = true;
            presentReturn += "networkPassword, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingId) || !this.sharedLogic.validateNumeric(this.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingBranchName)){
                invalidParams = true;
                invalidReturn += "buildingBranchName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingLatitude)){
                invalidParams = true;
                invalidReturn += "buildingLatitude, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingLongitude)){
                invalidParams = true;
                invalidReturn += "buildingLongitude, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.wifiParamId) || !this.sharedLogic.validateNumeric(this.body.wifiParamId)){
                invalidParams = true;
                invalidReturn += "wifiParamId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.networkSsid)){
                invalidParams = true;
                invalidReturn += "networkSsid, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.networkType)){
                invalidParams = true;
                invalidReturn += "networkType, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.networkPassword)){
                invalidParams = true;
                invalidReturn += "networkPassword, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.buildingId = this.body.buildingId;
                    message = "Building edited! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Edit Building not integrated";
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
     *                  //TODO
     *              }
     */
    getBuilding(){
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
                    success = false;
                    message = "Get Building body not known";
                    data = null;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Get Building not integrated";
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
     * This function will be used to retrieve all the buildings belonging to a certain company
     *
     * @return an Array of JSON {
     *                              //TODO
     *                          }
     */
    getBuildings(){
        var message;
        var success;
        var data = new Object();
        if(this.demoMode){
            //return mock data
            success = false;
            message = "Get Buildings body not known";
            data = null;
        }
        else{
            //return data from crudController
            success = false;
            message = "Get Buildings not integrated";
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
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

        if(this.body.roomName === undefined){
            presentParams = true;
            presentReturn += "roomName, ";
        }
        if(this.body.parentRoomList === undefined){
            presentParams = true;
            presentReturn += "parentRoomList, ";
        }
        if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.roomName)){
                invalidParams = true;
                invalidReturn += "roomName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.parentRoomList)){
                invalidParams = true;
                invalidReturn += "parentRoomList, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingId) || !this.sharedLogic.validateNumeric(this.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.roomId = 0;
                    message = "Room added! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Add Room not integrated";
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

        if(this.body.roomId === undefined){
            presentParams = true;
            presentReturn += "roomId, ";
        }
        if(this.body.roomName === undefined){
            presentParams = true;
            presentReturn += "roomName, ";
        }
        if(this.body.parentRoomList === undefined){
            presentParams = true;
            presentReturn += "parentRoomList, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.roomId) || !this.sharedLogic.validateNumeric(this.body.roomId)){
                invalidParams = true;
                invalidReturn += "roomId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.roomName)){
                invalidParams = true;
                invalidReturn += "roomName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.parentRoomList)){
                invalidParams = true;
                invalidReturn += "parentRoomList, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.roomId = this.body.roomId;
                    message = "Room edited! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Edit Room not integrated";
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
     *                  //TODO
     *              }
     */
    getRoom(){
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
                    success = false;
                    message = "Get Room body not known";
                    data = null;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Get Room not integrated";
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
     * This function will be used to retrieve all the buildings belonging to a certain company
     *
     * @return an Array of JSON {
     *                              //TODO
     *                          }
     */
    getRooms(){
        var message;
        var success;
        var data = new Object();
        if(this.demoMode){
            //return mock data
            success = false;
            message = "Get Rooms body not known";
            data = null;
        }
        else{
            //return data from crudController
            success = false;
            message = "Get Rooms not integrated";
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
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

        if(this.body.employeeName === undefined){
            presentParams = true;
            presentReturn += "employeeName, ";
        }
        if(this.body.employeeSurname === undefined){
            presentParams = true;
            presentReturn += "employeeSurname, ";
        }
        if(this.body.employeeTitle === undefined){
            presentParams = true;
            presentReturn += "employeeTitle, ";
        }
        if(this.body.employeeCellphone === undefined){
            presentParams = true;
            presentReturn += "employeeCellphone, ";
        }
        if(this.body.employeeEmail === undefined){
            presentParams = true;
            presentReturn += "employeeEmail, ";
        }
        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        if(this.body.employeePassword === undefined){
            presentParams = true;
            presentReturn += "employeePassword, ";
        }
        //if parameters are present, validate if correct format
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeName) || !this.sharedLogic.validateAlpha(this.body.employeeName)){
                invalidParams = true;
                invalidReturn += "employeeName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeSurname) || !this.sharedLogic.validateAlpha(this.body.employeeSurname)){
                invalidParams = true;
                invalidReturn += "employeeSurname, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeTitle)){
                invalidParams = true;
                invalidReturn += "employeeTitle, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeCellphone) || !this.sharedLogic.validateCellphone(this.body.employeeCellphone)){
                invalidParams = true;
                invalidReturn += "employeeCellphone, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeEmail) || !this.sharedLogic.validateEmail(this.body.employeeEmail)){
                invalidParams = true;
                invalidReturn += "employeeEmail, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingId) || !this.sharedLogic.validateNumeric(this.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeePassword)){
                invalidParams = true;
                invalidReturn += "employeePassword, ";
            }
            //if valid parameters then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.employeeId = 0;
                    message = "Employee Added! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController

                    var passwordId = this.sharedLogic.crudController.createPassword(this.body.employeeEmail, this.body.employeePassword);

                    if(passwordId.success){

                        var employeeId = this.sharedLogic.crudController.createEmployee(this.body.employeeName, this.body.employeeSurname,
                            this.body.employeeTitle, this.body.employeeCellphone,
                            this.body.employeeEmail, this.body.companyId,
                            passwordId.data.passwordId);

                        if(employeeId.success){
                            data.employeeId = employeeId.data.employeeId;
                            message = "Employee Added!";
                            success = true;
                        }
                        else{
                            data = null;
                            message = employeeId.message;
                            success = false;
                        }
                    }
                    else{
                        data = null;
                        message = passwordId.message;
                        success = false;
                    }
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

        if(this.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }
        if(this.body.employeeName === undefined){
            presentParams = true;
            presentReturn += "employeeName, ";
        }
        if(this.body.employeeSurname === undefined){
            presentParams = true;
            presentReturn += "employeeSurname, ";
        }
        if(this.body.employeeTitle === undefined){
            presentParams = true;
            presentReturn += "employeeTitle, ";
        }
        if(this.body.employeeCellphone === undefined){
            presentParams = true;
            presentReturn += "employeeCellphone, ";
        }
        if(this.body.employeeEmail === undefined){
            presentParams = true;
            presentReturn += "employeeEmail, ";
        }
        if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeId) || !this.sharedLogic.validateNumeric(this.body.employeeId)){
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeName) || !this.sharedLogic.validateAlpha(this.body.employeeName)){
                invalidParams = true;
                invalidReturn += "employeeName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeSurname) || !this.sharedLogic.validateAlpha(this.body.employeeSurname)){
                invalidParams = true;
                invalidReturn += "employeeSurname, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeTitle)){
                invalidParams = true;
                invalidReturn += "employeeTitle, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeCellphone) || !this.sharedLogic.validateCellphone(this.body.employeeCellphone)){
                invalidParams = true;
                invalidReturn += "employeeCellphone, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeEmail) || !this.sharedLogic.validateEmail(this.body.employeeEmail)){
                invalidParams = true;
                invalidReturn += "employeeEmail, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingId) || !this.sharedLogic.validateNumeric(this.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.employeeId = this.body.employeeId;
                    message = "Employee edited! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Edit Employee not integrated";
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
     *                  //TODO
     *              }
     */
    getEmployee(){
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
                    success = false;
                    message = "Get Employee body not known";
                    data = null;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Get Employee not integrated";
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
     * This function will be used to retrieve all the buildings belonging to a certain company
     *
     * @return an Array of JSON {
     *                              //TODO
     *                          }
     */
    getEmployees(){
        var message;
        var success;
        var data = new Object();
        if(this.demoMode){
            //return mock data
            success = false;
            message = "Get Employees body not known";
            data = null;
        }
        else{
            //return data from crudController
            success = false;
            message = "Get Employees not integrated";
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    /**
     * This Function will be used to change the password
     *
     * @params apiKey
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

        if(this.body.apiKey === undefined){
            presentParams = true;
            presentReturn += "apiKey, ";
        }
        if(this.body.oldPassword === undefined){
            presentParams = true;
            presentReturn += "oldPassword, ";
        }
        if(this.body.newPassword === undefined){
            presentParams = true;
            presentReturn += "newPassword, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.apiKey)){
                invalidParams = true;
                invalidReturn += "apiKey, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.oldPassword)){
                invalidParams = true;
                invalidReturn += "oldPassword, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.newPassword)){
                invalidParams = true;
                invalidReturn += "newPassword, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    success = false;
                    message = "Edit Password body not known";
                    data = null;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Edit Password not integrated";
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

}

module.exports = AdminLogic;
