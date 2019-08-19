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
 *	2019/07/11  Savvas		1.1			Made Admin and App Logging in Synchronous. Allowed logging in via API Key
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
var nodemailer = require('nodemailer');

/**
 * 	Purpose:    This class provides shared and common functionality to the (Other)Logic classes
				and also links the (Other)Logic classes to the CRUDController.
 *
 *	Usage:		This class can be used by the (Other)Logic classes to perform request data parsing, 
				extraction, validation, authentication and response functionality, so that it does 
				not have to be defined in those classes, it can be a set standard in this class.
 *
 *	@author:	Jared O'Reilly, edits by Savvas Panagiotou
 *
 *	@version:	1.1
 */
class SharedLogic {
	/**
     *  Constructor for the class that links it to an (Other)Logic class and
	 *	also provides a link to the CRUDController class for these classes.
     *
     *  @param from adminLogic/testLogic The (Other)Logic class that this class provides services to
     */
	constructor(from) {
		this.from = from;
		this.crudController = new CrudController();
		this.demoMode = null;
	}

	/**
     *  The (Other)Logic classes will call this function in their handle() method, which the server calls
	 *	when that class is routed to to handle a request. This function initiates the sequence of actions 
	 *	that must take place when a new request comes in. This function starts the construction of the body.
     */
	initialHandle() {
		this.constructBody();
	}

	/**
     *  This function extracts the body of the HTTP POST request, chunk of data by chunk of data, and then
	 *	converts it into a simple String. It then starts the JSON parsing of the String representation of the body.
     */
	constructBody() {
		this.from.body = [];
		this.from.req
			.on('data', (chunk) => {
				this.from.body.push(chunk);
			})
			.on('end', () => {
				this.from.body = Buffer.concat(this.from.body).toString();
				this.convertBodyToJSON();
			});
	}

	/**
     *  This function parses the String representation of the body into an object, assuming that the String]
	 * 	is formatted as a JSON object. The result is a Javascript object, stored in this.from.body, which the
	 *	(Other)Logic classes can then use to their discretion. This function then starts the body validation.
     */
	convertBodyToJSON() {
		if (this.from.body === "") {
			this.endServe(false, "No POST body received", null);
		}
		else {
			try {
				this.from.body = JSON.parse(this.from.body);
				this.from.demoMode = this.from.body.demoMode;
				this.demoMode = this.from.body.demoMode;
				this.validateBody();
			}
			catch (e) {
				if (e instanceof SyntaxError) {
					this.endServe(false, "Invalid JSON object sent: " + e.message, null);
				}
				else {
					throw e;
				}
			}
		}
	}

	/**
     *  This function checks that the body has either an API Key OR both a username and password. It then starts
	 *	the endpoint extraction.
     */
	validateBody() {

		if (this.from.body.apiKey === undefined) {
			if (this.from.body.username === undefined || this.from.body.password === undefined) {
				this.endServe(false, "No API Key or not all login details provided", null);
			}
			else {
				this.extractEndpoint();
			}
		}
		else {
			this.extractEndpoint();
		}
	}

	/**
     *  This function extracts the endpoint of the request from the url of the request, using substrings and indexOf's
	 *	(looking from the second / onwards). The result is stored in this.from.endpoint, which the (Other)Logic classes
	 *	can then use to pick the function they will execute (based on the endpoint). This function then starts the authentication steps.
     */
	extractEndpoint() {
		this.from.endpoint = this.from.req.url.substring(this.from.req.url.substring(1).indexOf("/") + 2);
		this.checkAPIToken();
	}


	/**
     *  This function is a helper function for checkAPIToken(), which, when CRUDController has been implemented, will
	 *	scan the DB and look for that API key in the DB, if it is in the DB, then it is valid, if not, then it is not.
     */
	async validAPITokenOnDB(apiToken) 
	{
		//checks in DB
		
		if (this.demoMode) 
		{
			return true;
		}
		else 
		{
			//checks if in DB
			var passwordDetails = await this.crudController.getPasswordByApiKey(apiToken);

			if (passwordDetails.success) 
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
	async checkAPIToken() {

		if (this.from.endpoint === "login") 
		{
			//two types of login - one with just api key and one with username and password
			if (this.from.body.apiKey) 
			{
				var passwordDetails = await this.crudController.getPasswordByApiKey(this.from.body.apiKey);
				var data = {};
				if (passwordDetails.success) 
				{
					var subsystem = this.from.req.url.substring(1, this.from.req.url.substring(1).indexOf("/") + 1);
					if (subsystem === "admin") 
					{
						var companyDetails = await this.crudController.getCompanyByPasswordId(passwordDetails.data.passwordId);
						if (companyDetails.success) 
						{
							data.apiKey = passwordDetails.data.apiKey;
							data.id = companyDetails.data.companyId;
							this.endServe(true, "Login successful.", data);
						} 
						else 
						{
							this.endServe(false, "Invalid API Key", null);
						}
					} 
					else if (subsystem === "app") 
					{
						//try look if this is an employee
						var employeeDetails = await this.crudController.getEmployeeByPasswordId(passwordDetails.data.passwordId);
						if (employeeDetails.success) 
						{
							data.apiKey = passwordDetails.data.apiKey;
							data.id = employeeDetails.data.employeeId;
							this.endServe(true, "Login successful.", data);
						} 
						else 
						{
							this.endServe(false, "Invalid API Key", null);
						}
					} 
					else 
					{
						this.endServe(false, "Invalid Login Endpoint", null);
					}
				}
				else
				{
					this.endServe(false, "Invalid API Key", null);
				}
			} 
			else 
			{
				this.login();
			}

		}
		else 
		{
			
			var validApiKey = await this.validAPITokenOnDB(this.from.body.apiKey)
			if (validApiKey) 
			{
				var viewRes = await this.crudController.initialize(this.from.body.apiKey, this.from.body.demoMode);
				
				this.from.serve();
			}
			else 
			{
				this.endServe(false, "Invalid API Key", null);
			}
		}
	}

	/**
	 * 	
     *  This function will perform the login for either an employee or a company (based on the subsystem
	 *	component of the url, extracted from the request's url). The username and password are extracted
	 *	from the body of the POST request, and then the following happens:
		The username is searched for in the passwords table (This is the same process for both a company and a employee logging in).
		 Then depending on whether this is a company login or an employee login, the corresponding passwordId is used 
		 to search either the employee or the company table
     */
	async login() {
		var subsystem = this.from.req.url.substring(1, this.from.req.url.substring(1).indexOf("/") + 1);
		var user = this.from.body.username;
		var pass = this.from.body.password;
		var apiKeyAndId = null;
		var passwordDetails = null;
		passwordDetails = null;
		if (this.demoMode) {
			passwordDetails = { success: true, data: { hash: "b1070db9b04cb6901a9964841c8560f5c09bcbb6649db2d008daf4df81a65da7", salt: "40qY4HyU", apiKey: "lbUqdlBJXqsgYL8)Tfl!LZx6jzvf5wP^" } };
		}
		else {
			passwordDetails = await this.crudController.getPasswordByUsername(user);
		}
		if (passwordDetails.success && passwordDetails.data && passwordDetails.data.hash && passwordDetails.data.salt) {
			passwordDetails = passwordDetails.data;
			var hashedPassword = passwordDetails.hash;
			var salt = passwordDetails.salt;
			var enteredHashedPassword = this.passwordHash(pass, salt);
			if (enteredHashedPassword === hashedPassword) {
				if (this.demoMode) {
					apiKeyAndId = { correct: true, apiKey: passwordDetails.apiKey, id: 0 }; //default zero id for employee
				} else {
					//switch on the subsystem entered: note the above process is identical for both versions of logging in
					switch (subsystem) {
						case "app":
							//search for the employeeId in the employee table
							var employeeDetails = await this.crudController.getEmployeeByPasswordId(passwordDetails.passwordId);
							if (employeeDetails.success) {
								let emailMessage = "A user has logged into your Link profile.\n\n If this was not done by you, please contact your company representative. \n\nKind Regards\nLink Development Team";
								this.sendEmail(employeeDetails.data.email,"Link Login", emailMessage);
								apiKeyAndId = { correct: true, apiKey: passwordDetails.apiKey, id: employeeDetails.data.employeeId };
							} else {
								apiKeyAndId = { correct: false };
							}
							break;
						case "admin":
							//search for the companyId in the company table
							var companyDetails = await this.crudController.getCompanyByPasswordId(passwordDetails.passwordId);
							if (companyDetails.success) {
								apiKeyAndId = { correct: true, apiKey: passwordDetails.apiKey, id: companyDetails.data.companyId };
							} else {
								apiKeyAndId = { correct: false };
							}
							break;
						default:
							apiKeyAndId = { correct: false };
					}
				}
			}
			else {
				apiKeyAndId = { correct: false };
			}
		}
		else {
			apiKeyAndId = { correct: false };
		}

		if (apiKeyAndId.correct === true) {
			var data = new Object();
			data.apiKey = apiKeyAndId.apiKey;
			data.id = apiKeyAndId.id;
			this.endServe(true, "Login successful.", data);
		}
		else {
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
	async endServe(success, message, data) {
		
		var viewRes = await this.crudController.deInitialize();
		console.log(viewRes);
		this.crudController.client.end();
		
		var responseObject = new Object();
		var json = null;
		responseObject.success = success;
		responseObject.message = message;
		if (success) {
			responseObject.data = data;
			json = JSON.stringify(responseObject);
		}
		else {
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
		if (/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(email)) {
			return true;
		}
		else {
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
		//if all checks fail
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
	 *  This function generates a random string of length 200, conforming to our api key format
	 */
	genApiKey() {
		return this.randomString(200);
	}

	/**
	 *  This function generates a random string of length 20, conforming to our salt format
	 */
	genSalt() {
		return this.randomString(20);
	}

	/**
	 *  This function takes in a password, generates a random salt and then hashes them using the hash
	 *  function selected and used in the passwordHash function, returning that hash
	 *	@param pass String The password entered by the user
	 */
	genHash(pass) {
		return passwordHash(pass, genSalt());
	}

	/**
	 *  This function takes in a password and a salt, and then hashes that password and salt combination
	 *	according to how it was hashed and salted before being stored on the DB (for correctness). This is
	 *	not implemented yet, as a hashing and salting scheme has not yet been picked.
	 *	@param pass String The password entered by the user
	 *	@param salt String The salt associated with that user on the DB
	 */
	passwordHash(pass, salt) {
		//sha256

		return crypto.createHash('sha256').update(pass + salt).digest('hex')

		//return "12" + pass + salt + "34";
	}

	/**
	 *  This function generates a random alphanumeric string of a certain length
	 *	@param length the length of the random string to generate
	 */
	randomString(length) {
		var result = '';
		var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
		var choiceLength = chars.length;
		for (var i = 0; i < length; i++) {
			result += chars.charAt(Math.floor(Math.random() * choiceLength));
		}
		return result;
	}

	/**
	 *  This function returns the date of now + addHours many hours, wrapping around with days
	 *	@param the amount of hours to add on
	 */
	getDate(addHours) {
		var currentDate = new Date();
		var year = currentDate.getFullYear();
		var month = currentDate.getMonth() + 1;
		var day = currentDate.getDate();
		var hour = currentDate.getHours() + addHours;
		var minute = currentDate.getMinutes();
		var second = currentDate.getSeconds();
		var milliSecond = currentDate.getMilliseconds();

		if (month.toString().length === 1) {
			month = '0' + month;
		}
		if (hour >= 24) {
			day += 1;
			hour -= 24;
		}
		if (hour.toString().length === 1) {
			hour = '0' + hour;
		}
		if (day.toString().length === 1) {
			day = '0' + day;
		}
		if (minute.toString().length === 1) {
			minute = '0' + minute;
		}
		if (second.toString().length === 1) {
			second = '0' + second;
		}
		if (milliSecond.toString().length === 1) {
			milliSecond = '0' + milliSecond;
		}
		var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + milliSecond;
		return dateTime;
	}

	/**
	 *  This function is used to send emails
	 *	@param sendTo string the email address to be sent to
	 *	@param subject string the subject of the email
	 *	@param body string the body of the email
	 */
	sendEmail(sentTo, subject, body){
		var transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: 'team.vast.expanse@gmail.com',
				pass: 'nWOz5Z8Lk6HnhC2'
			}
		});
		var mailOptions = {
			from: 'team.vast.expanse@gmail.com',
			to: sentTo,
			subject: subject,
			text: body
		};
		transporter.sendMail(mailOptions, function(error, info){
			if (error) {
				// console.log(error);
			} else {
				// console.log('Email sent: ' + info.response);
			}
		});
	}

}

module.exports = SharedLogic;
