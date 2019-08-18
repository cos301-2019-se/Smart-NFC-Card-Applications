/**
 *	File Name:	    parentLogic.js
 *	Project:		Smart-NFC-Application
 *	Organization:	VastExpanse
 *	Copyright:	    © Copyright 2019 University of Pretoria
 *	Classes:        parentLogic
 *	Related documents:
 *
 *	Update History:
 *	Date		Author		Version		Changes
 *	-----------------------------------------------------------------------------------------
 *	2019/08/18	Duncan		1.0		    Original
 *
 *	Functional Description:		this class will act as an abstract class for the template method
 *	Error Messages:
 *	Assumptions: 	This file assumes that a there exists a crudController to access the database and sharedLogic for common functions
 *
 *	Constraints: 	None
 */

/**
 * 	Purpose:	This class facilitates template method
 *	Usage:		This class will allow the use of template method for maintainability and modularity
 *	@author:	Duncan Vodden
 *	@version:	1.0
 */
let SharedLogic = require('./../SharedLogic/sharedLogic.js');
class parentLogic {

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
        this.sharedLogic.initialHandle();
    }

    /**
     * abstract class to be implemented in classes which require apikeys to be entered
     */
    serve(){ // abstract class that has to be implemented in child classes
        this.serve();
    }
}
module.exports = parentLogic;
