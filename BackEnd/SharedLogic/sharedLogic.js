/**
 *	File Name:      sharedLogic.js
 *	Project:        Smart-NFC-Application
 *	Organization:	VastExpanse
 *	Copyright:	    © Copyright 2019 University of Pretoria
 *	Classes:	    SharedLogic
 *	Related documents:
 *
 *	Update History:
 *	Date		Author		Version		Changes
 *	-----------------------------------------------------------------------------------------
 *	2019/05/21	Jared		1.0		    Original
 *
 *	Functional Description:	This class is used by the (other)Logic.js files i.e. the (Other)Logic
							classes, and performs some common request data parsing, extraction, validation,
							authentication and response functions for these (Other)Logic classes.
							They include this class and make a new instance of it, allowing them to
							use the functionality defined here (hence, SHARED).
 *	Error Messages:
 *	Assumptions: This file assumes that a there exists a 'crudController' class.
 *	Constraints:
 */
 
 var CrudController = require('./../CrudController/crudController.js');
 var crypto = require('crypto');

/**
 * 	Purpose:    This class provides shared and common functionality to the (Other)Logic classes
				and also links the (Other)Logic classes to the CRUDController.
 *
 *	Usage:		This class can be used by the (Other)Logic classes to perform request data parsing, 
				extraction, validation, authentication and response functionality, so that it does 
				not have to be defined in those classes, it can be a set standard in this class.
 *
 *	@author:	Jared O'Reilly
 *
 *	@version:	1.0
 */
class SharedLogic
{
	/**
     *  Constructor for the class that links it to an (Other)Logic class and
	 *	also provides a link to the CRUDController class for these classes.
     *
     *  @param from adminLogic/testLogic The (Other)Logic class that this class provides services to
     */
	constructor(from)
	{
		this.from = from;
		this.crudController = new CrudController();
		this.demoMode = null;
	}
	
	/**
     *  The (Other)Logic classes will call this function in their handle() method, which the server calls
	 *	when that class is routed to to handle a request. This function initiates the sequence of actions 
	 *	that must take place when a new request comes in. This function starts the construction of the body.
     */
	initialHandle()
	{
		this.constructBody();
	}
	
	/**
     *  This function extracts the body of the HTTP POST request, chunk of data by chunk of data, and then
	 *	converts it into a simple String. It then starts the JSON parsing of the String representation of the body.
     */
	constructBody()
	{
		this.from.body = [];
		this.from.req
		.on('data', (chunk) => 
		{
		  this.from.body.push(chunk);
		})
		.on('end', () => 
		{
		  this.from.body = Buffer.concat(this.from.body).toString();
		  this.convertBodyToJSON();
		});
	}
	
	/**
     *  This function parses the String representation of the body into an object, assuming that the String]
	 * 	is formatted as a JSON object. The result is a Javascript object, stored in this.from.body, which the
	 *	(Other)Logic classes can then use to their discretion. This function then starts the body validation.
     */
	convertBodyToJSON()
	{
		if(this.from.body === "")
		{
			this.endServe(false, "No POST body received", null);
		}
		else
		{
			
			try
			{
				this.from.body = JSON.parse(this.from.body);
				this.from.demoMode = this.from.body.demoMode;
				this.demoMode = this.from.body.demoMode;
				this.validateBody();
			}
			catch(e)
			{
				if (e instanceof SyntaxError) 
				{
					this.endServe(false, "Invalid JSON object sent: " + e.message, null);
				} 
				else 
				{
					throw e;
				}
			}
			
			
		}
	}
	
	/**
     *  This function checks that the body has either an API Key OR both a username and password. It then starts
	 *	the endpoint extraction.
     */
	validateBody()
	{
		if(this.from.body.apiKey === undefined)
		{
			if(this.from.body.username === undefined || this.from.body.password === undefined)
			{
				this.endServe(false, "No API Key or not all login details provided", null);
			}
			else
			{
				this.extractEndpoint();
			}
		}
		else
		{
			this.crudController.apiKey = this.from.body.apiKey;
			this.extractEndpoint();
		}
	}
	
	/**
     *  This function extracts the endpoint of the request from the url of the request, using substrings and indexOf's
	 *	(looking from the second / onwards). The result is stored in this.from.endpoint, which the (Other)Logic classes
	 *	can then use to pick the function they will execute (based on the endpoint). This function then starts the authentication steps.
     */
	extractEndpoint()
	{
		this.from.endpoint = this.from.req.url.substring(this.from.req.url.substring(1).indexOf("/")+2);
		this.checkAPIToken();
	}
	
	
	/**
     *  This function is a helper function for checkAPIToken(), which, when CRUDController has been implemented, will
	 *	scan the DB and look for that API key in the DB, if it is in the DB, then it is valid, if not, then it is not.
     */
	validAPITokenOnDB(apiToken)
	{
		//checks in DB
		
		if(this.demoMode)
		{
			return true;
		}
		else
		{
			var passwordDetails = this.crudController.getPassword(apiToken);
			
			if(passwordDetails.success)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		
	}
	
	/**
     *  This function checks if the user was trying to login or was already logged in and had attached their 
	 *	API Key to the request. If they were trying to login, the login checks are then started. If they were
	 *	already logged in, their API Key is checked on the DB, and if it is a valid API Key, the (Other)Logic
	 *	class's serve() function is called, hence the initial request handling checks are complete. If it is
	 *	not a valid API Key, then a failure response is sent back.
     */
	checkAPIToken()
	{
		
		if(this.from.endpoint === "login")
		{
			this.login();
		}
		else
		{
			if(this.validAPITokenOnDB(this.from.body.apiKey))
			{
				this.from.serve();
			}
			else
			{
				this.endServe(false, "Invalid API Key", null);
			}
		}
	}
	
	/**
     *  This function takes in a password and a salt, and then hashes that password and salt combination
	 *	according to how it was hashed and salted before being stored on the DB (for correctness). This is
	 *	not implemented yet, as a hashing and salting scheme has not yet been picked.
	 *	@param pass String The password entered by the user
	 *	@param salt String The salt associated with that user on the DB
     */
	passwordHash(pass,salt)
	{
		//sha256
		
		return crypto.createHash('sha256').update(pass + salt).digest('hex')
		
		//return "12" + pass + salt + "34";
	}
	
	/**
     *  This function will perform the login for either an employee or a company (based on the subsystem
	 *	component of the url, extracted from the request's url). The username and password are extracted
	 *	from the body of the POST request, and then the following happens:
	 
	 *	- 	For an employee: their details are fetched using their username, their hashed and salted password
	 *		is then fetched, then the password they entered is hashed and salted and compared to the correct one,
	 *		and if it is correct, their API Key is returned to them along with their employee ID.
	 
	 *	- 	For a company: the company's details are fetched using the company's username, their hashed and salted password
	 *		is then fetched, then the password they entered is hashed and salted and compared to the correct one,
	 *		and if it is correct, their API Key is returned to them along with their company ID.
     */
	login()
	{
		
		var subsystem = this.from.req.url.substring(1, this.from.req.url.substring(1).indexOf("/")+1);
		var user = this.from.body.username;
		var pass = this.from.body.password;
		var apiKeyAndId = null;
		
		//switch on the subsystem entered
		switch(subsystem)
		{
			/*case "test":
				apiKeyAndID = {correct: true, apiKey: "209s8kal193a009723527dnsndm285228", id : 5};
				
				break;*/
				
				
			case "app":
				var employeeDetails = null;
				if(this.demoMode)
				{
					employeeDetails = { success: true, data: {employeeId: 0, passwordId : 0}};
				}
				else
				{
					employeeDetails = this.crudController.getEmployee(user);
				}
				if(employeeDetails.success)
				{
					employeeDetails = employeeDetails.data;
					var passwordId = employeeDetails.passwordId;
				
				
					var passwordDetails = null;
					if(this.demoMode)
					{
						passwordDetails = { success: true, data: { passwordHash : "b1070db9b04cb6901a9964841c8560f5c09bcbb6649db2d008daf4df81a65da7", salt: "40qY4HyU", apiKey : "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^"}};
					}
					else
					{
						passwordDetails = this.crudController.getPassword(passwordId);
					}
					if(passwordDetails.success)
					{
						passwordDetails = passwordDetails.data;
						var hashedPassword = passwordDetails.passwordHash;
						var salt = passwordDetails.salt;
						
						
						var enteredHashedPassword = this.passwordHash(pass,salt);
						if(enteredHashedPassword === hashedPassword)
						{
							apiKeyAndId = {correct: true, apiKey: passwordDetails.apiKey, id : employeeDetails.employeeId};
						}
						else
						{
							apiKeyAndId = {correct: false};
						}
					}
					else
					{
						apiKeyAndId = {correct: false};
					}
				}
				else
				{
					apiKeyAndId = {correct: false};
				}
				
				
				break;
				
				
			case "admin":
				var companyDetails = null;
				if(this.demoMode)
				{
					companyDetails = { success: true, data: {companyId: 0, passwordId : 0}};
				}
				else
				{
					companyDetails = this.crudController.getCompany(user);
				}
				if(companyDetails.success)
				{
					
					companyDetails = companyDetails.data;
					var passwordId = companyDetails.passwordId;
				
				
					var passwordDetails = null;
					if(this.demoMode)
					{
						passwordDetails = { success: true, data: { passwordHash : "b1070db9b04cb6901a9964841c8560f5c09bcbb6649db2d008daf4df81a65da7", salt: "40qY4HyU", apiKey : "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^"}};
					}
					else
					{
						passwordDetails = this.crudController.getPassword(passwordId);
					}
					if(passwordDetails.success)
					{
						passwordDetails = passwordDetails.data;
						var hashedPassword = passwordDetails.passwordHash;
						var salt = passwordDetails.salt;
						
						
						var enteredHashedPassword = this.passwordHash(pass,salt);
						
						if(enteredHashedPassword === hashedPassword)
						{
							apiKeyAndId = {correct: true, apiKey: passwordDetails.apiKey, id : companyDetails.companyId};
						}
						else
						{
							apiKeyAndId = {correct: false};
						}
					}
					else
					{
						apiKeyAndId = {correct: false};
					}
				}
				else
				{
					apiKeyAndId = {correct: false};
				}
				break;
				
				
			default:
				apiKeyAndId = {correct: false};		
		}
		
		
		if(apiKeyAndId.correct === true)
		{
			var data = new Object();
			data.apiKey = apiKeyAndId.apiKey;
			data.id = apiKeyAndId.id;
			this.endServe(true, "Login successful.", data);
		}
		else
		{
			this.endServe(false, "Incorrect username and/or password.", {});
		}
		
		
	}
	
	/**
     *  This function takes in the 3 components to be formatted into a JSON object, an object is then
	 *	constructed and then is stringified into a JSON String representation. A status code is attached
	 *	to the response, a content type header and lastly the stringified JSON is attached as the body of
	 *	response. This response is then returned to the outside user.
	 *	@param success boolean The value of success to be returned in the response to the user
	 *	@param message String The value of the message to be returned in the response to the user
	 *	@param data Object The object containing the data values to be returned in the response to the user
     */
	endServe(success, message, data)
	{
		var responseObject = new Object();
		var json = null;
		responseObject.success = success;
		responseObject.message = message;
		if(success)
		{
			responseObject.data = data;
			json = JSON.stringify(responseObject);
		}
		else
		{
			responseObject.data = {};
			json = JSON.stringify(responseObject);
		}
		
		this.from.res.statusCode = 200;
		this.from.res.setHeader('Content-Type', 'application/json');
		this.from.res.setHeader('Access-Control-Allow-Origin', '*');
		this.from.res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		this.from.res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');
		this.from.res.end(json);
	}

	/**
	 * Validates an email by using regex
	 * Info part may contain:
	 * - Uppercase (A-Z) and lowercase (a-z) English letters.
	 * - Digits (0-9).
	 * - Characters allowed: _ - .
	 * - Character . ( period, dot or fullstop) provided that it is not the first or last character and it will not come one after the other.
	 * Domain part may contain:
	 * - The domain name [for example com, org, net, in, us, info] part contains letters, digits, hyphens, and dots.
	 *
	 * @param email The email that will be tested against the regex
	 * @return boolean Will return true if the email matches the regex, else false
	 */
	validateEmail(email) {
		if(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(email)){
			return true;
		}
		else{
			return false
		}
	}

	/**
	 * Validates a cellphone number by using regex
	 * [0] allows for:
	 * - XXXXXXXXXX
	 * [1] allows for:
	 * - XXX-XXX-XXXX
	 * - XXX.XXX.XXXX
	 * - XXX XXX XXXX
	 * [2] allows for:
	 * - (+XX)-XX-XXX-XXXX
	 * - (+XX).XX.XXX.XXXX
	 * - (+XX) XX XXX XXXX
	 *
	 * @param cellphone The Cellphone number being compared to the regex
	 * @return boolean Will return true if the cellphone number matches any of the regex, else false
	 */
	validateCellphone(cellphone){
		var regex = [
			/^"?[0-9]{10}"?$/,
			/^"?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})"?$/,
			/^"?\(\+([0-9]{2})\)?[-. ]?([0-9]{2})[-. ]?([0-9]{3})[-. ]?([0-9]{4})"?$/
		];
		//test if the given cellphone number matches any of the regex
		for(var countRegex = 0; countRegex < regex.length; ++countRegex){
			if(regex[countRegex].test(cellphone)){
				return true;
			}
		}
		//if all checks fail
		return false;
	}

	/**
	 * Checks if the parameter is non-empty
	 * @param required The parameter that will be checked if non-empty
	 * @return boolean Will return true if non-empty, false otherwise
	 */
	validateNonEmpty(required){
		if(required || required===0){
			if(required.length === 0){
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
	validateNumeric(numbers){
		if(/^[0-9]+$/.test(numbers)){
			return true;
		}
		return false;
	}

	/**
	 * Checks if the parameter only contains alphabetical characters as well as " " (space) and -(dash)
	 * @param letters The parameter that is being compared against the regex
	 * @return boolean Returns true if satisfies the regex, false otherwise
	 */
	validateAlpha(letters){
		//allows for A-Z or a-z as first char, then followed by A-Z/a-z/ (space)/-
		if(/^([A-Za-z])([\-A-Za-z ])+$/.test(letters)){
			return true;
		}
		return false;
	}
}

module.exports = SharedLogic;
