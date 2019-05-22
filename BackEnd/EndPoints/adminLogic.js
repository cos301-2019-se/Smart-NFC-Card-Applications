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
 *
 *	Functional Description:		 This class is used by our Link Admin Application in order
 *	                            to facilitate all operations needed for the correct operation
 *	                            of the Admin of a company and Link
 *	Error Messages:
 *	Assumptions: 	This file assumes that a there exists a 'sharedLogic' and a 'crudController'
 *                  class.
 *	Constraints: 	None
 */

var SharedLogic = require('./../SharedLogic/SharedLogic.js');
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
            case "addCompany":
                this.addCompany();
                break;
            case "addEmployee":
                this.addEmployee();
                break;
            default:
                this.sharedLogic.endServe(false, "Invalid Endpoint", null);
        }
    }

    /**
     *  Function that is called to create a company, will use SharedLogic's crudController in order to
     *  complete the operation
     *
     *  @param  name string The company name
     *  @param  website string The website belonging to the company
     *  @param  username string The username of the company - for login purposes
     *  @param  password string the password of the company - for login purposes
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

        if(this.body.name === undefined){
            presentParams = true;
            presentReturn += "name, ";
        }
        if(this.body.website === undefined){
            presentParams = true;
            presentReturn += "website, ";
        }
        if(this.body.username === undefined){
            presentParams = true;
            presentReturn += "username, ";
        }
        if(this.body.password === undefined){
            presentParams = true;
            presentReturn += "password, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.name)){
                invalidParams = true;
                invalidReturn += "name, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.website)){
                invalidParams = true;
                invalidReturn += "website, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.username)){
                invalidParams = true;
                invalidReturn += "username, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.password)){
                invalidParams = true;
                invalidReturn += "password, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.companyId = 0;
                    message = this.body.name + " Added! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    var passwordId = this.sharedLogic.crudController.createPassword(this.body.username, this.body.password);

                    if(passwordId.success){

                        var companyId = this.sharedLogic.crudController.createCompany(this.body.name, this.body.website, passwordId.data.passwordId);

                        if(companyId.success){
                            data.companyId = companyId.data.companyId;
                            message = this.body.name + " Added!";
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
     * Function that is called to create an employee, will use SharedLogic's crudController in order
     * to complete the operation. It will create an Employee belonging to the Company ID passed in through
     * the parameter
     *
     * @param   firstName string The name of the employee
     * @param   surname string The surname of the employee
     * @param   title string The Title of the employee e.g Mr/Mrs
     * @param   cellphone string The Cellphone number of the employee
     * @param   email string The email address of the employee - used for login purposes
     * @param   companyId int The ID of the company to which the employee is being added to
     * @param   password string The Password chosen by the employee - for login purposes
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

        if(this.body.firstName === undefined){
            presentParams = true;
            presentReturn += "firstName, ";
        }
        if(this.body.surname === undefined){
            presentParams = true;
            presentReturn += "surname, ";
        }
        if(this.body.title === undefined){
            presentParams = true;
            presentReturn += "title, ";
        }
        if(this.body.cellphone === undefined){
            presentParams = true;
            presentReturn += "cellphone, ";
        }
        if(this.body.email === undefined){
            presentParams = true;
            presentReturn += "email, ";
        }
        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        if(this.body.password === undefined){
            presentParams = true;
            presentReturn += "password, ";
        }
        //if parameters are present, validate if correct format
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.firstName) || !this.sharedLogic.validateAlpha(this.body.firstName)){
                invalidParams = true;
                invalidReturn += "firstName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.surname) || !this.sharedLogic.validateAlpha(this.body.surname)){
                invalidParams = true;
                invalidReturn += "surname, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.title)){
                invalidParams = true;
                invalidReturn += "title, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.cellphone) || !this.sharedLogic.validateCellphone(this.body.cellphone)){
                invalidParams = true;
                invalidReturn += "cellphone, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.email) || !this.sharedLogic.validateEmail(this.body.email)){
                invalidParams = true;
                invalidReturn += "email, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.password)){
                invalidParams = true;
                invalidReturn += "password, ";
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
                    var passwordId = this.sharedLogic.crudController.createPassword(this.body.email, this.body.email);

                    if(passwordId.success){

                        var employeeId = this.sharedLogic.crudController.createEmployee(this.body.firstName, this.body.surname,
                            this.body.title, this.body.cellphone,
                            this.body.email, this.body.companyId,
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

}

module.exports = AdminLogic;
