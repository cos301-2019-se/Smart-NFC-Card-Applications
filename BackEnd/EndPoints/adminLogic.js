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
 *  2019/08/19  Tjaart      3.0     Added reporting function
 *
 *	Functional Description:		 This class is used by our Link Admin Application in order
 *	                            to facilitate all operations needed for the correct operation
 *	                            of the Admin of a company and Link
 *	Error Messages:
 *	Assumptions: 	This file assumes that a there exists a 'sharedLogic' and a 'crudController'
 *                  class.
 *	Constraints: 	None
 */

let SharedLogic = require('./../SharedLogic/sharedLogic.js');
let ParentLogic = require('./parentLogic');

/**
 * 	Purpose:	This class is to allow the admin application of Link to complete its needed operations
 *	Usage:		The class will be used by having /admin/functionName at the end of the http request where
 *              function name is the function the admin application wants to use
 *	@author:	Duncan Vodden
 *	@version:	1.0
 */
class AdminLogic extends ParentLogic {
    /**
     *  Constructor for the class that sets up certain properties as well as instantiate
     *  a new sharedLogic object.
     *
     *  @param req JSON Request sent from the application to the backend system
     *  @param res JSON Response sent back to the application
     */
    constructor(req, res){
        super(req,res);
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
                this.addCompany();
                break;
            case "editCompany":
                this.editCompany();
                break;
            case "deleteCompany":
                this.deleteCompany();//DONT DO
                break;
            case "getCompanyByCompanyId":
                this.getCompanyByCompanyId();
                break;
            case "getCompanyByPasswordId":
                this.getCompanyByPasswordId();
                break;
            case "getCompanies":
                this.getCompanies();
                break;

            //Buildings
            case "addBuilding":
                this.addBuilding();
                break;
            case "editBuilding":
                this.editBuilding();
                break;
            case "deleteBuilding":
                this.deleteBuilding();//DONT DO
                break;
            case "getBuildingByBuildingId":
                this.getBuildingByBuildingId();
                break;
            case "getBuildingsByCompanyId":
                this.getBuildingsByCompanyId();
                break;

            //Rooms
            case "addRoom":
                this.addRoom();
                break;
            case "editRoom":
                this.editRoom();
                break;
            case "deleteRoom":
                this.deleteRoom();//DONT DO
                break;
            case "getRoomByRoomId":
                this.getRoomByRoomId();
                break;
            case "getRoomsByBuildingId":
                this.getRoomsByBuildingId();
                break;

            //Employees
            case "addEmployee":
                this.addEmployee();
                break;
            case "addEmployees":
                this.addEmployees();//TODO
                break;
            case "editEmployee":
                this.editEmployee();
                break;
            case "deleteEmployee":
                this.deleteEmployee();//DONT DO
                break;
            case "getEmployeeByEmployeeId":
                this.getEmployeeByEmployeeId();
                break;
            case "getEmployeesByCompanyId":
                this.getEmployeesByCompanyId();
                break;
            case "getEmployeesByBuildingId":
                this.getEmployeesByBuildingId();
                break;

            //password
            case "editPassword":
                this.editPassword();
                break;
            case "editEmployeePassword":
                this.editEmployeePassword();
                break;
            case "editCompanyPassword":
                this.editCompanyPassword();
                break;
            //wifiParams
            case "editWifiParam":
                this.editWifiParam();
                break;
			
			//Payment Points
			case "addPaymentPoint":
                this.addPaymentPoint();
                break;
            case "editPaymentPoint":
                this.editPaymentPoint();
                break;
            case "getPaymentPointsByCompanyId":
                this.getPaymentPointsByCompanyId();
                break;

            //Reporting
            case "getAllTransactionsByCompanyId":
                this.getAllTransactionsByCompanyId();
                break;

            case "generatePdf":
                this.generatePdf();
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
    async addCompany(){

        let message;
        let data = new Object();
        let success;

        //check to see if parameters are present
        let presentParams = false;
        let presentReturn = "";

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
            let invalidParams = false;
            let invalidReturn = "";
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
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let salt = this.sharedLogic.genSalt();
                    let hash = this.sharedLogic.passwordHash(this.body.companyPassword,salt);
                    let expDate = this.sharedLogic.getDate(0);
                    let apiKey = this.sharedLogic.genApiKey(); //need to check for duplicates

                    let passwordObj = await this.sharedLogic.crudController.createPassword(this.body.companyUsername, hash, salt, apiKey, expDate);
                    if(passwordObj.success){

                        let companyObj = await this.sharedLogic.crudController.createCompany(this.body.companyName, this.body.companyWebsite, passwordObj.data.passwordId);

                        if (companyObj.success) {

                            message = this.body.companyName + " Added!";
                            this.sharedLogic.endServe(companyObj.success, message, companyObj.data);
                        } else {

                            let deletePasswordObj = await this.sharedLogic.crudController.deletePassword(passwordObj.data.passwordId);
                            this.sharedLogic.endServe(companyObj.success, companyObj.message, null);
                        }
                    }
                    else{
                        if(passwordObj.message.includes("password_apikey_key"))
                            message = "Please try again - Api Key Duplicate";
                        else
                            message = passwordObj.message;

                        this.sharedLogic.endServe(passwordObj.success, message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     *  Function that is called to edit a companies details
     *
     *  @param companyId int The ID belonging to the company
     *  @param companyName string the Name of the company
     *  @param companyWebsite string the website belonging to the company
     *  @param companyUsername string the username of the company
     *
     *  @return JSON {
     *                  companyId : int The company ID that has just be edited
     *               }
     */
    async editCompany(){
        let message;
        let data = new Object();
        let success;

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
            presentReturn += "companyUsername, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
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
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let companyObj = await this.sharedLogic.crudController.getCompanyByCompanyId(this.body.companyId);
                    if(companyObj.success){

                        let updatePasswordObj = await this.sharedLogic.crudController.updatePassword(companyObj.data.passwordId, this.body.companyUsername, undefined, undefined, undefined, undefined);
                        if(updatePasswordObj.success){

                            let updateCompanyObj = await this.sharedLogic.crudController.updateCompany(this.body.companyId, this.body.companyName, this.body.companyWebsite, undefined);
                            if(updateCompanyObj.success){

                                success = updateCompanyObj.success;
                                message = this.body.companyName + " edited!";
                                data.companyId = this.body.companyId;
                                this.sharedLogic.endServe(success, message, data);
                            }
                            else{
                                this.sharedLogic.endServe(updateCompanyObj.success, updateCompanyObj.message, null);
                            }
                        }
                        else{

                            this.sharedLogic.endServe(updatePasswordObj.success, updatePasswordObj.message, null);
                        }
                    }
                    else{

                        this.sharedLogic.endServe(companyObj.success, companyObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
    async deleteCompany(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
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
     *                  username string The username of the company
     *              }
     */
    async getCompanyByCompanyId(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.companyName = "Vast Expanse";
                    data.companyWebsite = "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications";
                    data.companyId = this.body.companyId;
                    data.username =  "piet.pompies@gmail.com";
                    data.passwordId = 0;
                    message = "Retrieved "+data.companyName+"! - Mock";
                    success = true;
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let companyObj = await this.sharedLogic.crudController.getCompanyByCompanyId(this.body.companyId);
                    if(companyObj.success){

                        let passwordObj = await this.sharedLogic.crudController.getPasswordByPasswordId(companyObj.data.passwordId);
                        if(passwordObj.success){

                            success = passwordObj.success;
                            message = "Retrieved "+ companyObj.data.companyName+"!";
                            data = companyObj.data;
                            data.username = passwordObj.data.username;
                            this.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            this.sharedLogic.endServe(passwordObj.success, passwordObj.message, null);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(companyObj.success, companyObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
     *                  username string the username of the company retrieved
     *                  passwordId int The ID of the password record belonging to that company
     *              }
     */
    async getCompanyByPasswordId(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.passwordId === undefined){
            presentParams = true;
            presentReturn += "passwordId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.passwordId) || !this.sharedLogic.validateNumeric(this.body.passwordId)){
                invalidParams = true;
                invalidReturn += "passwordId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.companyName = "Vast Expanse";
                    data.companyWebsite = "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications";
                    data.companyId = 0;
                    data.username =  "piet.pompies@gmail.com";
                    data.passwordId = this.body.passwordId;
                    message = "Retrieved "+data.companyName+"! - Mock";
                    success = true;
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let companyObj = await this.sharedLogic.crudController.getCompanyByPasswordId(this.body.passwordId);
                    if(companyObj.success){

                        let passwordObj = await this.sharedLogic.crudController.getPasswordByPasswordId(companyObj.data.passwordId);
                        if(passwordObj.success){
                            success = passwordObj.success;
                            message = "Retrieved "+ companyObj.data.companyName+"!";
                            data = companyObj.data;
                            data.username = passwordObj.data.username;
                            this.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            this.sharedLogic.endServe(passwordObj.success, passwordObj.message, null);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(companyObj.success, companyObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This function will be used by Link admins to get a list of all the registered companies
     *
     * @return Array of JSON {
     *                          companyId: int The ID of the company,
     *                          companyName: string The name of the company,
     *                          companyWebsite: string the website of the company,
     *                          passwordId: int The Password ID of the company
     *                          username string the username of each company
     *                      }
     */
    async getCompanies(){
        let message;
        let success;
        let data = new Object();
        if(this.demoMode){
            //return mock data
            success = true;
            message = "Successfully Retrieved - Mock!";
            data = [];
            data.push({
                companyId:0,
                companyName:"Comp1",
                companyWebsite:"www.Comp1.com",
                passwordId:0,
                username:"comp1"
            });

            data.push({
                companyId:1,
                companyName:"Comp2",
                companyWebsite:"www.Comp2.com",
                passwordId:1,
                username:"comp2"
            });
            this.sharedLogic.endServe(success, message, data);
        }
        else{
            //return data from crudController
            let companyObj = await this.sharedLogic.crudController.getAllCompanies();
            if(companyObj.success){
                let passwordObj;
                for(let countCompany = 0; countCompany<companyObj.data.length; countCompany++){
                    passwordObj = await this.sharedLogic.crudController.getPasswordByPasswordId(companyObj.data[countCompany].passwordId);
                    if(passwordObj.success){
                        companyObj.data[countCompany].username = passwordObj.data.username;
                    }
                }
                this.sharedLogic.endServe(companyObj.success, companyObj.message, companyObj.data)
            }
            else{
                this.sharedLogic.endServe(false, companyObj.message, null);
            }
        }
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
    async addBuilding(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

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
            let invalidParams = false;
            let invalidReturn = "";
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
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let wifiObj = await  this.sharedLogic.crudController.createWiFiParams(this.body.networkSsid, this.body.networkType, this.body.networkPassword);
                    if(wifiObj.success){

                        let buildingObj = await this.sharedLogic.crudController.createBuilding(this.body.buildingLatitude, this.body.buildingLongitude, this.body.buildingBranchName, this.body.companyId, wifiObj.data.wifiParamsId);
                        if(buildingObj.success){
                            success = buildingObj.success;
                            message =  this.body.buildingBranchName+" created!";
                            data = buildingObj.data;
                            this.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            let deleteWifiObj = await this.sharedLogic.crudController.deleteWiFiParams(wifiObj.data.wifiParamsId);
                            this.sharedLogic.endServe(buildingObj.success, buildingObj.message, null);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(wifiObj.success, wifiObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
    async editBuilding(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

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

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
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

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.buildingId = this.body.buildingId;
                    message = "Building edited! - Mock";
                    success = true;
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let buildingObj = await this.sharedLogic.crudController.updateBuilding(this.body.buildingId, this.body.buildingLatitude, this.body.buildingLongitude, this.body.buildingBranchName,  undefined, undefined);
                    if(buildingObj.success){
                        success = buildingObj.success;
                        message = "Building Edited!";
                        data.buildingId = this.body.buildingId;
                        this.sharedLogic.endServe(success, message, data);
                    }
                    else{
                        this.sharedLogic.endServe(buildingObj.success, buildingObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
    async deleteBuilding(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
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
     *                  networkSsid string The name of the wifi for guests to connect for
     *                  networkType string The type of the wifi network for guests to connect to
     *                  networkPassword string The password for the wifi network for access to the wifi for guests
     *              }
     */
    async getBuildingByBuildingId(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingId) || !this.sharedLogic.validateNumeric(this.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    success = true;
                    message = "Retrieved Building! - mock";
                    data.buildingId = this.body.buildingId ;
                    data.latitude = "20,120,10";
                    data.longitude = "20,120,10";
                    data.branchName = "Vast Expanse JHB";
                    data.companyId = 0 ;
                    data.wifiParamsId = 0;
                    data.networkSsid = "SSID";
                    data.networkType = "TYPE";
                    data.networkPassword = "PASS123";

                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let buildingObj = await this.sharedLogic.crudController.getBuildingByBuildingId(this.body.buildingId);
                    if(buildingObj.success){

                        let wifiObj = await this.sharedLogic.crudController.getWiFiParamsByWifiParamsId(buildingObj.data.wifiParamsId);
                        if(wifiObj.success) {
                            success = buildingObj.success;
                            message = "Building Retrieved!";
                            data = buildingObj.data;
                            data.networkSsid = wifiObj.data.ssid;
                            data.networkType = wifiObj.data.networkType;
                            data.networkPassword = wifiObj.data.password;

                            this.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            success = wifiObj.success;
                            message = "Error when retrieving wifi details!";
                            data = null;
                            this.sharedLogic.endServe(success, message, data);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(buildingObj.success, buildingObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
     *                  networkSsid string The name of the wifi for guests to connect for
     *                  networkType string The type of the wifi network for guests to connect to
     *                  networkPassword string The password for the wifi network for access to the wifi for guests
     *                          }
     */
    async getBuildingsByCompanyId(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    success = true;
                    message = "Retrieved Building! - mock";
                    data = [];
                    data.push({
                        buildingId : 0,
                        buildingLatitude : "20,120,10",
                        buildingLongitude : "20,120,10",
                        buildingBranchName : "Vast Expanse JHB",
                        companyId : this.body.companyId,
                        wifiParamsId : 0,
                        networkSsid: "Vast Expanse Guests",
                        networkType: "TYPE",
                        networkPassword: "1234"
                    });

                    data.push({
                        buildingId : 1,
                        buildingLatitude : "20,120,10",
                        buildingLongitude : "20,120,10",
                        buildingBranchName : "Vast Expanse PTA",
                        companyId : this.body.companyId,
                        wifiParamsId : 1,
                        networkSsid: "Vast Expanse Guests",
                        networkType: "TYPE",
                        networkPassword: "1234"
                    });

                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let buildingObj = await this.sharedLogic.crudController.getBuildingsByCompanyId(this.body.companyId);
                    if(buildingObj.success){
                        let wifiObj;
                        for(let countBuilding = 0; countBuilding<buildingObj.data.length; countBuilding++){
                            wifiObj = await this.sharedLogic.crudController.getWiFiParamsByWifiParamsId(buildingObj.data[countBuilding].wifiParamsId);
                            if(wifiObj.success){
                                buildingObj.data[countBuilding].networkSsid = wifiObj.data.ssid;
                                buildingObj.data[countBuilding].networkType = wifiObj.data.networkType;
                                buildingObj.data[countBuilding].networkPassword =wifiObj.data.password;
                            }
                        }
                        success = buildingObj.success;
                        message = "Buildings Retrieved!";

                        data = buildingObj.data;
                        this.sharedLogic.endServe(success, message, data);
                    }
                    else{
                        this.sharedLogic.endServe(buildingObj.success, buildingObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
     *                  roomId int The ID of the newly created room
     *              }
     */
    async addRoom(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

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
            let invalidParams = false;
            let invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.roomName)){
                invalidParams = true;
                invalidReturn += "roomName, ";
            }
            // if(!this.sharedLogic.validateNonEmpty(this.body.parentRoomList)){
            //     invalidParams = true;
            //     invalidReturn += "parentRoomList, ";
            // }
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
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let roomObj = await this.sharedLogic.crudController.createRoom(this.body.roomName, this.body.parentRoomList, this.body.buildingId);
                    if(roomObj.success){

                        let nfcObj = await this.sharedLogic.crudController.createNFCAccessPoints(roomObj.data.roomId);
                        if(nfcObj.success){
                            success = roomObj.success;
                            message = this.body.roomName + " added!";
                            data = roomObj.data;
                            this.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            let deleteRoomObj = await this.sharedLogic.crudController.deleteRoom(roomObj.data.roomId);
                            success = nfcObj.success;
                            message = "Room creation failed in NFC creation, please try again";
                            data = null;
                            this.sharedLogic.endServe(success, message, data);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(roomObj.success, roomObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
    async editRoom(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

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
            let invalidParams = false;
            let invalidReturn = "";
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
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let roomObj = await this.sharedLogic.crudController.updateRoom(this.body.roomId, this.body.roomName, this.body.parentRoomList, undefined);

                    if(roomObj.success){
                        success = roomObj.success;
                        message = "Room updated!";
                        data.roomId = this.body.roomId;
                        this.sharedLogic.endServe(success, message, data);
                    }
                    else{

                        this.sharedLogic.endServe(roomObj.success, roomObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
    async deleteRoom(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.roomId === undefined){
            presentParams = true;
            presentReturn += "roomId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
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
    async getRoomByRoomId(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.roomId === undefined){
            presentParams = true;
            presentReturn += "roomId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.roomId) || !this.sharedLogic.validateNumeric(this.body.roomId)){
                invalidParams = true;
                invalidReturn += "roomId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    success = true;
                    message = "Room Retrieved!- Mock";
                    data.roomId = this.body.roomId;
                    data.roomName = "Houston";
                    data.parentRoomList = "0,1";
                    data.buildingId = 0;
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let roomObj = await this.sharedLogic.crudController.getRoomByRoomId(this.body.roomId);
                    if(roomObj.success){

                        success = roomObj.success;
                        message = "Room Retrieved!";
                        data = roomObj.data;
                        this.sharedLogic.endServe(success, message, data);
                    }
                    else{
                        this.sharedLogic.endServe(roomObj.success, roomObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
    async getRoomsByBuildingId(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingId) || !this.sharedLogic.validateNumeric(this.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
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
                        this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let roomObj = await this.sharedLogic.crudController.getRoomsByBuildingId(this.body.buildingId);
                    if(roomObj.success){
                        success = roomObj.success;
                        message = "Rooms Retrieved!";
                        data = roomObj.data;
                        this.sharedLogic.endServe(success, message, data);
                    }
                    else{
                        this.sharedLogic.endServe(roomObj.success, roomObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
    async addEmployee(){
        let data = new Object();
        let message;
        let success;

        //check if parameters are present
        let presentParams = false;
        let presentReturn = "";

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
            let invalidParams = false;
            let invalidReturn = "";
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
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController

                    let salt = this.sharedLogic.genSalt();
                    let hash = this.sharedLogic.passwordHash(this.body.employeePassword,salt);
                    let expDate = this.sharedLogic.getDate(0);
                    let apiKey = this.sharedLogic.genApiKey(); //need to check for duplicates

                    let passwordObj = await  this.sharedLogic.crudController.createPassword(this.body.employeeEmail, hash, salt, apiKey, expDate);
                    if(passwordObj.success){

                        let employeeObj = await this.sharedLogic.crudController.createEmployee(this.body.employeeName, this.body.employeeSurname,
                                                                            this.body.employeeTitle, this.body.employeeCellphone,
                                                                            this.body.employeeEmail, this.body.companyId,
                                                                            this.body.buildingId,passwordObj.data.passwordId);

                        if(employeeObj.success){
                            success = employeeObj.success;
                                message = "Employee Added!";
                                data = employeeObj.data;
                                this.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            let deletePasswordObj = await this.sharedLogic.crudController.deletePassword(passwordObj.data.passwordId);
                            this.sharedLogic.endServe(employeeObj.success, employeeObj.message, null);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(passwordObj.success, passwordObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
    async addEmployees(){}

    /**
     * Function used to change an employees details
     *
     * @param employeeId int The ID of the employee to be changed
     * @param employeeName string The name of the employee
     * @param employeeSurname string The surname of the employee
     * @param employeeTitle string The Title of the employee e.g Mr/Mrs
     * @param employeeCellphone string The Cellphone number of the employee
     * @param employeeEmail string The email address of the employee - used for login purposes
     * @param username string the username of the employee
     * @param buildingId int The building that the employee works at
     *
     * @return JSON {
     *                  employeeId : int The ID of the employee being added
     *              }
     */
    async editEmployee(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

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
        if(this.body.username === undefined){
            presentParams = true;
            presentReturn += "username, ";
        }
        if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
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
            if(!this.sharedLogic.validateNonEmpty(this.body.username)){
                invalidParams = true;
                invalidReturn += "username, ";
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
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let employeeObj = await this.sharedLogic.crudController.getEmployeeByEmployeeId(this.body.employeeId);

                    if(employeeObj.success){
                        let oldEmail = employeeObj.data.email;
                        let updatePasswordObj = await this.sharedLogic.crudController.updatePassword(employeeObj.data.passwordId, this.body.username,undefined, undefined, undefined, undefined);
                        if(updatePasswordObj.success){

                            let updateEmployeeObj = await this.sharedLogic.crudController.updateEmployee(this.body.employeeId, this.body.employeeName, this.body.employeeSurname, this.body.employeeTitle,
                                                                                this.body.employeeCellphone, this.body.employeeEmail, undefined, this.body.buildingId,
                                                                                undefined);
                            if(updateEmployeeObj.success){
                                let emailMessage = "Your Link User details have been changed.\n\n If this was not done by you, please contact your company representative. \n\nKind Regards\nLink Development Team";
                                this.sharedLogic.sendEmail(oldEmail,"Link User Details Changed", emailMessage);
                                success = updateEmployeeObj.success;
                                message = "Employee Edited!";
                                data.employeeId = this.body.employeeId;
                                this.sharedLogic.endServe(success, message, data);
                            }
                            else{
                                this.sharedLogic.endServe(updateEmployeeObj.success, updateEmployeeObj.message, null);
                            }
                        }
                        else{
                            this.sharedLogic.endServe(updatePasswordObj.success, updatePasswordObj.message, null);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(employeeObj.success, employeeObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
    async deleteEmployee(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
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
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let employeeObj = await this.sharedLogic.crudController.getEmployeeByEmployeeId(this.body.employeeId);

                    if(employeeObj.success){
                        console.log(employeeObj);
                        let deleteEmployeeObj = await this.sharedLogic.crudController.deleteEmployee(this.body.employeeId);
                        if(deleteEmployeeObj.success){
                            let passwordObj = await this.sharedLogic.crudController.deletePassword(employeeObj.data.passwordId);
                        }

                        this.sharedLogic.endServe(true,"Employee Deleted", {employeeId: this.body.employeeId});

                    }else {
                        this.sharedLogic.endServe(false, "Employee Does not Exists", false)
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
        }

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
     *                 username string the username of the employee
     *              }
     */
    async getEmployeeByEmployeeId(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeId) || !this.sharedLogic.validateNumeric(this.body.employeeId)){
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
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
                    data.username = "piet12";
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let employeeObj = await this.sharedLogic.crudController.getEmployeeByEmployeeId(this.body.employeeId);
                    if(employeeObj.success){
                        let passwordObj = await this.sharedLogic.crudController.getPasswordByPasswordId(employeeObj.data.passwordId);
                        if(passwordObj.success){
                            success = employeeObj.success;
                            message = "Employee Retrieved!";
                            data = employeeObj.data;
                            data.username = passwordObj.data.username;
                            this.sharedLogic.endServe(success, message, data);
                        }
                        else{
                            this.sharedLogic.endServe(passwordObj.success, passwordObj.message, null);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(employeeObj.success, employeeObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
     *                 username string the username of each employee
     *              }
     */
    async getEmployeesByCompanyId(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
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
                        companyId:this.body.companyId,
                        buildingId:0,
                        passwordId:0,
                        username:"dunc1"
                    });
                    data.push({
                        employeeId : 1,
                        firstName : "Piet",
                        surname : "Pompies",
                        title : "Mr",
                        cellphone : "0791637273",
                        email : "piet.pompies@gmail.com",
                        companyId : this.body.companyId,
                        buildingId : 0,
                        passwordId : 0,
                        username:"dunc2"
                    });
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let employeeObj = await this.sharedLogic.crudController.getEmployeesByCompanyId(this.body.companyId);
                    if(employeeObj.success){
                        let passwordObj;
                        for(let countEmployee = 0; countEmployee<employeeObj.data.length; countEmployee++){
                            passwordObj = await this.sharedLogic.crudController.getPasswordByPasswordId(employeeObj.data[countEmployee].passwordId);
                            if(passwordObj.success) {
                                employeeObj.data[countEmployee].username = passwordObj.data.username;
                            }
                        }
                        success = employeeObj.success;
                        message = "Employees Retrieved!";
                        data = employeeObj.data;
                        this.sharedLogic.endServe(success, message, data);
                    }
                    else{
                        this.sharedLogic.endServe(employeeObj.success, employeeObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
     *                 username string the username of the employee
     *              }
     */
    async getEmployeesByBuildingId(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingId) || !this.sharedLogic.validateNumeric(this.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
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
                            buildingId: this.body.buildingId,
                            passwordId: 0,
                            username:"dunc1"
                    });
                    data.push({
                        employeeId : 1,
                        firstName : "Piet",
                        surname : "Pompies",
                        title : "Mr",
                        cellphone : "0791637273",
                        email : "piet.pompies@gmail.com",
                        companyId : 0,
                        buildingId : this.body.buildingId,
                        passwordId : 1,
                        username:"dunc2"
                    });
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let employeeObj = await this.sharedLogic.crudController.getEmployeesByBuildingId(this.body.buildingId);
                    if(employeeObj.success){
                        let passwordObj;
                        for(let countEmployee = 0; countEmployee<employeeObj.data.length; countEmployee++){
                            passwordObj = await this.sharedLogic.crudController.getPasswordByPasswordId(employeeObj.data[countEmployee].passwordId);
                            if(passwordObj.success){
                                employeeObj.data[countEmployee].username = passwordObj.data.username;
                            }
                        }
                        success = employeeObj.success;
                        message = "Employees Retrieved!";
                        data = employeeObj.data;
                        this.sharedLogic.endServe(success, message, data);
                    }
                    else{
                        this.sharedLogic.endServe(employeeObj.success, employeeObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This Function will be used to change the password
     *
     * @params apiKey string The Api key of the user
     * @params oldPassword The old password of the user
     * @params newPassword string the New password of the user
     */
    async editPassword(){
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
                    success = true;
                    message = "Password Successfully changed!";
                    this.sharedLogic.endServe(success, message, {});
                }
                else{
                    //return data from crudController
                    let apiKeyObj = await  this.sharedLogic.crudController.getPasswordByApiKey(this.body.apiKey);

                    if(apiKeyObj.success){
                        if(apiKeyObj.data.hash === this.sharedLogic.passwordHash(this.body.oldPassword,apiKeyObj.data.salt)){

                            var newSalt = this.sharedLogic.genSalt();
                            let passwordObj = await this.sharedLogic.crudController.updatePassword(apiKeyObj.data.passwordId, undefined, this.sharedLogic.passwordHash(this.body.newPassword,newSalt), newSalt, undefined, undefined);
                            if(passwordObj.success) {
                                success = passwordObj.success;
                                message = "Password Successfully changed!";
                                data = {};
                                this.sharedLogic.endServe(success, message, data);
                            }
                            else{
                                this.sharedLogic.endServe(passwordObj.success, passwordObj.message, null);
                            }
                        }
                        else{
                            this.sharedLogic.endServe(false, "Old Passwords do not match", null);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(apiKeyObj.success, apiKeyObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This Function will be used to change the password
     *
     * @params employeeId int The ID key of the employee
     * @params password string The password of the user
     */
    async editEmployeePassword(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(this.body.employeeId === undefined){
            presentParams = true;
            presentReturn += "employeeId, ";
        }
        if(this.body.password === undefined){
            presentParams = true;
            presentReturn += "password, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeId) || !this.sharedLogic.validateNumeric(this.body.employeeId)){
                invalidParams = true;
                invalidReturn += "employeeId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.password)){
                invalidParams = true;
                invalidReturn += "password, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    success = true;
                    message = "Password Successfully changed!";
                    this.sharedLogic.endServe(success, message, {});
                }
                else{
                    //return data from crudController
                    let employeeObj = await this.sharedLogic.crudController.getEmployeeByEmployeeId(this.body.employeeId);
                    if(employeeObj.success){

                        let salt = this.sharedLogic.genSalt();
                        let passwordObj = await this.sharedLogic.crudController.updatePassword(employeeObj.data.passwordId, undefined, this.sharedLogic.passwordHash(this.body.password,salt), salt, undefined,undefined );
                        if(passwordObj.success){
                            this.sharedLogic.endServe(passwordObj.success, passwordObj.message, {});
                        }
                        else{
                            this.sharedLogic.endServe(passwordObj.success, passwordObj.message, null);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(false, employeeObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     * This Function will be used to change the password
     *
     * @params companyId int The Id  key of the company
     * @params password string The password of the user
     */
    async editCompanyPassword(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        if(this.body.password === undefined){
            presentParams = true;
            presentReturn += "password, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.password)){
                invalidParams = true;
                invalidReturn += "password, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    success = true;
                    message = "Password Successfully changed!";
                    this.sharedLogic.endServe(success, message, {});
                }
                else{
                    //return data from crudController
                    let companyObj = await this.sharedLogic.crudController.getCompanyByCompanyId(this.body.companyId);
                    if(companyObj.success){

                        let salt = this.sharedLogic.genSalt();
                        let passwordObj = await this.sharedLogic.crudController.updatePassword(companyObj.data.passwordId, undefined, this.sharedLogic.passwordHash(this.body.password,salt), salt, undefined,undefined );
                        if(passwordObj.success){
                            this.sharedLogic.endServe(passwordObj.success, passwordObj.message, {});
                        }
                        else{
                            this.sharedLogic.endServe(passwordObj.success, passwordObj.message, null);
                        }
                    }
                    else{
                        this.sharedLogic.endServe(false, companyObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
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
    async editWifiParam(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.wifiParamsId === undefined){
            presentParams = true;
            presentReturn += "wifiParamsId, ";
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
            let invalidParams = false;
            let invalidReturn = "";

            if(!this.sharedLogic.validateNonEmpty(this.body.wifiParamsId) || !this.sharedLogic.validateNumeric(this.body.wifiParamsId)){
                invalidParams = true;
                invalidReturn += "wifiParamsId, ";
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
                    data.wifiParamsId = this.body.wifiParamsId;
                    message = "WiFi edited! - Mock";
                    success = true;
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let wifiObj = await this.sharedLogic.crudController.updateWiFiParams(this.body.wifiParamsId, this.body.networkSsid, this.body.networkType, this.body.networkPassword);
                    if(wifiObj.success){
                        success = wifiObj.success;
                        message = "WiFi Edited!";
                        data.wifiParamsId = this.body.wifiParamsId;
                        this.sharedLogic.endServe(success, message, data);
                    }
                    else{
                        this.sharedLogic.endServe(wifiObj.success, wifiObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
        }
    }
	
	
	/**
     * Function that is called to create a payment point, will use SharedLogic's crudController in order
     * to complete the operation. It will create a Payment Point belonging to the Building ID passed in through
     * the parameter
     *
     * @param   description string The description of that payment point
     * @param   buildingId int The building that the payment point is in
     *
     * @return JSON {
     *                  nfcPaymentPointId : int The ID of the employee being added
     *              }
     */
    async addPaymentPoint(){
        let data = new Object();
        let message;
        let success;

        //check if parameters are present
        let presentParams = false;
        let presentReturn = "";

        if(this.body.description === undefined){
            presentParams = true;
            presentReturn += "description, ";
        }
		if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
		
        //if parameters are present, validate if correct format
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
			
            if(!this.sharedLogic.validateNonEmpty(this.body.description) || !this.sharedLogic.validateAlpha(this.body.description)){
                invalidParams = true;
                invalidReturn += "description, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingId) || !this.sharedLogic.validateNumeric(this.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }
			
            //if valid parameters then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.nfcPaymentPointId = 0;
                    message = "Payment Point Added! - Mock";
                    success = true;
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController

                    let payPointObj = await this.sharedLogic.crudController.createNfcPaymentPoint(this.body.buildingId, this.body.description);
					
					if(payPointObj.success)
					{
                        success = payPointObj.success;
                        message = "Payment Point Added!";
                        data = payPointObj.data;
                        this.sharedLogic.endServe(success, message, data);
                    }
                    else
					{
                        this.sharedLogic.endServe(payPointObj.success, payPointObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
        }
    }
	
	
	/**
     * Function used to change a payment points details
     *
     * @param nfcPaymentPointId int The ID of the payment point to be changed
     * @param description string The description of the payment point
     * @param buildingId int The building that the payment point is in
     *
     * @return JSON {
     *                  nfcPaymentPointId : int The ID of the payment point modified
     *              }
     */
    async editPaymentPoint(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.nfcPaymentPointId === undefined){
            presentParams = true;
            presentReturn += "nfcPaymentPointId, ";
        }
        if(this.body.description === undefined){
            presentParams = true;
            presentReturn += "description, ";
        }
        if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
			
            let invalidParams = false;
            let invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.nfcPaymentPointId) || !this.sharedLogic.validateNumeric(this.body.nfcPaymentPointId)){
                invalidParams = true;
                invalidReturn += "nfcPaymentPointId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.description) || !this.sharedLogic.validateAlpha(this.body.description)){
                invalidParams = true;
                invalidReturn += "description, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingId) || !this.sharedLogic.validateNumeric(this.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }
			
            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.nfcPaymentPointId = this.body.nfcPaymentPointId;
                    message = "Payment Point edited! - Mock";
                    success = true;
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
                    //return data from crudController
                    let payPointObj = await this.sharedLogic.crudController.getNfcPaymentPointByNfcPaymentPointId(this.body.nfcPaymentPointId);

                    if(payPointObj.success)
					{

                        let updatePayPointObj = await this.sharedLogic.crudController.updateNfcPaymentPoint(this.body.nfcPaymentPointId, this.body.buildingId, this.body.description);
						
						/*//for now, while update and delete not in
						let updatePayPointObj = {success: true, message: "Successfully updated", data: null};*/
						
                        if(updatePayPointObj.success)
						{
                            success = updatePayPointObj.success;
                            message = "Payment Point Edited!";
                            data.nfcPaymentPointId = this.body.nfcPaymentPointId;
                            this.sharedLogic.endServe(success, message, data);
                        }
                        else
						{
                            this.sharedLogic.endServe(updatePayPointObj.success, updatePayPointObj.message, null);
                        }
                    }
                    else
					{
                        this.sharedLogic.endServe(payPointObj.success, payPointObj.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
        }
    }
	
	
	
	/**
     * This function will be used to return an array of payment points
     *
     * @param companyId int The company ID used to get the Payment Point objects
     *
     * @return an Array of JSON {
     *                 nfcPaymentPointId int The ID belonging to that payment point
     *                 buildingId int the Building ID where the payment point is in
     *                 description string the description of the payment point
     *              }
     */
    async getPaymentPointsByCompanyId(){
        let message;
        let data = new Object();
        let success;

        let presentParams = false;
        let presentReturn = "";

        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            let invalidParams = false;
            let invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    success = true;
                    message = "Payment Points Retrieved!- Mock";
                    data = [];
                    data.push({
                        nfcPaymentPointId:0,
                        buildingId:0,
                        description:"Place"
                    });
                    data.push({
                        nfcPaymentPointId:1,
                        buildingId:0,
                        description:"Shop"
                    });
                    this.sharedLogic.endServe(success, message, data);
                }
                else{
					//return data from crudController
					
					let buildArr = await this.sharedLogic.crudController.getBuildingsByCompanyId(this.body.companyId);
					
					if(buildArr.success)
					{
						//there are buildings
						buildArr = buildArr.data;
						let payPointArr = [];
						
						for(var i = 0; i < buildArr.length; i++)
						{
							let thisBuild = buildArr[i];
							thisBuild = thisBuild.buildingId;
							
							let thisPayPointArr = await this.sharedLogic.crudController.getNfcPaymentPointsByBuildingId(thisBuild);
							
							if(thisPayPointArr.success === true)
							{
								thisPayPointArr = thisPayPointArr.data;
								payPointArr = payPointArr.concat(thisPayPointArr);
							}
							
						}
						
                        this.sharedLogic.endServe(true, "Payment points retrieved!", payPointArr);
                    }
                    else
					{
                        this.sharedLogic.endServe(buildArr.success, buildArr.message, null);
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
                this.sharedLogic.endServe(success, message, data);
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
            this.sharedLogic.endServe(success, message, data);
        }
    }

    /**
     *  Fetches all transactions for the specified company within the optional date range.
     *  If no date is provided then all transactions will be retrieved 
     *  @param companyId int The company ID for which the transaction data will be retrieved
     *  @param startDate string (optional) The Stringified start date time in ISO format e.g. 2016-06-27T14:48:00.000Z
     *  @param endDate string (optional) Stringified end date time in ISO format e.g. 2016-06-27T14:48:00.000Z
	 *  @param employeeUsername string (optional) Username of the employee
     *  @return [ {employeeName, employeeSurname, employeeEmail, amountSpent, paymentDesc, paymentPointDesc, transactiontime  } ]
     */
    async getAllTransactionsByCompanyId(){
        if(!this.body.companyId || !this.sharedLogic.validateNumeric(this.body.companyId))
            return this.sharedLogic.endServe(false, "No valid companyId provided", null);

        if(this.body.employeeUsername && !this.sharedLogic.validateNonEmpty(this.body.employeeUsername))
            return this.sharedLogic.endServe(false, "Invalid employee username provided", null);

        if(this.body.demoMode){
            return this.sharedLogic.endServe(true, "Demo Mode Transactions Fetched", [{
                "employeeName": "DemoName",
                "employeeSurname": "DemoSurname",
                "employeeEmail": "demo@gmail.com",
                "amountSpent": 50,
                "paymentDesc": "",
                "paymentPointDesc": "New desc",
                "transactiontime": "2019-07-21T19:15:18.028Z"
            }]);
        }


        let startDate, endDate;
        if(this.body.startDate)
            startDate = new Date(this.body.startDate);
        if(this.body.endDate)
            endDate = new Date(this.body.endDate);

        let result = await this.sharedLogic.crudController.getAllTransactionsByCompanyId(this.body.companyId, startDate, endDate, this.body.employeeUsername);
        return this.sharedLogic.endServe(result.success, result.message, result.data);
    }

    /**
     * Function that generates a report based on the given data passed through from the website
     *
     * @param data JSON {
     *                      apiKey: int API key
     *                      companyID: int ID of the company
     *                      [startDate: date Start time of the query]
     *                      [endDate: date End time of the query]
     *                  }
     *
     * @return PDF
     */
    async generatePdf(){
        let data = {};

        let companyData = await this.sharedLogic.crudController.getCompanyByCompanyId(this.body.companyId);

        if(companyData.success){

            // require dependencies
            const PDFDocument = require('../HelperClasses/pdfkit-tables');
            const {Base64Encode}  = require('base64-stream');

            //dynamic data
            let dynamData = {};
            dynamData.companyName = companyData.data.companyName;
            dynamData.type = this.body.type;
            if(this.body.type === 'custom'){
                dynamData.startDate = this.body.fields.startDate;
                dynamData.endDate = this.body.fields.endDate;
            }

            // create pdf document
            const doc = new PDFDocument({
                margin: 20
            },
                dynamData
            );

            // base64 string that will be returned
            let ret = '';
            const stream = doc.pipe(new Base64Encode());

            // Header
            doc.fontSize(20);
            doc.text(dynamData.companyName, {
                    align: 'center'
                }
            );
            doc.moveDown();
            doc.fontSize(15);
            if(dynamData.type === 'all'){
                doc.text("All Transactions", {
                    align: 'center'
                });
            }
            else if(dynamData.type === 'custom'){
                doc.text("All Transactions From " + dynamData.startDate + " To " + dynamData.endDate, {
                    align: 'center'
                });
            }

            // Body
            let arr = [];
            for(let i=0; i<this.body.transactions.length; i++){
                arr.push(Object.values(this.body.transactions[i]));
            }
            const table0 = {
                headers: ['Employee Name', 'Employee Surname', 'Employee Email', 'Amount Spent', 'Date Time', 'Payment Description', 'Payment Point Description'],
                rows: arr
            };

            doc.moveDown();
            doc.table(table0, {
                    prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
                    prepareRow: () => doc.font('Helvetica').fontSize(10),
                },
            );

            doc.end();

            stream.on('data', function(chunk) {
                ret += chunk;
            });
            stream.on('end', function () {
                data.base64 = ret;
            });

            this.sharedLogic.endServe(true, "Generated Report", data);
        }
        else{
            this.sharedLogic.endServe(companyData.success, companyData.message, companyData.data);
        }
    }

}

module.exports = AdminLogic;
