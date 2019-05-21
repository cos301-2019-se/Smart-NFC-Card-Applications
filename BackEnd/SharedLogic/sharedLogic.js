//var CRUDController = require('./../CRUDController/controller.js');

class SharedLogic
{
	constructor(from)
	{
		this.from = from;
		//this.crudController = new CRUDController();
		this.crudController = null;
	}
	
	initialHandle()
	{
		this.constructBody();
	}
	
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
	
	convertBodyToJSON()
	{
		this.from.body = JSON.parse(this.from.body);
		this.extractEndpoint();
	}
	
	extractEndpoint()
	{
		this.from.endpoint = this.from.req.url.substring(this.from.req.url.substring(1).indexOf("/")+2);
		//console.log(this.from.endpoint);
		this.checkAPIToken();
	}
	
	validAPITokenOnDB(apiToken)
	{
		//checks in DB
		return true;
	}
	
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
				this.from.demoMode = this.from.body.demoMode;
				this.from.serve();
			}
			else
			{
				this.endServe(false, "Invalid API Key", null);
			}
		}
	}
	
	passwordHash(input)
	{
		return "12" + input + "34";
	}
	
	
	login()
	{
		
		var subsystem = this.from.req.url.substring(1, this.from.req.url.substring(1).indexOf("/")+1);
		var user = this.from.body.username;
		var pass = this.from.body.password;
		var apiKeyAndID = null;
		
		//switch on the subsystem entered
		switch(subsystem)
		{
			case "test": //test subsystem, just is correct
				apiKeyAndID = {correct: true, apiKey: "209s8kal193a009723527dnsndm285228", id : 5};
				
				break;
				
				
			case "app": //app subsystem, fetches by employee username
				var employeeDetails = this.crudController.getEmployee(user);
				//var employeeDetails = { passwordID : 5, employeeID: 45};
				var passwordID = employeeDetails.passwordID;
				
				var passwordDetails = this.crudController.getPassword(passwordID);
				//var passwordDetails = { hashedPassword : "12CoolPassword189salty9834", salt: "89salty98", apiKey : "1234"};
				var hashedPassword = passwordDetails.hashedPassword;
				var salt = passwordDetails.salt;
				
				var enteredHashedPassword = this.passwordHash(pass + salt);
				
				//check if hash(password, salt) is same as stored hash
				if(enteredHashedPassword === hashedPassword)
				{
					apiKeyAndID = {correct: true, apiKey: passwordDetails.apiKey, id : employeeDetails.employeeID};
				}
				else
				{
					apiKeyAndID = {correct: false};
				}
				break;
				
				
			case "admin": //admin subsystem, fetches by company username
				var companyDetails = this.crudController.getCompany(user);
				//var companyDetails = { passwordID : 76, companyID: 3};
				var passwordID = companyDetails.passwordID;
				
				var passwordDetails = this.crudController.getPassword(passwordID);
				//var passwordDetails = { hashedPassword : "12CoolPassword189salty9834", salt: "89salty98", apiKey : "4321"};
				var hashedPassword = passwordDetails.hashedPassword;
				var salt = passwordDetails.salt;
				
				var enteredHashedPassword = this.passwordHash(pass + salt);
				
				//check if hash(password, salt) is same as stored hash
				if(enteredHashedPassword === hashedPassword)
				{
					apiKeyAndID = {correct: true, apiKey: passwordDetails.apiKey, id : companyDetails.companyID};
				}
				else
				{
					apiKeyAndID = {correct: false};
				}
				break;
				
				
			default:
				apiKeyAndID = {correct: false};		
		}
		
		
		if(apiKeyAndID.correct === true)
		{
			var data = new Object();
			data.apiKey = apiKeyAndID.apiKey;
			data.id = apiKeyAndID.id;
			this.endServe(true, "Login successful.", data);
		}
		else
		{
			this.endServe(false, "Incorrect username and/or password.", {});
		}
		
		
	}
	
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
		if(required){
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
