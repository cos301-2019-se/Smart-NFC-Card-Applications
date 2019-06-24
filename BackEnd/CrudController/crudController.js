/**
 *	File Name:	    crudController.js
 *	Project:		Smart-NFC-Application
 *	Orginization:	VastExpanse
 *	Copyright:	    © Copyright 2019 University of Pretoria
 *	Classes:        CrudController
 *	Related documents:
 *
 *	Update History:
 *	Date		Author		Version		Changes
 *	-----------------------------------------------------------------------------------------
 *	2019/05/23	Savvas		1.0		    Original
 *
 *	Functional Description:		 This class is the interface used by the Logic Components of the Link System to 
 *                               interact with the database. This class facilitates communication with the database.
 *	Error Messages:
 *	Assumptions: 	This file assumes that a there exists a database with the required structure for this class to communicate with
 *
 *	Constraints: 	None
 */

/**
* 	Purpose:	This class acts as an interface to access the persistant storage (database) of Link
*	Usage:		This class is used by the Logical server components which need access to private or public data stored permanently in the database
*               All functions of this class return Javascript objects containing "success", "message" and "data" fields. Note that if a function fails 
*               this will be indicated with success being false and the data field will also be null
*	@author:	Savvas Panagiotou
*	@version:	1.0
*/
class CrudController {

    /**
     * Default constructor 
     */
    constructor() {
        this.demoMode = true;
		this.apiKey = null;
    }
    /**
     * Create a company with the specified name, website and password ID
     * @param name The name of the company
     * @param website The website of the company
     * @param passwordId The password ID of the company
     * @return JSON {
     *                  success : boolean The success status of the response
     *                  message : string The message associated with the response
     *                  data : { 
     *                   companyId : int The ID of the company being added
     *                   }
     *               }
     *        
     */
    createCompany(name, website, passwordId) {
        var response;
        if (this.validateNonEmpty(name) && this.validateWebsite(website) && this.validateNumeric(passwordId)) {
            if (this.demoMode) {
                response = this.buildDefaultResponseObject(true, "Company Creation Successful", false, false);
                response.data.companyId = 0;
            } else {
                // fetch from database
            }
        } else {
            response = this.buildDefaultResponseObject(false, "Invalid Company Details Provided", true);
        }
        return response;
    }

    /**
     * Retrieves a company with the specified ID or Username. Returns a failure message
     * @param idOrUsername The ID or the Username of a company to be fetched from the databaase 
     * @return JSON {
     *                  success : boolean The success status of the response
     *                  message : string The message associated with the response
     *                  data : { 
     *                      companyId : int The ID of the company being added
     *                      companyName : string The name of the company
     *                      website : string The website of the company
     *                      passwordId : int The password ID of the company
     *                   }
     *               }
     *        
     */
    getCompany(idOrUsername) {
        var response;

        var isUsername = false;
        var isId = false;
        if (/[a-zA-Z]/.test(idOrUsername)) { // check if parameter contains at least one character
            isUsername = true
        } else if (this.validateNumeric(idOrUsername)) {
            isId = true;
        }

        if (this.demoMode) {
            if (isUsername || (isId && idOrUsername === 0)) {
                response = this.buildDefaultResponseObject(true, "Company Retrieval Successful", false, false);
                response.data.companyId = 0;
                response.data.companyName = "Vast Expanse";
                response.data.website = "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications"
                response.data.passwordId = 0
            } else {
                if (isUsername) {
                    response = this.buildDefaultResponseObject(false, "Company Username Does Not Exist", true);
                } else if (isId) {
                    response = this.buildDefaultResponseObject(false, "Company ID Does Not Exist", true);
                } else {
                    response = this.buildDefaultResponseObject(false, "Invalid Company Parameters Provided", true);
                }

            }
            return response;
        } else {
            //check database
        }
    }

    /**
     * UNIMPLEMENTED: Update the details of the company based on the input parameters
     * @param id The ID of the company 
     * @param name The name of the ompany
     * @param website The website of the company
     * @param passwordId The password ID of the company
     */
    updateCompany(id, name, website, passwordId) {
        return this.buildDefaultResponseObject(false, "Unimplemented", true);
    }

    /**
     * UNIMPLEMENTED: Deletes a company given a company ID
     * @param id The ID of the company
     */
    deleteCompany(id) {
        return this.buildDefaultResponseObject(false, "Unimplemented", true);
    }

    /**
     * Creates an employee with the provided details
     * @param firstName The first name of the employee
     * @param surname The surname of the employee
     * @param title The title of the employee e.g. Mrs
     * @param cellphone The cell phone number of the employee (as a string)
     * @param email The email of the employee
     * @param companyId The company ID of the employee
     * @param passwordId The password ID of the employee
     * @return JSON {
     *                  success : boolean The success status of the response
     *                  message : string The message associated with the response
     *                  data : { 
     *                      employeeId : int The ID of the Employee that was added
     *                   }
     *               }
     */
    createEmployee(firstName, surname, title, cellphone, email, companyId, passwordId) {
        var response;

        if (this.validateAlpha(firstName) && this.validateAlpha(surname) && this.validateNonEmpty(title) && this.validateCellphone(cellphone) && this.validateEmail(email) && this.validateNumeric(companyId) && this.validateNumeric(passwordId)) {
            if (this.demoMode) {
                response = this.buildDefaultResponseObject(true, "Successfully Created Employee", false, false);
                response.data.employeeId = 0;
                return response;
            } else {
                //check database
            }
        } else {
            return this.buildDefaultResponseObject(false, "Invalid Employee Information Provided", true);

        }
    }

    /**
     * Retrieves the employee with the specified ID or Username (depending on which parameter was provided)
     * @param idOrUsername The ID or the Username of the employee
     * @return JSON {
     *                  success : boolean The success status of the response
     *                  message : string The message associated with the response
     *                  data : { 
     *                      employeeId : int The ID of the Employee
     *                      employeeTitle : string The Title of the Employee 
     *                      employeeName : string the Name of the Employee
     *                      employeeSurname : string the Surname of the Employee
     *                      employeeEmail : string the Email of the Employee
     *                      employeeCellphone : string the Cellphone number of the Employee
     *                      companyId : int the Company ID of the Employee
     *                      passwordId : int the Password ID of the Employee
     *                   }
     *               }
     */
    getEmployee(idOrUsername) {
        var response;
        var isUsername = false;
        if (this.validateEmail(idOrUsername)) { //assuming employee username must be an email
            isUsername = true
        }

        if (this.demoMode) {
            if (isUsername || idOrUsername === 0) {
                response = this.buildDefaultResponseObject(true, "Employee Retrieval Successful", false, false);
                response.data.employeeId = 0;
                response.data.employeeTitle = "Mr";
                response.data.employeeName = "Piet";
                response.data.employeeSurname = "Pompies";
                response.data.employeeEmail = "piet.pompies@gmail.com";
                response.data.employeeCellphone = "0791637273";
                response.data.companyId = 0;
                response.data.passwordId = 0;
            } else {
                if (isUsername) {
                    response = this.buildDefaultResponseObject(false, "Employee Username Does Not Exist", true);
                } else {
                    response = this.buildDefaultResponseObject(false, "Employee ID Does Not Exist", true);
                }

            }
            return response;
        } else {
            //check database
        }
    }

    /**
     * UNIMPLEMENTED: Updates the details of an Employee in the database
     * @param id The ID of the employee
     * @param firstName The first name of the employee
     * @param surname The surname of the employee
     * @param title The title of the employee e.g. Mrs
     * @param cellphone The cellphone number of the employee as a string
     * @param email The email of the employee
     * @param companyId The company ID of the employee
     * @param passwordId The password ID of the employee
     */
    updateEmployee(id, firstName, surname, title, cellphone, email, companyId, passwordId) {
        return this.buildDefaultResponseObject(false, "Unimplemented", true);
    }
    /**
     * UNIMPLEMENTED: Deletes an employee from the database given the specified ID 
     * @param id The ID of the employee
     */
    deleteEmployee(id) {
        return this.buildDefaultResponseObject(false, "Unimplemented", true);
    }

    /**
     * Creates a new password in the database
     * @param username The username to be linked to the new password
     * @param password The new password
     * @return JSON {
     *                  success : boolean The success status of the response
     *                  message : string The message associated with the response
     *                  data : { 
     *                      passwordId : int The ID of the password created
     *                   }
     *               }
     */
    createPassword(username, password) {
        var response;
        if (this.demoMode) {
            if (/[a-zA-Z]/.test(username) && this.validateNonEmpty(password)) { //username just needs a character. more complex regex can be updated
                response = this.buildDefaultResponseObject(true, "Password Creation Successful", false, false);
                response.data.passwordId = 0;
            } else {
                response = this.buildDefaultResponseObject(false, "Invalid Password Information Provided", true);
            }
            return response;
        } else {
            //check database
        }
    }

    /**
     * Retrieves details about a password 
     * @param idOrApiKey The ID or API Key used to identify a password
     * @return JSON {
     *                  success : boolean The success status of the response
     *                  message : string The message associated with the response
     *                  data : { 
     *                      passwordId : int The password ID
     *                      username : string The username
     *                      passwordHash : string The password in hashed form
     *                      salt : string The salt of associated with the password
     *                      apiKey : string The API Key associeated with the password
     *                      expiryDate : string The expiry date of the API Key
     *                   }
     *               }
     */
    getPassword(idOrApiKey) {
        var response;
        var isId = false;
        if (this.validateNumeric(idOrApiKey)) { // weak check needs improvement
            isId = true;
        }

        if (this.demoMode) {
            if ((isId && idOrApiKey == 0) || (idOrApiKey === "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^")) {
                response = this.buildDefaultResponseObject(true, "Password Retrieval Successful", false, false);
                response.data.passwordId = 0;
                response.data.username = "piet.pompies@gmail.com";
                response.data.passwordHash = "b1070db9b04cb6901a9964841c8560f5c09bcbb6649db2d008daf4df81a65da7";
                response.data.salt = "40qY4HyU";
                response.data.apiKey = "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^";
                response.data.expiryDate = "9999-99-99";
            } else {
                if (isId) {
                    response = this.buildDefaultResponseObject(false, "Password ID Does Not Exist", true);
                } else {
                    response = this.buildDefaultResponseObject(false, "Password API Key Does Not Exist", true);

                }

            }
            return response;

        } else {
            //check database
        }
    }

    /**
     * UNIMPLEMENTED: Updates a given password entry in the database
     * @param id The ID of a password
     * @param username The username associated with the password
     * @param password The new password 
     */
    updatePassword(id, username, password) {
        return this.buildDefaultResponseObject(false, "Unimplemented", true);
    }
    /**
     * UNIMPLEMENTED: Deletes the password associated with the given ID
     * @param id The ID of the password
     */
    deletePassword(id) {
        return this.buildDefaultResponseObject(false, "Unimplemented", true);
    }
	
	
	//Company
	
	
	
	
	
	
	//Building
	
	
	
	
	
	//Password
	
	
	
	
	
	//Room
	
	
	
	
	//NFCAccessPoints
	
	
	
	
	
	//Employee
	
	
	
	
	//Client
	
	
	
	//WiFiParams
	
	
	
	
	//TempWifiAccess
	
	
	
	
	//VisitorPackage
	
	
	
	
	//TPA
	
	
	
	
	
	//TPAxRoom
	
	
	
	
	//Wallet
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

    /**
     * Constructs an object complies with the standard response format and which is used by all response methods in this class
     * @param success Boolean indicating if the response is successful or not
     * @param message Message to go along with the response
     * @param hasNullData Boolean indicating if there will be a null body or not
     * @param isArray (Optional) Boolean indicating whether the body is an object or an array
     * @return JSON {
     *                  success : boolean The success status of the response
     *                  message : string The message associated with the response
     *                  data : {} OR data : [] OR data : null
     *               }
     */
    buildDefaultResponseObject(success, message, hasNullData, isArray) {
        var response = {};
        response.success = success;
        response.message = message;
        if (hasNullData) {
            response.data = null;
        } else {
            if (isArray)
                response.data = [];
            else
                response.data = {};
        }
        return response;
    }

    /**
	 * Checks if the parameter is a website
	 * @param website The parameter that will be checked for being a website
	 * @return boolean Will return true if the parameter is a website, false otherwise
	 */
    validateWebsite(website) {
        if (/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(website)) {
            return true;
        }
        return false;
    }

    /**
	 * Checks if the parameter is non-empty
	 * @param required The parameter that will be checked if non-empty
	 * @return boolean Will return true if non-empty, false otherwise
	 */
    validateNonEmpty(required) {
        if (required || required === 0) {
            if (required.length === 0) {
                return false;
            }
            return true;
        }
        return false;
    }

	/**
	 * Checks if the parameter only consists of numbers using regex
	 * @param numbers The parameter to be checked against the regex
	 * @return boolean Returns true if satisfies the regex, false otherwise
	 */
    validateNumeric(numbers) {
        if (/^[0-9]+$/.test(numbers)) {
            return true;
        }
        return false;
    }

	/**
	 * Checks if the parameter only contains alphabetical characters as well as " " (space) and -(dash)
	 * @param letters The parameter that is being compared against the regex
	 * @return boolean Returns true if satisfies the regex, false otherwise
	 */
    validateAlpha(letters) {
        //allows for A-Z or a-z as first char, then followed by A-Z/a-z/ (space)/-
        if (/^([A-Za-z])([\-A-Za-z ])+$/.test(letters)) {
            return true;
        }
        return false;
    }

    /**
	 * Checks if the parameter is a cellphone number
	 * @param cellphone The parameter that will be checked for being a cellphone number
	 * @return boolean Will return true if the parameter is a cellphone number, false otherwise
	 */
    validateCellphone(cellphone) {
        var regex = [
            /^"?[0-9]{10}"?$/,
            /^"?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})"?$/,
            /^"?\(\+([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{3})[-. ]?([0-9]{4})"?$/
        ];
        //test if the given cellphone number matches any of the regex
        for (var countRegex = 0; countRegex < regex.length; ++countRegex) {
            if (regex[countRegex].test(cellphone)) {
                return true;
            }
        }
        return false;
    }

    /**
	 * Checks if the parameter is an email
	 * @param email The parameter that will be checked for being an email
	 * @return boolean Will return true if the parameter is an email, false otherwise
	 */
    validateEmail(email) {
        if (/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(email)) {
            return true;
        }
        else {
            return false
        }
    }
}


module.exports = CrudController;
