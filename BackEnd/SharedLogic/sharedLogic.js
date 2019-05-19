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

}

module.exports = SharedLogic;