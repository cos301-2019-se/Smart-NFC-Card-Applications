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
	
	login()
	{
		var user = this.from.body.username;
		var pass = this.from.body.password;
		
		//var apiKeyAndID = this.crudController.correctUsernameAndPassword(user, pass);
		var apiKeyAndID = {correct: true, apiKey: "209s8kal193a009723527dnsndm285228", id : 5};
		
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