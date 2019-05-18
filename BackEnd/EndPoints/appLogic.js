//keep this like this so you can use sharedLogic
var SharedLogic = require('./../SharedLogic/SharedLogic.js');

class AppLogic
{
	
	constructor(req, res)
	{
		this.req = req;
		this.res = res;
		this.sharedLogic = new SharedLogic(this);
		this.body = "{}";
	}
	
	handle()
	{
		//handle request initially
		this.sharedLogic.initialHandle();
	}
	
	serve()
	{
		//do stuff
		var data = this.body;
		
		var data = new Object();
		data.firstName = "Jared";
		data.secondName = "O'Reilly";
		data.companyName = "Discovery";
		data.website = "www.discovery.co.za";
		

		//respond
		this.sharedLogic.endServe(true, "In App Subsystem", data);
		
		
	}
	
	
}

//do this so server.js can use you
module.exports = AppLogic;