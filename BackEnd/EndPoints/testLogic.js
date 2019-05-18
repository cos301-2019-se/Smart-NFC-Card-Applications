//keep this like this so you can use sharedLogic
var SharedLogic = require('./../SharedLogic/SharedLogic.js');

class TestLogic
{
	
	// all of the logic constructors should look exactly like this
	constructor(req, res)
	{
		this.req = req;
		this.res = res;
		this.sharedLogic = new SharedLogic(this);
		this.body = "{}";
		this.endpoint = "";
	}
	
	
	
	
	
	
	/* 
		the server.js file will call this function when they want to route to you
		so make sure all logics have the handle() function exactly like this
		read more below to understand what this.sharedLogic.initialHandle() does
	*/
	handle()
	{
		/* this will:
		extract the post body into this.body
		parse it as a json object into this.body
		validate the api key located in this.body
		call this.serve() once all completed
		*/
		this.sharedLogic.initialHandle();
	}
	
	
	
	
	
	
	/*
		this function will be called automatically by sharedLogic once initialHandle() is successful
		so make sure all logics have the serve() function, and they use this.body to do what they need to do
		at the end of these functions, call the this.sharedLogic.endServe method with the values you want to pass in
		read more below to see how to use the endServe function
	*/
	serve()
	{
		//this.body can be accessed as an object!
		//for example I will set the coolProperty attribute of this.body to 'deuces'
		//this.body.coolProperty = 'deuces';
		//now I will make another attribute, which is the original url requested
		//this.body.url = this.req.url;
		
		//now I will make an object that will be passed to the response json (i.e. the data part)
		//it is just a copy of what i got in from the POST request with my coolProperty attribute added
		//var data = this.body;
		
		
		switch(this.endpoint)
		{
			case "getBusinessCard":
				this.getBusinessCard();
				break;
			default:
				this.sharedLogic.endServe(false, "Invalid Endpoint", null);
		}
		
		
		
		/* this will:
		take in the values for success, message and data for the JSON response
		construct the JSON object, with these values in
		make the data for success=false a {}
		set the status code to 200, the content type to application/json
		finish the response by adding the stringified JSON response object
		send out the response!
		*/
		//this.sharedLogic.endServe(true, "In Test Subsystem", data);
		
		
	}
	
	getBusinessCard()
	{
		var data = new Object();
		data.firstName = "jared";
		data.company = "Discovery";
		this.sharedLogic.endServe(true, "Business Card", data);
	}
	
	
}

//do this so server.js can use you
module.exports = TestLogic;