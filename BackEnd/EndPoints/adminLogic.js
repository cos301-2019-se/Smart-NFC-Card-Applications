//keep this like this so you can use sharedLogic
var SharedLogic = require('./../SharedLogic/SharedLogic.js');

class AdminLogic
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

		//respond
		this.sharedLogic.endServe(true, "In Admin Subsystem", data);
		
		
	}
	
	
}

//do this so server.js can use you
module.exports = AdminLogic;