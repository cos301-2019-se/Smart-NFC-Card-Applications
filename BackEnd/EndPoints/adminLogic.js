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
            presentReturn += "name, ";
        }
        if(this.body.companyWebsite === undefined){
            presentParams = true;
            presentReturn += "website, ";
        }
        if(this.body.companyUsername === undefined){
            presentParams = true;
            presentReturn += "username, ";
        }
        if(this.body.companyPassword === undefined){
            presentParams = true;
            presentReturn += "password, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.companyName)){
                invalidParams = true;
                invalidReturn += "name, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyWebsite)){
                invalidParams = true;
                invalidReturn += "website, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyUsername)){
                invalidParams = true;
                invalidReturn += "username, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyPassword)){
                invalidParams = true;
                invalidReturn += "password, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams)
			{
                if(this.demoMode){
                    //return mock data
                    data.companyId = 0;
                    message = this.body.companyName + " Added! - Mock";
                    success = true;
                }
                else
				{
                    //return data from crudController
					var hash = "hash"; 
					var salt = "salt";
					var apiKey = "apikey11";
					var expirationDate = "2016-06-22 19:10:25.123";
					
					
                    me.sharedLogic.crudController.createPassword(me.body.companyUsername, hash, salt, apiKey, expirationDate, function(passwordId) 
					{
						console.log(passwordId);
						if(passwordId.success)
						{

							me.sharedLogic.crudController.createCompany(me.body.companyName, me.body.companyWebsite, passwordId.data.passwordId, function(companyId)
							{
								console.log(companyId);
								if(companyId.success){
									data.companyId = companyId.data.companyId;
									message = me.body.companyName + " Added!";
									success = true;
									me.sharedLogic.endServe(success, message, data);
								}
								else
								{
									data = null;
									message = companyId.message;
									success = false;
									me.sharedLogic.endServe(success, message, data);
								}
							});
						}
						else
						{
							
							data = null;
							message = passwordId.message;
							success = false;
							console.log("here");
							//console.log(me);
							me.sharedLogic.endServe(success, message, data);
						}
					});
                }
            }
            else
			{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
				this.sharedLogic.endServe(success, message, data);
            }
        }
        else
		{
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
     * @param   employeeFirstName string The name of the employee
     * @param   employeeSurname string The surname of the employee
     * @param   employeeTitle string The Title of the employee e.g Mr/Mrs
     * @param   employeeCellphone string The Cellphone number of the employee
     * @param   employeeEmail string The email address of the employee - used for login purposes
     * @param   companyId int The ID of the company to which the employee is being added to
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

        if(this.body.employeeFirstName === undefined){
            presentParams = true;
            presentReturn += "firstName, ";
        }
        if(this.body.employeeSurname === undefined){
            presentParams = true;
            presentReturn += "surname, ";
        }
        if(this.body.employeeTitle === undefined){
            presentParams = true;
            presentReturn += "title, ";
        }
        if(this.body.employeeCellphone === undefined){
            presentParams = true;
            presentReturn += "cellphone, ";
        }
        if(this.body.employeeEmail === undefined){
            presentParams = true;
            presentReturn += "email, ";
        }
        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        if(this.body.employeePassword === undefined){
            presentParams = true;
            presentReturn += "password, ";
        }
        //if parameters are present, validate if correct format
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeFirstName) || !this.sharedLogic.validateAlpha(this.body.employeeFirstName)){
                invalidParams = true;
                invalidReturn += "firstName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeSurname) || !this.sharedLogic.validateAlpha(this.body.employeeSurname)){
                invalidParams = true;
                invalidReturn += "surname, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeTitle)){
                invalidParams = true;
                invalidReturn += "title, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeCellphone) || !this.sharedLogic.validateCellphone(this.body.employeeCellphone)){
                invalidParams = true;
                invalidReturn += "cellphone, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeEmail) || !this.sharedLogic.validateEmail(this.body.employeeEmail)){
                invalidParams = true;
                invalidReturn += "email, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeePassword)){
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

                    var passwordId = this.sharedLogic.crudController.createPassword(this.body.employeeEmail, this.body.employeePassword);

                    if(passwordId.success){

                        var employeeId = this.sharedLogic.crudController.createEmployee(this.body.employeeFirstName, this.body.employeeSurname,
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

}

module.exports = AdminLogic;
