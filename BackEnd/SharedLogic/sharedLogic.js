//var CRUDController = require('./../CRUDController/controller.js');

class SharedLogic
{
	constructor(from)
	{
		this.from = from;
		//this.crudController = new CRUDController();
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
		this.checkAPIToken();
	}
	
	validAPITokenOnDB(apiToken)
	{
		//checks in DB
		return true;
	}
	
	checkAPIToken()
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
	
	login(username, password)
	{
		//returns the api key {api}
	}
	
	endServe(success, message, data)
	{
		var responseObject = new Object();
		var json = null;
		if(success)
		{
			responseObject.success = success;
			responseObject.message = message;
			responseObject.data = data;
			json = JSON.stringify(responseObject);
		}
		else
		{
			responseObject.success = success;
			responseObject.message = message;
			responseObject.data = {};
			json = JSON.stringify(responseObject);
		}
		
		this.from.res.statusCode = 200;
		this.from.res.setHeader('Content-Type', 'application/json');
		this.from.res.end(json);
	}

}

module.exports = SharedLogic;