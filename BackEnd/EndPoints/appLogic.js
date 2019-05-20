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
 *
 *	Functional Description:	This class handles the functionality that will be requested by the
 *                          application to the backend system. It handles functionality like
 *                          when a user requests a business card from the server.
 *	Error Messages:
 *	Assumptions: This file assumes that a there exists a 'sharedLogic' and a 'crudController'
 *               class.
 *	Constraints:
 */

let SharedLogic = require("./../SharedLogic/sharedLogic.js");
let demoMode = true;

/**
 * 	Purpose:    This class handles the functionality that will be requested by the
 *              application to the backend system.
 *
 *	Usage:		This class can be used to retrieve details from the backend system
 *              in order to generate a business card.
 *
 *	@author:	Tjaart Booyens
 *
 *	@version:	1.0
 */
class AppLogic{
    /**
     *  Constructor for the class that sets up certain properties as well as instantiate
     *  a new sharedLogic object.
     *
     *  @param req string Request sent from the application to the backend system
     *  @param res string Response sent back to the application
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
            case "getBusinessCard":
                this.getBusinessCard();
                break;

            default:
                this.sharedLogic.endServe(false, "Invalid Endpoint", null);
        }
    }

    /**
     *  Function that returns the information needed to generate a business card for
     *  the user who requested it.
     *
     *  @param employeeId int Employee ID that is sent through with the application
     *                        request.
     */
    getBusinessCard(){
        let data = {};
        let message;

        if(demoMode){
            // return mock data
            data.employeeName = "Tjaart";
            data.employeeSurname = "Booyens";
            data.companyName = "Vast Expanse";
            data.cellphone = "0791807734";
            data.email = "u17021775@tuks.co.za";
            data.website = "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications";
            message = "Mock business card information loaded successfully";
        }
        else{
            // get data by calling the crud controller
            let employeeData = this.sharedLogic.crudController.getEmployee(this.body.employeeId);
            let companyData = this.sharedLogic.crudController.getCompany(employeeData.companyId);

            data.employeeName = employeeData.employeeName;
            data.employeeSurname = employeeData.employeeSurname;
            data.cellphone = employeeData.cellphone;
            data.email = employeeData.email;
            data.companyName = companyData.companyName;
            data.website = companyData.website;
            message = "Business card information loaded successfully";
        }

        this.sharedLogic.endServe(true, message, data);
    }
}

module.exports = AppLogic;