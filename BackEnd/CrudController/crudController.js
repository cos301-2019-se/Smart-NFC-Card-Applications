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
 *	2019/06/25	Jared		1.1			Added all creates and reads
 *	2019/06/25	Savvas		1.2			Added all updates and deletes
 *	2019/07/08	Jared		2.0			Make async into sync for all
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

const { Pool, Client } = require('pg');


class CrudController {

    /**
     * Default constructor 
     */
    constructor() {
        this.demoMode = true;
		this.apiKey = null;
		this.isEmployee = true;
		
		this.client = new Client({
		  user: 'postgres',
		  host: 'localhost',
		  database: 'link',
		  password: 'nbuser',
		  port: 5432,
		});
		
		this.client.connect();
		
		
    }
	
	
	initialize(apiKey)
	{
		///////////////////////////////////////////////////////////// TODO
	}
    
    returnDatabaseError(errorMessage){
       return this.buildDefaultResponseObject(false, "Database query failed: " + errorMessage , true);
    }

	
	//Company
	
	/**
	*	Creates a new company
	*	@param companyName 
	*	@param companyWebsite 
	*	@param passwordId 
	*	@return { companyId }
	*/
	async createCompany(companyName,companyWebsite,passwordId)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({companyName})[0], companyName, c, v);
		this.bigAppend(Object.keys({companyWebsite})[0], companyWebsite, c, v);
		this.bigAppend(Object.keys({passwordId})[0], passwordId, c, v);
					
		var ret = null;
		
		let res;
		try
		{
			res = await this.client.query(this.constructInsert("Company", "companyId", c, v),v);
			ret = this.buildDefaultResponseObject(true, "Successfully added company", false, false);
			ret.data.companyId = res.rows[0].companyid;
			return ret;
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}		
		
	}
	
	/**
	*	Retrieves a company using companyId
	*	@param companyId 
	*	@return { companyId, companyName, companyWebsite, passwordId }
	*/
	async getCompanyByCompanyId(companyId)
	{
		var query = 'SELECT * FROM Company WHERE companyId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [companyId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Company with that matching companyId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved company", false, false);
				ret.data.companyId = res.rows[0].companyid;
				ret.data.companyName = res.rows[0].companyname;
				ret.data.companyWebsite = res.rows[0].companywebsite;
				ret.data.passwordId = res.rows[0].passwordid;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		
		/*
		this.client.query(query, [companyId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Company with that matching companyId");
				ret = this.returnDatabaseError("no rows in Company with that matching companyId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved company", false, false);
				ret.data.companyId = res.rows[0].companyid;
				ret.data.companyName = res.rows[0].companyname;
				ret.data.companyWebsite = res.rows[0].companywebsite;
				ret.data.passwordId = res.rows[0].passwordid;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}

	/**
	*	Retrieves a company using passwordId
	*	@param passwordId 
	*	@return { companyId, companyName, companyWebsite, passwordId }
	*/
	async getCompanyByPasswordId(passwordId)
	{
		var query = 'SELECT * FROM Company WHERE passwordId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [passwordId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Company with that matching passwordId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved company", false, false);
				ret.data.companyId = res.rows[0].companyid;
				ret.data.companyName = res.rows[0].companyname;
				ret.data.companyWebsite = res.rows[0].companywebsite;
				ret.data.passwordId = res.rows[0].passwordid;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		
		
		/*this.client.query(query, [passwordId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Company with that matching passwordId");
				ret = this.returnDatabaseError("no rows in Company with that matching passwordId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved company", false, false);
				ret.data.companyId = res.rows[0].companyid;
				ret.data.companyName = res.rows[0].companyname;
				ret.data.companyWebsite = res.rows[0].companywebsite;
				ret.data.passwordId = res.rows[0].passwordid;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	

	/**
	*	Retrieves all companies
	*	@return [ { companyId, companyName, companyWebsite, passwordId } ]
	*/
	async getAllCompanies()
	{
		var query = 'SELECT * FROM Company';
		
		var ret = null;
		var arr = [];
		
		
		let res;
		try
		{
			res = await this.client.query(query, arr);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Company");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved all companies", false, true);
				
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.companyId = res.rows[i].companyid;
					obj.companyName = res.rows[i].companyname;
					obj.companyWebsite = res.rows[i].companywebsite;
					obj.passwordId = res.rows[i].passwordid;
					
					ret.data.push(obj);
				}
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
	}

	
	
    //CR

    /**
    * Update the details of the company based on the input parameters
    * @param companyId The ID of the company 
    * @param name The name of the ompany
    * @param website The website of the company
    * @param passwordId The password ID of the company
    */
	async updateCompany(companyId, name, website, passwordId) {

		if (!this.validateNumeric(companyId)) {
			return this.buildDefaultResponseObject(false, "Invalid company ID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["companyName", "companyWebsite", "passwordId"], [name, website, passwordId], paramNames, paramValues);

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}




		var query = this.constructUpdate("Company", paramNames, "companyId", companyId);
		var ret = null;
		
		
		
		/*
		this.client.query(query, paramValues, (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully updated company", true);
				//ret.data.buildingId = res.rows[0].buildingid;
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated company", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		

	}

	/**
     * Deletes a company given a company ID
     * @param companyId The ID of the company
     */
	async deleteCompany(companyId) {
		if (!this.validateNumeric(companyId)) {
			return this.buildDefaultResponseObject(false, "Invalid company ID provided", true);
		}

		var query = this.constructDelete("Company", "companyId");
		var ret = null;
		
		
		/*this.client.query(query, [companyId], (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully deleted company", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, [companyId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted company", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}


    //UD
	
	
	
	//Building
	
	/**
	*	Creates a new building
	*	@param latitude 
	*	@param longitude 
	*	@param branchName 
	*	@param companyId 
	*	@param wifiParamsId 
	*
	*	@return { buildingId }
	*/
	async createBuilding(latitude,longitude,branchName,companyId,wifiParamsId)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({latitude})[0], latitude, c, v);
		this.bigAppend(Object.keys({longitude})[0], longitude, c, v);
		this.bigAppend(Object.keys({branchName})[0], branchName, c, v);
		this.bigAppend(Object.keys({companyId})[0], companyId, c, v);
		this.bigAppend(Object.keys({wifiParamsId})[0], wifiParamsId, c, v);
					
		var ret = null;
		/*
		this.client.query(this.constructInsert("Building", "buildingId", c, v),
		v, (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully added building", false, false);
			ret.data.buildingId = res.rows[0].buildingid;
				//this.client.end();
				callback(ret);
			}
		});		*/
		
		let res;
		try
		{
			res = await this.client.query(this.constructInsert("Building", "buildingId", c, v),v);
			ret = this.buildDefaultResponseObject(true, "Successfully added building", false, false);
			ret.data.buildingId = res.rows[0].buildingid;
			return ret;
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}	
		
	}
	
	/**
	*	Retrieves a building using buildingId
	*	@param buildingId 
	*
	*	@return { buildingId, latitude, longitude, branchName, companyId, wifiParamsId }
	*/
	async getBuildingByBuildingId(buildingId)
	{
		var query = 'SELECT * FROM Building WHERE buildingId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [buildingId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Building with that matching buildingId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved building", false, false);
				ret.data.buildingId = res.rows[0].buildingid;
				ret.data.latitude = res.rows[0].latitude;
				ret.data.longitude = res.rows[0].longitude;
				ret.data.branchName = res.rows[0].branchname;
				ret.data.companyId = res.rows[0].companyid;
				ret.data.wifiParamsId = res.rows[0].wifiparamsid;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [buildingId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Building with that matching buildingId");
				ret = this.returnDatabaseError("no rows in Building with that matching buildingId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved building", false, false);
				ret.data.buildingId = res.rows[0].buildingid;
				ret.data.latitude = res.rows[0].latitude;
				ret.data.longitude = res.rows[0].longitude;
				ret.data.branchName = res.rows[0].branchname;
				ret.data.companyId = res.rows[0].companyid;
				ret.data.wifiParamsId = res.rows[0].wifiparamsid;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
	/**
	*	Retrieves a set of buildings using companyId
	*	@param companyId 
	*
	*	@return [ { buildingId, latitude, longitude, branchName, companyId, wifiParamsId } ]
	*/
	async getBuildingsByCompanyId(companyId)
	{
		var query = 'SELECT * FROM Building WHERE companyId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [companyId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Building with that matching companyId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved buildings", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.buildingId = res.rows[i].buildingid;
					obj.latitude = res.rows[i].latitude;
					obj.longitude = res.rows[i].longitude;
					obj.branchName = res.rows[i].branchname;
					obj.companyId = res.rows[i].companyid;
					obj.wifiParamsId = res.rows[i].wifiparamsid;
					
					ret.data.push(obj);
				}
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [companyId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Building with that matching companyId");
				ret = this.returnDatabaseError("no rows in Building with that matching companyId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved buildings", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.buildingId = res.rows[i].buildingid;
					obj.latitude = res.rows[i].latitude;
					obj.longitude = res.rows[i].longitude;
					obj.branchName = res.rows[i].branchname;
					obj.companyId = res.rows[i].companyid;
					obj.wifiParamsId = res.rows[i].wifiparamsid;
					
					ret.data.push(obj);
				}
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
		/**
	*	Retrieves a set of buildings using wifiParamsId
	*	@param wifiParamsId 
	*
	*	@return [ { buildingId, latitude, longitude, branchName, companyId, wifiParamsId } ]
	*/
	async getBuildingsByWifiParamsId(wifiParamsId)
	{
		var query = 'SELECT * FROM Building WHERE wifiParamsId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [wifiParamsId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Building with that matching wifiParamsId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved buildings", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.buildingId = res.rows[i].buildingid;
					obj.latitude = res.rows[i].latitude;
					obj.longitude = res.rows[i].longitude;
					obj.branchName = res.rows[i].branchname;
					obj.companyId = res.rows[i].companyid;
					obj.wifiParamsId = res.rows[i].wifiparamsid;
					
					ret.data.push(obj);
				}
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [wifiParamsId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Building with that matching wifiParamsId");
				ret = this.returnDatabaseError("no rows in Building with that matching wifiParamsId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved buildings", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.buildingId = res.rows[i].buildingid;
					obj.latitude = res.rows[i].latitude;
					obj.longitude = res.rows[i].longitude;
					obj.branchName = res.rows[i].branchname;
					obj.companyId = res.rows[i].companyid;
					obj.wifiParamsId = res.rows[i].wifiparamsid;
					
					ret.data.push(obj);
				}
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
	
    //CR
     
	async updateBuilding(buildingId, latitude, longitude, branchName, companyId, wifiParamsId) {

		if (!this.validateNumeric(buildingId)) {
			return this.buildDefaultResponseObject(false, "Invalid building ID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["latitude", "longitude", "branchName", "companyId", "wifiParamsId"], [latitude, longitude, branchName, companyId, wifiParamsId], paramNames, paramValues);

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}

		var query = this.constructUpdate("Building", paramNames, "buildingId", buildingId);
		var ret = null;
		
		
		/*this.client.query(query, paramValues, (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully updated building", true);
				//ret.data.buildingId = res.rows[0].buildingid;
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated building", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		
	}

	async deleteBuilding(buildingId) {
		if (!this.validateNumeric(buildingId)) {
			return this.buildDefaultResponseObject(false, "Invalid building ID provided", true);
		}

		var query = this.constructDelete("Building", "buildingId");
		var ret = null;
		
		
		/*this.client.query(query, [buildingId], (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully deleted building", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, [buildingId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted building", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

    //UD
	
	
	
	//Password
	
	/**
	*	Creates a new password
	*	@param username 
	*	@param hash 
	*	@param salt 
	*	@param apiKey 
	*	@param expirationDate 
	*
	*	@return { passwordId }
	*/
	async createPassword(username,hash,salt,apiKey,expirationDate)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({username})[0], username, c, v);
		this.bigAppend(Object.keys({hash})[0], hash, c, v);
		this.bigAppend(Object.keys({salt})[0], salt, c, v);
		this.bigAppend(Object.keys({apiKey})[0], apiKey, c, v);
		this.bigAppend(Object.keys({expirationDate})[0], expirationDate, c, v);
					
		var ret = null;
		
		/*
		this.client.query(this.constructInsert("Password", "passwordId", c, v),
		v, (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully added password", false, false);
			ret.data.passwordId = res.rows[0].passwordid;
				//this.client.end();
				callback(ret);
			}
		});		*/
		
		let res;
		try
		{
			res = await this.client.query(this.constructInsert("Password", "passwordId", c, v),v);
			ret = this.buildDefaultResponseObject(true, "Successfully added password", false, false);
			ret.data.passwordId = res.rows[0].passwordid;
			return ret;
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}	
		
	}
	
	/**
	*	Retrieves a password using passwordId
	*	@param passwordId 
	*
	*	@return { passwordId, username, hash, salt, apiKey, expirationDate }
	*/
	async getPasswordByPasswordId(passwordId)
	{
		var query = 'SELECT * FROM Password WHERE passwordId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [passwordId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Password with that matching passwordId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved password", false, false);
				ret.data.passwordId = res.rows[0].passwordid;
				ret.data.username = res.rows[0].username;
				ret.data.hash = res.rows[0].hash;
				ret.data.salt = res.rows[0].salt;
				ret.data.apiKey = res.rows[0].apikey;
				ret.data.expirationDate = res.rows[0].expirationdate;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*
		this.client.query(query, [passwordId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Password with that matching passwordId");
				ret = this.returnDatabaseError("no rows in Password with that matching passwordId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved password", false, false);
				ret.data.passwordId = res.rows[0].passwordid;
				ret.data.username = res.rows[0].username;
				ret.data.hash = res.rows[0].hash;
				ret.data.salt = res.rows[0].salt;
				ret.data.apiKey = res.rows[0].apikey;
				ret.data.expirationDate = res.rows[0].expirationdate;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}

	/**
	*	Retrieves a password using username
	*	@param username 
	*
	*	@return { passwordId, username, hash, salt, apiKey, expirationDate }
	*/
	async getPasswordByUsername(username)
	{
		var query = 'SELECT * FROM Password WHERE username = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [username]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Password with that matching username");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved password", false, false);
				ret.data.passwordId = res.rows[0].passwordid;
				ret.data.username = res.rows[0].username;
				ret.data.hash = res.rows[0].hash;
				ret.data.salt = res.rows[0].salt;
				ret.data.apiKey = res.rows[0].apikey;
				ret.data.expirationDate = res.rows[0].expirationdate;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [username], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Password with that matching username");
				ret = this.returnDatabaseError("no rows in Password with that matching username");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved password", false, false);
				ret.data.passwordId = res.rows[0].passwordid;
				ret.data.username = res.rows[0].username;
				ret.data.hash = res.rows[0].hash;
				ret.data.salt = res.rows[0].salt;
				ret.data.apiKey = res.rows[0].apikey;
				ret.data.expirationDate = res.rows[0].expirationdate;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}

	/**
	*	Retrieves a password using apiKey
	*	@param apiKey 
	*
	*	@return { passwordId, username, hash, salt, apiKey, expirationDate }
	*/
	async getPasswordByApiKey(apiKey)
	{
		var query = 'SELECT * FROM Password WHERE apiKey = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [apiKey]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Password with that matching apiKey");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved password", false, false);
				ret.data.passwordId = res.rows[0].passwordid;
				ret.data.username = res.rows[0].username;
				ret.data.hash = res.rows[0].hash;
				ret.data.salt = res.rows[0].salt;
				ret.data.apiKey = res.rows[0].apikey;
				ret.data.expirationDate = res.rows[0].expirationdate;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [apiKey], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Password with that matching apiKey");
				ret = this.returnDatabaseError("no rows in Password with that matching apiKey");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved password", false, false);
				ret.data.passwordId = res.rows[0].passwordid;
				ret.data.username = res.rows[0].username;
				ret.data.hash = res.rows[0].hash;
				ret.data.salt = res.rows[0].salt;
				ret.data.apiKey = res.rows[0].apikey;
				ret.data.expirationDate = res.rows[0].expirationdate;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
    //CR
    
	async updatePassword(passwordId, username, hash, salt, apiKey, expirationDate) {

		if (!this.validateNumeric(passwordId)) {
			return this.buildDefaultResponseObject(false, "Invalid password ID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["username", "hash", "salt", "apiKey", "expirationDate"], [username, hash, salt, apiKey, expirationDate], paramNames, paramValues);

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}

		var query = this.constructUpdate("Password", paramNames, "passwordId", passwordId);
		var ret = null;
		
		
		/*this.client.query(query, paramValues, (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				// this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully updated password", true);
				// this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated password", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
     * Deletes the password associated with the given ID
     * @param passwordId The ID of the password
     */
	async deletePassword(passwordId) {
		if (!this.validateNumeric(passwordId)) {
			return this.buildDefaultResponseObject(false, "Invalid password ID provided", true);
		}

		var query = this.constructDelete("Password", "passwordId");
		var ret = null;
		
		
		/*this.client.query(query, [passwordId], (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully deleted password", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, [passwordId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted password", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

    //UD
	
	
	
	//Room
	
	/**
	*	Creates a new room
	*	@param roomName 
	*	@param parentRoomList 
	*	@param buildingId 
	*
	*	@return { roomId }
	*/
	async createRoom(roomName,parentRoomList,buildingId)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({roomName})[0], roomName, c, v);
		this.bigAppend(Object.keys({parentRoomList})[0], parentRoomList, c, v);
		this.bigAppend(Object.keys({buildingId})[0], buildingId, c, v);
					
		var ret = null;
		
		/*
		this.client.query(this.constructInsert("Room", "roomId", c, v),
		v, (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully added room", false, false);
			ret.data.roomId = res.rows[0].roomid;
				//this.client.end();
				callback(ret);
			}
		});	*/
		
		let res;
		try
		{
			res = await this.client.query(this.constructInsert("Room", "roomId", c, v),v);
			ret = this.buildDefaultResponseObject(true, "Successfully added room", false, false);
			ret.data.roomId = res.rows[0].roomid;
			return ret;
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}			
		
	}
	
	/**
	*	Retrieves a room using roomId
	*	@param roomId 
	*
	*	@return { roomId, roomName, parentRoomList, buildingId }
	*/
	async getRoomByRoomId(roomId)
	{
		var query = 'SELECT * FROM Room WHERE roomId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [roomId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Room with that matching roomId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved room", false, false);
				ret.data.roomId = res.rows[0].roomid;
				ret.data.roomName = res.rows[0].roomname;
				ret.data.parentRoomList = res.rows[0].parentroomlist;
				ret.data.buildingId = res.rows[0].buildingid;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [roomId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Room with that matching roomId");
				ret = this.returnDatabaseError("no rows in Room with that matching roomId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved room", false, false);
				ret.data.roomId = res.rows[0].roomid;
				ret.data.roomName = res.rows[0].roomname;
				ret.data.parentRoomList = res.rows[0].parentroomlist;
				ret.data.buildingId = res.rows[0].buildingid;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
	/**
	*	Retrieves a set of rooms using buildingId
	*	@param buildingId 
	*
	*	@return [ { roomId, roomName, parentRoomList, buildingId } ]
	*/
	async getRoomsByBuildingId(buildingId)
	{
		var query = 'SELECT * FROM Room WHERE buildingId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [buildingId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Room with that matching buildingId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved rooms", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.roomId = res.rows[i].roomid;
					obj.roomName = res.rows[i].roomname;
					obj.parentRoomList = res.rows[i].parentroomlist;
					obj.buildingId = res.rows[i].buildingid;
					
					ret.data.push(obj);
				}
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [buildingId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Room with that matching buildingId");
				ret = this.returnDatabaseError("no rows in Room with that matching buildingId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved rooms", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.roomId = res.rows[i].roomid;
					obj.roomName = res.rows[i].roomname;
					obj.parentRoomList = res.rows[i].parentroomlist;
					obj.buildingId = res.rows[i].buildingid;
					
					ret.data.push(obj);
				}
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
    //CR
    
	async updateRoom(roomId, roomName, parentRoomList, buildingId) {
		if (!this.validateNumeric(roomId)) {
			return this.buildDefaultResponseObject(false, "Invalid room ID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["roomName", "parentRoomList", "buildingId"], [roomName, parentRoomList, buildingId], paramNames, paramValues);

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}

		var query = this.constructUpdate("Room", paramNames, "roomId", roomId);
		var ret = null;
		
		
		/*this.client.query(query, paramValues, (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully updated Room", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated Room", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	async deleteRoom(roomId) {
		if (!this.validateNumeric(roomId)) {
			return this.buildDefaultResponseObject(false, "Invalid room ID provided", true);
		}

		var query = this.constructDelete("Room", "roomId");
		var ret = null;
		
		
		/*this.client.query(query, [roomId], (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully deleted room", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, [roomId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted room", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}
    //UD
	
	
	
	//NFCAccessPoints
	
	/**
	*	Creates a new nfcaccesspoints
	*	@param roomId 
	*
	*	@return { nfcReaderId }
	*/
	async createNFCAccessPoints(roomId)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({roomId})[0], roomId, c, v);
					
		var ret = null;
		
		/*
		this.client.query(this.constructInsert("NFCAccessPoints", "nfcReaderId", c, v),
		v, (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully added nfcaccesspoints", false, false);
			ret.data.nfcReaderId = res.rows[0].nfcreaderid;
				//this.client.end();
				callback(ret);
			}
		});		*/
		
		let res;
		try
		{
			res = await this.client.query(this.constructInsert("NFCAccessPoints", "nfcReaderId", c, v),v);
			ret = this.buildDefaultResponseObject(true, "Successfully added nfcaccesspoints", false, false);
			ret.data.nfcReaderId = res.rows[0].nfcreaderid;
			return ret;
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}	
		
	}
	
	/**
	*	Retrieves a nfcaccesspoints using nfcReaderId
	*	@param nfcReaderId 
	*
	*	@return { nfcReaderId, roomId }
	*/
	async getNFCAccessPointsByNfcReaderId(nfcReaderId)
	{
		var query = 'SELECT * FROM NFCAccessPoints WHERE nfcReaderId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [nfcReaderId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in NFCAccessPoints with that matching nfcReaderId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved nfcaccesspoints", false, false);
				ret.data.nfcReaderId = res.rows[0].nfcreaderid;
				ret.data.roomId = res.rows[0].roomid;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [nfcReaderId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in NFCAccessPoints with that matching nfcReaderId");
				ret = this.returnDatabaseError("no rows in NFCAccessPoints with that matching nfcReaderId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved nfcaccesspoints", false, false);
				ret.data.nfcReaderId = res.rows[0].nfcreaderid;
				ret.data.roomId = res.rows[0].roomid;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
	/**
	*	Retrieves a set of nfcaccesspointss using roomId
	*	@param roomId 
	*
	*	@return [ { nfcReaderId, roomId } ]
	*/
	async getNFCAccessPointssByRoomId(roomId)
	{
		var query = 'SELECT * FROM NFCAccessPoints WHERE roomId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [roomId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in NFCAccessPoints with that matching roomId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved nfcaccesspointss", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.nfcReaderId = res.rows[i].nfcreaderid;
					obj.roomId = res.rows[i].roomid;
					
					ret.data.push(obj);
				}
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [roomId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in NFCAccessPoints with that matching roomId");
				ret = this.returnDatabaseError("no rows in NFCAccessPoints with that matching roomId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved nfcaccesspointss", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.nfcReaderId = res.rows[i].nfcreaderid;
					obj.roomId = res.rows[i].roomid;
					
					ret.data.push(obj);
				}
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
	
    //CR
    
	async updateAccessPoints(nfcReaderId, roomId) {
		if (!this.validateNumeric(nfcReaderId)) {
			return this.buildDefaultResponseObject(false, "Invalid NFC reader ID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["roomId"], [roomId], paramNames, paramValues);

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}

		var query = this.constructUpdate("NFCAccessPoints", paramNames, "nfcReaderId", nfcReaderId);
		var ret = null;
		
		
		/*this.client.query(query, paramValues, (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully updated NFC access point", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated NFC access point", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	async deleteAccessPoints(nfcReaderId) {
		if (!this.validateNumeric(nfcReaderId)) {
			return this.buildDefaultResponseObject(false, "Invalid NFC Reader ID provided", true);
		}

		var query = this.constructDelete("NFCAccessPoints", "nfcReaderId");
		var ret = null;
		
		
		/*this.client.query(query, [nfcReaderId], (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully deleted Access Point", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, [nfcReaderId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted Access Point", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

    //UD
	
	
	
	//Employee
	
	/**
	*	Creates a new employee
	*	@param firstName 
	*	@param surname 
	*	@param title 
	*	@param cellphone 
	*	@param email 
	*	@param companyId 
	*	@param buildingId 
	*	@param passwordId 
	*
	*	@return { employeeId }
	*/
	async createEmployee(firstName,surname,title,cellphone,email,companyId,buildingId,passwordId)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({firstName})[0], firstName, c, v);
		this.bigAppend(Object.keys({surname})[0], surname, c, v);
		this.bigAppend(Object.keys({title})[0], title, c, v);
		this.bigAppend(Object.keys({cellphone})[0], cellphone, c, v);
		this.bigAppend(Object.keys({email})[0], email, c, v);
		this.bigAppend(Object.keys({companyId})[0], companyId, c, v);
		this.bigAppend(Object.keys({buildingId})[0], buildingId, c, v);
		this.bigAppend(Object.keys({passwordId})[0], passwordId, c, v);
					
		var ret = null;
		
		/*
		this.client.query(this.constructInsert("Employee", "employeeId", c, v),
		v, (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully added employee", false, false);
			ret.data.employeeId = res.rows[0].employeeid;
				//this.client.end();
				callback(ret);
			}
		});		*/
		
		let res;
		try
		{
			res = await this.client.query(this.constructInsert("Employee", "employeeId", c, v),v);
			ret = this.buildDefaultResponseObject(true, "Successfully added employee", false, false);
			ret.data.employeeId = res.rows[0].employeeid;
			return ret;
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}	
		
	}
	
	/**
	*	Retrieves a employee using employeeId
	*	@param employeeId 
	*
	*	@return { employeeId, firstName, surname, title, cellphone, email, companyId, buildingId, passwordId }
	*/
	async getEmployeeByEmployeeId(employeeId)
	{
		var query = 'SELECT * FROM Employee WHERE employeeId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [employeeId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Employee with that matching employeeId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved employee", false, false);
				ret.data.employeeId = res.rows[0].employeeid;
				ret.data.firstName = res.rows[0].firstname;
				ret.data.surname = res.rows[0].surname;
				ret.data.title = res.rows[0].title;
				ret.data.cellphone = res.rows[0].cellphone;
				ret.data.email = res.rows[0].email;
				ret.data.companyId = res.rows[0].companyid;
				ret.data.buildingId = res.rows[0].buildingid;
				ret.data.passwordId = res.rows[0].passwordid;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [employeeId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Employee with that matching employeeId");
				ret = this.returnDatabaseError("no rows in Employee with that matching employeeId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved employee", false, false);
				ret.data.employeeId = res.rows[0].employeeid;
				ret.data.firstName = res.rows[0].firstname;
				ret.data.surname = res.rows[0].surname;
				ret.data.title = res.rows[0].title;
				ret.data.cellphone = res.rows[0].cellphone;
				ret.data.email = res.rows[0].email;
				ret.data.companyId = res.rows[0].companyid;
				ret.data.buildingId = res.rows[0].buildingid;
				ret.data.passwordId = res.rows[0].passwordid;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}

	/**
	*	Retrieves a employee using passwordId
	*	@param passwordId 
	*
	*	@return { employeeId, firstName, surname, title, cellphone, email, companyId, buildingId, passwordId }
	*/
	async getEmployeeByPasswordId(passwordId)
	{
		var query = 'SELECT * FROM Employee WHERE passwordId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [passwordId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Employee with that matching passwordId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved employee", false, false);
				ret.data.employeeId = res.rows[0].employeeid;
				ret.data.firstName = res.rows[0].firstname;
				ret.data.surname = res.rows[0].surname;
				ret.data.title = res.rows[0].title;
				ret.data.cellphone = res.rows[0].cellphone;
				ret.data.email = res.rows[0].email;
				ret.data.companyId = res.rows[0].companyid;
				ret.data.buildingId = res.rows[0].buildingid;
				ret.data.passwordId = res.rows[0].passwordid;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [passwordId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Employee with that matching passwordId");
				ret = this.returnDatabaseError("no rows in Employee with that matching passwordId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved employee", false, false);
				ret.data.employeeId = res.rows[0].employeeid;
				ret.data.firstName = res.rows[0].firstname;
				ret.data.surname = res.rows[0].surname;
				ret.data.title = res.rows[0].title;
				ret.data.cellphone = res.rows[0].cellphone;
				ret.data.email = res.rows[0].email;
				ret.data.companyId = res.rows[0].companyid;
				ret.data.buildingId = res.rows[0].buildingid;
				ret.data.passwordId = res.rows[0].passwordid;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
	/**
	*	Retrieves a set of employees using companyId
	*	@param companyId 
	*
	*	@return [ { employeeId, firstName, surname, title, cellphone, email, companyId, buildingId, passwordId } ]
	*/
	async getEmployeesByCompanyId(companyId)
	{
		var query = 'SELECT * FROM Employee WHERE companyId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [companyId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Employee with that matching companyId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved employees", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.employeeId = res.rows[i].employeeid;
					obj.firstName = res.rows[i].firstname;
					obj.surname = res.rows[i].surname;
					obj.title = res.rows[i].title;
					obj.cellphone = res.rows[i].cellphone;
					obj.email = res.rows[i].email;
					obj.companyId = res.rows[i].companyid;
					obj.buildingId = res.rows[i].buildingid;
					obj.passwordId = res.rows[i].passwordid;
					
					ret.data.push(obj);
				}
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [companyId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Employee with that matching companyId");
				ret = this.returnDatabaseError("no rows in Employee with that matching companyId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved employees", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.employeeId = res.rows[i].employeeid;
					obj.firstName = res.rows[i].firstname;
					obj.surname = res.rows[i].surname;
					obj.title = res.rows[i].title;
					obj.cellphone = res.rows[i].cellphone;
					obj.email = res.rows[i].email;
					obj.companyId = res.rows[i].companyid;
					obj.buildingId = res.rows[i].buildingid;
					obj.passwordId = res.rows[i].passwordid;
					
					ret.data.push(obj);
				}
				//this.client.end();
				callback(ret);
			}
		});	*/
	}

	/**
	*	Retrieves a set of employees using buildingId
	*	@param buildingId 
	*
	*	@return [ { employeeId, firstName, surname, title, cellphone, email, companyId, buildingId, passwordId } ]
	*/
	async getEmployeesByBuildingId(buildingId)
	{
		var query = 'SELECT * FROM Employee WHERE buildingId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [buildingId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Employee with that matching buildingId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved employees", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.employeeId = res.rows[i].employeeid;
					obj.firstName = res.rows[i].firstname;
					obj.surname = res.rows[i].surname;
					obj.title = res.rows[i].title;
					obj.cellphone = res.rows[i].cellphone;
					obj.email = res.rows[i].email;
					obj.companyId = res.rows[i].companyid;
					obj.buildingId = res.rows[i].buildingid;
					obj.passwordId = res.rows[i].passwordid;
					
					ret.data.push(obj);
				}
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [buildingId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Employee with that matching buildingId");
				ret = this.returnDatabaseError("no rows in Employee with that matching buildingId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved employees", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.employeeId = res.rows[i].employeeid;
					obj.firstName = res.rows[i].firstname;
					obj.surname = res.rows[i].surname;
					obj.title = res.rows[i].title;
					obj.cellphone = res.rows[i].cellphone;
					obj.email = res.rows[i].email;
					obj.companyId = res.rows[i].companyid;
					obj.buildingId = res.rows[i].buildingid;
					obj.passwordId = res.rows[i].passwordid;
					
					ret.data.push(obj);
				}
				//this.client.end();
				callback(ret);
			}
		});	*/
	}

    //CR
    
    //UD
	/**
		* Updates the details of an Employee in the database
		* @param employeeId The ID of the employee
		* @param firstName The first name of the employee
		* @param surname The surname of the employee
		* @param title The title of the employee e.g. Mrs
		* @param cellphone The cellphone number of the employee as a string
		* @param email The email of the employee
		* @param companyId The company ID of the employee
		* @param buildingId The building ID of the employee
		* @param passwordId The password ID of the employee
		*/

	async updateEmployee(employeeId, firstName, surname, title, cellphone, email, companyId, buildingId, passwordId) {
		if (!this.validateNumeric(employeeId)) {
			return this.buildDefaultResponseObject(false, "Invalid employee ID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["firstName", "surname", "title", "cellphone", "email", "companyId", "buildingId", "passwordId"], [firstName, surname, title, cellphone, email, companyId, buildingId, passwordId], paramNames, paramValues);

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}

		var query = this.constructUpdate("Employee", paramNames, "employeeId", employeeId);
		var ret = null;
		
		
		/*this.client.query(query, paramValues, (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				console.log(res);
				ret = this.buildDefaultResponseObject(true, "Successfully updated employee", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, paramValues);
				ret = this.buildDefaultResponseObject(true, "Successfully updated employee", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}


	async deleteEmployee(employeeId) {
		if (!this.validateNumeric(employeeId)) {
			return this.buildDefaultResponseObject(false, "Invalid employee ID provided", true);
		}

		var query = this.constructDelete("Employee", "employeeId");
		var ret = null;
		
		
		/*this.client.query(query, [employeeId], (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully deleted employee", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, [employeeId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted employee", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

    //UD
	
	
	
	//Client
	
	/**
	*	Creates a new client
	*	@param macAddress 
	*
	*	@return { clientId }
	*/
	async createClient(macAddress)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({macAddress})[0], macAddress, c, v);
					
		var ret = null;
		
		/*
		this.client.query(this.constructInsert("Client", "clientId", c, v),
		v, (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully added client", false, false);
			ret.data.clientId = res.rows[0].clientid;
				//this.client.end();
				callback(ret);
			}
		});		*/
		
		let res;
		try
		{
			res = await this.client.query(this.constructInsert("Client", "clientId", c, v),v);
			ret = this.buildDefaultResponseObject(true, "Successfully added client", false, false);
			ret.data.clientId = res.rows[0].clientid;
			return ret;
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}	
		
	}
	
	/**
	*	Retrieves a client using clientId
	*	@param clientId 
	*
	*	@return { clientId, macAddress }
	*/
	async getClientByClientId(clientId)
	{
		var query = 'SELECT * FROM Client WHERE clientId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [clientId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Client with that matching clientId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved client", false, false);
				ret.data.clientId = res.rows[0].clientid;
				ret.data.macAddress = res.rows[0].macaddress;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [clientId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Client with that matching clientId");
				ret = this.returnDatabaseError("no rows in Client with that matching clientId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved client", false, false);
				ret.data.clientId = res.rows[0].clientid;
				ret.data.macAddress = res.rows[0].macaddress;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}

	/**
	*	Retrieves a client using macAddress
	*	@param macAddress 
	*
	*	@return { clientId, macAddress }
	*/
	async getClientByMacAddress(macAddress)
	{
		var query = 'SELECT * FROM Client WHERE macAddress = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [macAddress]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Client with that matching macAddress");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved client", false, false);
				ret.data.clientId = res.rows[0].clientid;
				ret.data.macAddress = res.rows[0].macaddress;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [macAddress], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Client with that matching macAddress");
				ret = this.returnDatabaseError("no rows in Client with that matching macAddress");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved client", false, false);
				ret.data.clientId = res.rows[0].clientid;
				ret.data.macAddress = res.rows[0].macaddress;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
    //CR
    

	async updateClient(clientId, macAddress) {
		if (!this.validateNumeric(clientId)) {
			return this.buildDefaultResponseObject(false, "Invalid client ID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["macAddress"], [macAddress], paramNames, paramValues);

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}

		var query = this.constructUpdate("Client", paramNames, "clientId", clientId);
		var ret = null;
		
		
		/*this.client.query(query, paramValues, (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully updated client", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated client", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	async deleteClient(clientId) {
		if (!this.validateNumeric(clientId)) {
			return this.buildDefaultResponseObject(false, "Invalid client ID provided", true);
		}

		var query = this.constructDelete("Client", "clientId");
		var ret = null;
		
		
		/*this.client.query(query, [clientId], (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully deleted client", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, [clientId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted client", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

    //UD
	
	
	//WiFiParams
	
	/**
	*	Creates a new wifiparams
	*	@param ssid 
	*	@param networkType 
	*	@param password 
	*
	*	@return { wifiParamsId }
	*/
	async createWiFiParams(ssid,networkType,password)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({ssid})[0], ssid, c, v);
		this.bigAppend(Object.keys({networkType})[0], networkType, c, v);
		this.bigAppend(Object.keys({password})[0], password, c, v);
					
		var ret = null;
		
		/*
		this.client.query(this.constructInsert("WiFiParams", "wifiParamsId", c, v),
		v, (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully added wifiparams", false, false);
			ret.data.wifiParamsId = res.rows[0].wifiparamsid;
				//this.client.end();
				callback(ret);
			}
		});		*/
		
		let res;
		try
		{
			res = await this.client.query(this.constructInsert("WiFiParams", "wifiParamsId", c, v),v);
			ret = this.buildDefaultResponseObject(true, "Successfully added wifiparams", false, false);
			ret.data.wifiParamsId = res.rows[0].wifiparamsid;
			return ret;
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}	
		
	}
	
	/**
	*	Retrieves a wifiparams using wifiParamsId
	*	@param wifiParamsId 
	*
	*	@return { wifiParamsId, ssid, networkType, password }
	*/
	async getWiFiParamsByWifiParamsId(wifiParamsId)
	{
		var query = 'SELECT * FROM WiFiParams WHERE wifiParamsId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [wifiParamsId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in WiFiParams with that matching wifiParamsId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved wifiparams", false, false);
				ret.data.wifiParamsId = res.rows[0].wifiparamsid;
				ret.data.ssid = res.rows[0].ssid;
				ret.data.networkType = res.rows[0].networktype;
				ret.data.password = res.rows[0].password;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [wifiParamsId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in WiFiParams with that matching wifiParamsId");
				ret = this.returnDatabaseError("no rows in WiFiParams with that matching wifiParamsId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved wifiparams", false, false);
				ret.data.wifiParamsId = res.rows[0].wifiparamsid;
				ret.data.ssid = res.rows[0].ssid;
				ret.data.networkType = res.rows[0].networktype;
				ret.data.password = res.rows[0].password;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
    //CR
    

	async updateWiFiParams(wifiParamsId, ssid, networkType, password) {
		if (!this.validateNumeric(wifiParamsId)) {
			return this.buildDefaultResponseObject(false, "Invalid WiFi Params ID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["ssid", "networkType", "password"], [ssid, networkType, password], paramNames, paramValues);

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}

		var query = this.constructUpdate("WiFiParams", paramNames, "wifiParamsId", wifiParamsId);
		var ret = null;
		
		
		/*this.client.query(query, paramValues, (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully updated WiFi params", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated WiFi params", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	async deleteWiFiParams(wifiParamsId) {
		if (!this.validateNumeric(wifiParamsId)) {
			return this.buildDefaultResponseObject(false, "Invalid WiFi Params ID provided", true);
		}

		var query = this.constructDelete("WiFiParams", "wifiParamsId");
		var ret = null;
		
		
		/*this.client.query(query, [wifiParamsId], (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully deleted WiFi Params", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, [wifiParamsId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted WiFi Params", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}
    //UD
	
	
	//TempWifiAccess
	
	/**
	*	Creates a new tempwifiaccess
	*	@param wifiParamsId 
	*
	*	@return { tempWifiAccessId }
	*/
	async createTempWifiAccess(wifiParamsId)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({wifiParamsId})[0], wifiParamsId, c, v);
					
		var ret = null;
		
		/*
		this.client.query(this.constructInsert("TempWifiAccess", "tempWifiAccessId", c, v),
		v, (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully added tempwifiaccess", false, false);
			ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
				//this.client.end();
				callback(ret);
			}
		});		*/
		
		let res;
		try
		{
			res = await this.client.query(this.constructInsert("TempWifiAccess", "tempWifiAccessId", c, v),v);
			ret = this.buildDefaultResponseObject(true, "Successfully added tempwifiaccess", false, false);
			ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
			return ret;
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}	
		
	}
	
	/**
	*	Retrieves a tempwifiaccess using tempWifiAccessId
	*	@param tempWifiAccessId 
	*
	*	@return { tempWifiAccessId, wifiParamsId }
	*/
	async getTempWifiAccessByTempWifiAccessId(tempWifiAccessId)
	{
		var query = 'SELECT * FROM TempWifiAccess WHERE tempWifiAccessId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [tempWifiAccessId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in TempWifiAccess with that matching tempWifiAccessId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tempwifiaccess", false, false);
				ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
				ret.data.wifiParamsId = res.rows[0].wifiparamsid;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [tempWifiAccessId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in TempWifiAccess with that matching tempWifiAccessId");
				ret = this.returnDatabaseError("no rows in TempWifiAccess with that matching tempWifiAccessId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tempwifiaccess", false, false);
				ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
				ret.data.wifiParamsId = res.rows[0].wifiparamsid;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
	/**
	*	Retrieves a set of tempwifiaccesss using wifiParamsId
	*	@param wifiParamsId 
	*
	*	@return [ { tempWifiAccessId, wifiParamsId } ]
	*/
	async getTempWifiAccesssByWifiParamsId(wifiParamsId)
	{
		var query = 'SELECT * FROM TempWifiAccess WHERE wifiParamsId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [wifiParamsId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in TempWifiAccess with that matching wifiParamsId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tempwifiaccesss", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.tempWifiAccessId = res.rows[i].tempwifiaccessid;
					obj.wifiParamsId = res.rows[i].wifiparamsid;
					
					ret.data.push(obj);
				}
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [wifiParamsId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in TempWifiAccess with that matching wifiParamsId");
				ret = this.returnDatabaseError("no rows in TempWifiAccess with that matching wifiParamsId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tempwifiaccesss", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.tempWifiAccessId = res.rows[i].tempwifiaccessid;
					obj.wifiParamsId = res.rows[i].wifiparamsid;
					
					ret.data.push(obj);
				}
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
	
    //CR
    

	async updateTempWifiAccess(tempWifiAccessId, wifiParamsId) {
		if (!this.validateNumeric(tempWifiAccessId)) {
			return this.buildDefaultResponseObject(false, "Invalid Temp Wifi Access ID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["wifiParamsId"], [wifiParamsId], paramNames, paramValues);

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}

		var query = this.constructUpdate("TempWifiAccess", paramNames, "tempWifiAccessId", tempWifiAccessId);
		var ret = null;
		
		
		/*this.client.query(query, paramValues, (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully updated Temp WiFi Access params", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated Temp WiFi Access params", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	async deleteTempWifiAccess(tempWifiAccessId) {
		if (!this.validateNumeric(tempWifiAccessId)) {
			return this.buildDefaultResponseObject(false, "Invalid Temp Wifi Access ID provided", true);
		}

		var query = this.constructDelete("TempWifiAccess", "tempWifiAccessId");
		var ret = null;
		
		
		/*this.client.query(query, [tempWifiAccessId], (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully deleted Temp Wifi Access", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, [tempWifiAccessId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted Temp Wifi Access", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}


    //UD
	
	
	//VisitorPackage
	
	/**
	*	Creates a new visitorpackage
	*	@param tempWifiAccessId 
	*	@param tpaId 
	*	@param linkWalletId 
	*	@param employeeId 
	*	@param clientId 
	*	@param startTime 
	*	@param endTime 
	*
	*	@return { visitorPackageId }
	*/
	async createVisitorPackage(tempWifiAccessId,tpaId,linkWalletId,employeeId,clientId,startTime,endTime)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({tempWifiAccessId})[0], tempWifiAccessId, c, v);
		this.bigAppend(Object.keys({tpaId})[0], tpaId, c, v);
		this.bigAppend(Object.keys({linkWalletId})[0], linkWalletId, c, v);
		this.bigAppend(Object.keys({employeeId})[0], employeeId, c, v);
		this.bigAppend(Object.keys({clientId})[0], clientId, c, v);
		this.bigAppend(Object.keys({startTime})[0], startTime, c, v);
		this.bigAppend(Object.keys({endTime})[0], endTime, c, v);
					
		var ret = null;
		
		/*
		this.client.query(this.constructInsert("VisitorPackage", "visitorPackageId", c, v),
		v, (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully added visitorpackage", false, false);
			ret.data.visitorPackageId = res.rows[0].visitorpackageid;
				//this.client.end();
				callback(ret);
			}
		});		*/
		
		let res;
		try
		{
			res = await this.client.query(this.constructInsert("VisitorPackage", "visitorPackageId", c, v),v);
			ret = this.buildDefaultResponseObject(true, "Successfully added visitorpackage", false, false);
			ret.data.visitorPackageId = res.rows[0].visitorpackageid;
			return ret;
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}	
		
	}
	
	/**
	*	Retrieves a visitorpackage using visitorPackageId
	*	@param visitorPackageId 
	*
	*	@return { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime }
	*/
	async getVisitorPackageByVisitorPackageId(visitorPackageId)
	{
		var query = 'SELECT * FROM VisitorPackage WHERE visitorPackageId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [visitorPackageId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching visitorPackageId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackage", false, false);
				ret.data.visitorPackageId = res.rows[0].visitorpackageid;
				ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
				ret.data.tpaId = res.rows[0].tpaid;
				ret.data.linkWalletId = res.rows[0].linkwalletid;
				ret.data.employeeId = res.rows[0].employeeid;
				ret.data.clientId = res.rows[0].clientid;
				ret.data.startTime = res.rows[0].starttime;
				ret.data.endTime = res.rows[0].endtime;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [visitorPackageId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in VisitorPackage with that matching visitorPackageId");
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching visitorPackageId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackage", false, false);
				ret.data.visitorPackageId = res.rows[0].visitorpackageid;
				ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
				ret.data.tpaId = res.rows[0].tpaid;
				ret.data.linkWalletId = res.rows[0].linkwalletid;
				ret.data.employeeId = res.rows[0].employeeid;
				ret.data.clientId = res.rows[0].clientid;
				ret.data.startTime = res.rows[0].starttime;
				ret.data.endTime = res.rows[0].endtime;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}

	/**
	*	Retrieves a visitorpackage using tempWifiAccessId
	*	@param tempWifiAccessId 
	*
	*	@return { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime }
	*/
	async getVisitorPackageByTempWifiAccessId(tempWifiAccessId)
	{
		var query = 'SELECT * FROM VisitorPackage WHERE tempWifiAccessId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [tempWifiAccessId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching tempWifiAccessId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackage", false, false);
				ret.data.visitorPackageId = res.rows[0].visitorpackageid;
				ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
				ret.data.tpaId = res.rows[0].tpaid;
				ret.data.linkWalletId = res.rows[0].linkwalletid;
				ret.data.employeeId = res.rows[0].employeeid;
				ret.data.clientId = res.rows[0].clientid;
				ret.data.startTime = res.rows[0].starttime;
				ret.data.endTime = res.rows[0].endtime;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [tempWifiAccessId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in VisitorPackage with that matching tempWifiAccessId");
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching tempWifiAccessId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackage", false, false);
				ret.data.visitorPackageId = res.rows[0].visitorpackageid;
				ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
				ret.data.tpaId = res.rows[0].tpaid;
				ret.data.linkWalletId = res.rows[0].linkwalletid;
				ret.data.employeeId = res.rows[0].employeeid;
				ret.data.clientId = res.rows[0].clientid;
				ret.data.startTime = res.rows[0].starttime;
				ret.data.endTime = res.rows[0].endtime;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}

	/**
	*	Retrieves a visitorpackage using tpaId
	*	@param tpaId 
	*
	*	@return { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime }
	*/
	async getVisitorPackageByTpaId(tpaId)
	{
		var query = 'SELECT * FROM VisitorPackage WHERE tpaId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [tpaId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching tpaId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackage", false, false);
				ret.data.visitorPackageId = res.rows[0].visitorpackageid;
				ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
				ret.data.tpaId = res.rows[0].tpaid;
				ret.data.linkWalletId = res.rows[0].linkwalletid;
				ret.data.employeeId = res.rows[0].employeeid;
				ret.data.clientId = res.rows[0].clientid;
				ret.data.startTime = res.rows[0].starttime;
				ret.data.endTime = res.rows[0].endtime;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [tpaId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in VisitorPackage with that matching tpaId");
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching tpaId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackage", false, false);
				ret.data.visitorPackageId = res.rows[0].visitorpackageid;
				ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
				ret.data.tpaId = res.rows[0].tpaid;
				ret.data.linkWalletId = res.rows[0].linkwalletid;
				ret.data.employeeId = res.rows[0].employeeid;
				ret.data.clientId = res.rows[0].clientid;
				ret.data.startTime = res.rows[0].starttime;
				ret.data.endTime = res.rows[0].endtime;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}

	/**
	*	Retrieves a visitorpackage using linkWalletId
	*	@param linkWalletId 
	*
	*	@return { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime }
	*/
	async getVisitorPackageByLinkWalletId(linkWalletId)
	{
		var query = 'SELECT * FROM VisitorPackage WHERE linkWalletId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [linkWalletId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching linkWalletId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackage", false, false);
				ret.data.visitorPackageId = res.rows[0].visitorpackageid;
				ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
				ret.data.tpaId = res.rows[0].tpaid;
				ret.data.linkWalletId = res.rows[0].linkwalletid;
				ret.data.employeeId = res.rows[0].employeeid;
				ret.data.clientId = res.rows[0].clientid;
				ret.data.startTime = res.rows[0].starttime;
				ret.data.endTime = res.rows[0].endtime;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [linkWalletId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in VisitorPackage with that matching linkWalletId");
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching linkWalletId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackage", false, false);
				ret.data.visitorPackageId = res.rows[0].visitorpackageid;
				ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
				ret.data.tpaId = res.rows[0].tpaid;
				ret.data.linkWalletId = res.rows[0].linkwalletid;
				ret.data.employeeId = res.rows[0].employeeid;
				ret.data.clientId = res.rows[0].clientid;
				ret.data.startTime = res.rows[0].starttime;
				ret.data.endTime = res.rows[0].endtime;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
	/**
	*	Retrieves a set of visitorpackages using employeeId
	*	@param employeeId 
	*
	*	@return [ { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime } ]
	*/
	async getVisitorPackagesByEmployeeId(employeeId)
	{
		var query = 'SELECT * FROM VisitorPackage WHERE employeeId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [employeeId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching employeeId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackages", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.visitorPackageId = res.rows[i].visitorpackageid;
					obj.tempWifiAccessId = res.rows[i].tempwifiaccessid;
					obj.tpaId = res.rows[i].tpaid;
					obj.linkWalletId = res.rows[i].linkwalletid;
					obj.employeeId = res.rows[i].employeeid;
					obj.clientId = res.rows[i].clientid;
					obj.startTime = res.rows[i].starttime;
					obj.endTime = res.rows[i].endtime;
					
					ret.data.push(obj);
				}
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [employeeId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in VisitorPackage with that matching employeeId");
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching employeeId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackages", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.visitorPackageId = res.rows[i].visitorpackageid;
					obj.tempWifiAccessId = res.rows[i].tempwifiaccessid;
					obj.tpaId = res.rows[i].tpaid;
					obj.linkWalletId = res.rows[i].linkwalletid;
					obj.employeeId = res.rows[i].employeeid;
					obj.clientId = res.rows[i].clientid;
					obj.startTime = res.rows[i].starttime;
					obj.endTime = res.rows[i].endtime;
					
					ret.data.push(obj);
				}
				//this.client.end();
				callback(ret);
			}
		});	*/
	}

	/**
	*	Retrieves a set of visitorpackages using clientId
	*	@param clientId 
	*
	*	@return [ { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime } ]
	*/
	async getVisitorPackagesByClientId(clientId)
	{
		var query = 'SELECT * FROM VisitorPackage WHERE clientId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [clientId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching clientId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackages", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.visitorPackageId = res.rows[i].visitorpackageid;
					obj.tempWifiAccessId = res.rows[i].tempwifiaccessid;
					obj.tpaId = res.rows[i].tpaid;
					obj.linkWalletId = res.rows[i].linkwalletid;
					obj.employeeId = res.rows[i].employeeid;
					obj.clientId = res.rows[i].clientid;
					obj.startTime = res.rows[i].starttime;
					obj.endTime = res.rows[i].endtime;
					
					ret.data.push(obj);
				}
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [clientId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in VisitorPackage with that matching clientId");
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching clientId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackages", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.visitorPackageId = res.rows[i].visitorpackageid;
					obj.tempWifiAccessId = res.rows[i].tempwifiaccessid;
					obj.tpaId = res.rows[i].tpaid;
					obj.linkWalletId = res.rows[i].linkwalletid;
					obj.employeeId = res.rows[i].employeeid;
					obj.clientId = res.rows[i].clientid;
					obj.startTime = res.rows[i].starttime;
					obj.endTime = res.rows[i].endtime;
					
					ret.data.push(obj);
				}
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
    //CR
    
    async updateVisitorPackage(visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime) {
		if (!this.validateNumeric(visitorPackageId)) {
			return this.buildDefaultResponseObject(false, "Invalid Visitor Package ID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["tempWifiAccessId", "tpaId", "linkWalletId", "employeeId", "clientId", "startTime", "endTime"], [tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime], paramNames, paramValues);

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}

		var query = this.constructUpdate("VisitorPackage", paramNames, "visitorPackageId", visitorPackageId);
		var ret = null;
		
		
		/*this.client.query(query, paramValues, (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully updated Visitor Package", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated Visitor Package", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	async deleteVisitorPackage(visitorPackageId) {
		if (!this.validateNumeric(visitorPackageId)) {
			return this.buildDefaultResponseObject(false, "Invalid Visitor Package ID provided", true);
		}

		var query = this.constructDelete("VisitorPackage", "visitorPackageId");
		var ret = null;
		
		
		/*this.client.query(query, [visitorPackageId], (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully deleted Visitor Package", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, [visitorPackageId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted Visitor Package", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}
    //UD
	
	
	//TPA
	
	/**
	*	Creates a new tpa
	*
	*	@return { tpaId }
	*/
	async createTPA()
	{
		var c = [];
		var v = [];
				
					
		var ret = null;
		
		var query = "INSERT INTO TPA DEFAULT VALUES RETURNING tpaid";
		
		/*
		this.client.query(query,
		v, (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully added tpa", false, false);
			ret.data.tpaId = res.rows[0].tpaid;
				//this.client.end();
				callback(ret);
			}
		});		*/
		
		let res;
		try
		{
			res = await this.client.query(query,v);
			ret = this.buildDefaultResponseObject(true, "Successfully added tpa", false, false);
			ret.data.tpaId = res.rows[0].tpaid;
			return ret;
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}	
		
	}
	
	/**
	*	Retrieves a tpa using tpaId
	*	@param tpaId 
	*
	*	@return { tpaId }
	*/
	async getTPAByTpaId(tpaId)
	{
		var query = 'SELECT * FROM TPA WHERE tpaId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [tpaId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in TPA with that matching tpaId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tpa", false, false);
				ret.data.tpaId = res.rows[0].tpaid;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [tpaId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in TPA with that matching tpaId");
				ret = this.returnDatabaseError("no rows in TPA with that matching tpaId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tpa", false, false);
				ret.data.tpaId = res.rows[0].tpaid;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
	
    //CR
    
    //NOTE: There is no UPDATE for TPA as you can't update a primary key

	async deleteTPA(tpaId) {
		if (!this.validateNumeric(tpaId)) {
			return this.buildDefaultResponseObject(false, "Invalid TPA ID provided", true);
		}

		var query = this.constructDelete("TPA", "tpaId");
		var ret = null;
		
		
		/*this.client.query(query, [tpaId], (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully deleted TPA entry", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, [tpaId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted TPA entry", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}
    //UD
	
	
	
    //TPAxRoom
	
	/**
	*	Creates a new tpaxroom
	*	@param tpaId 
	*	@param roomId 
	*
	*	@return { tpaId }
	*/
	async createTPAxRoom(tpaId,roomId)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({tpaId})[0], tpaId, c, v);
		this.bigAppend(Object.keys({roomId})[0], roomId, c, v);
					
		var ret = null;
		
		var query = "INSERT INTO TPAxRoom(tpaId,roomId) VALUES ($1,$2) RETURNING CONCAT(tpaId, '_', roomId) AS tpaxroomid;";
		
		/*
		this.client.query(query,
		v, (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully added tpaxroom", false, false);
			ret.data.tpaxroomId = res.rows[0].tpaxroomid;
				//this.client.end();
				callback(ret);
			}
		});		*/
		
		let res;
		try
		{
			res = await this.client.query(query,v);
			ret = this.buildDefaultResponseObject(true, "Successfully added tpaxroom", false, false);
			ret.data.tpaxroomId = res.rows[0].tpaxroomid;
			return ret;
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}	
		
	}
	
	/**
	*	Retrieves a set tpaxrooms using tpaId
	*	@param tpaId 
	*
	*	@return [ { tpaId, roomId } ]
	*/
	async getTPAxRoomsByTpaId(tpaId)
	{
		var query = 'SELECT * FROM TPAxRoom WHERE tpaId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [tpaId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in TPAxRoom with that matching tpaId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tpaxrooms", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.tpaId = res.rows[i].tpaid;
					obj.roomId = res.rows[i].roomid;
					
					ret.data.push(obj);
				}
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [tpaId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in TPAxRoom with that matching tpaId");
				ret = this.returnDatabaseError("no rows in TPAxRoom with that matching tpaId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tpaxrooms", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.tpaId = res.rows[i].tpaid;
					obj.roomId = res.rows[i].roomid;
					
					ret.data.push(obj);
				}
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
	/**
	*	Retrieves a set tpaxrooms using roomId
	*	@param roomId 
	*
	*	@return [ { tpaId, roomId } ]
	*/
	async getTPAxRoomsByRoomId(roomId)
	{
		var query = 'SELECT * FROM TPAxRoom WHERE roomId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [roomId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in TPAxRoom with that matching roomId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tpaxrooms", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.tpaId = res.rows[i].tpaid;
					obj.roomId = res.rows[i].roomid;
					
					ret.data.push(obj);
				}
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [roomId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in TPAxRoom with that matching roomId");
				ret = this.returnDatabaseError("no rows in TPAxRoom with that matching roomId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tpaxrooms", false, true);
				for(var i = 0; i < res.rows.length; i++)
				{
					var obj = {};
					
					obj.tpaId = res.rows[i].tpaid;
					obj.roomId = res.rows[i].roomid;
					
					ret.data.push(obj);
				}
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
    
    //CR
    
    //note this function is slightly different to others, see parameter list
	async updateTPAxRoom(currentTpaId, currentRoomId, potentiallyChangedTpaId, potentiallyChangedRoomId) {
		if (!this.validateNumeric(currentTpaId) || !this.validateNumeric(currentRoomId)) {
			return this.buildDefaultResponseObject(false, "Invalid TPA ID or RoomID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["tpaId", "roomId"], [potentiallyChangedTpaId, potentiallyChangedRoomId], paramNames, paramValues); // either update tpaId OR roomId, OR both. for the given current tpaId and roomId combo

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}

		var query = "UPDATE TPAxRoom SET ";
		for (var i = 1; i < paramNames.length + 1; i++) {
			if (i !== paramNames.length) {
				query += paramNames[i - 1] + " = $" + i + ",";
			} else {
				query += paramNames[i - 1] + " = $" + i;
			}
		}

		query += " WHERE tpaId = " + currentTpaId + " AND roomId = " + currentRoomId; //special case, can't use generic function for composite key

		console.log(query);
		var ret = null;
		
		
		/*this.client.query(query, paramValues, (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully updated TPAxRoom", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated TPAxRoom", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}
	
	
	//note slightly different to other deletes, see parameter list
	async deleteTPAxRoom(tpaId, roomId) {
		if (!this.validateNumeric(tpaId) || !this.validateNumeric(roomId)) {
			return this.buildDefaultResponseObject(false, "Invalid TPA ID OR Room ID provided", true);
		}

		var query = "DELETE FROM TPAxRoom WHERE " + tpaId + " = $1 AND " + roomId + " = $2";;
		var ret = null;
		
		
		/*this.client.query(query, [tpaId, roomId], (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully deleted TPAxRoom entry", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, [tpaId, roomId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted TPAxRoom entry", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}
    //UD
	
	
	
	//Wallet
	
	/**
	*	Creates a new wallet
	*	@param maxLimit 
	*	@param spent 
	*
	*	@return { linkWalletId }
	*/
	async createWallet(maxLimit,spent)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({maxLimit})[0], maxLimit, c, v);
		this.bigAppend(Object.keys({spent})[0], spent, c, v);
					
		var ret = null;
		
		/*
		this.client.query(this.constructInsert("Wallet", "linkWalletId", c, v),
		v, (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully added wallet", false, false);
			ret.data.linkWalletId = res.rows[0].linkwalletid;
				//this.client.end();
				callback(ret);
			}
		});		*/
		
		let res;
		try
		{
			res = await this.client.query(this.constructInsert("Wallet", "linkWalletId", c, v),v);
			ret = this.buildDefaultResponseObject(true, "Successfully added wallet", false, false);
			ret.data.linkWalletId = res.rows[0].linkwalletid;
			return ret;
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}	
		
	}
	
	/**
	*	Retrieves a wallet using linkWalletId
	*	@param linkWalletId 
	*
	*	@return { linkWalletId, maxLimit, spent }
	*/
	async getWalletByLinkWalletId(linkWalletId)
	{
		var query = 'SELECT * FROM Wallet WHERE linkWalletId = $1';
		
		var ret = null;
		
		
		let res;
		try
		{
			res = await this.client.query(query, [linkWalletId]);
			if(res.rows.length == 0)
			{
				ret = this.returnDatabaseError("no rows in Wallet with that matching linkWalletId");
				return ret;
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved wallet", false, false);
				ret.data.linkWalletId = res.rows[0].linkwalletid;
				ret.data.maxLimit = res.rows[0].maxlimit;
				ret.data.spent = res.rows[0].spent;
				return ret;
			}
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
		
		/*this.client.query(query, [linkWalletId], (err, res) => 
		{
			if (err) 
			{
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				//this.client.end();
				callback(ret);
			} 
			else if(res.rows.length == 0)
			{
				console.log("no rows in Wallet with that matching linkWalletId");
				ret = this.returnDatabaseError("no rows in Wallet with that matching linkWalletId");
				//this.client.end();
				callback(ret);
			}
			else 
			{
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved wallet", false, false);
				ret.data.linkWalletId = res.rows[0].linkwalletid;
				ret.data.maxLimit = res.rows[0].maxlimit;
				ret.data.spent = res.rows[0].spent;
				//this.client.end();
				callback(ret);
			}
		});	*/
	}
	
    //CR
    async updateWallet(linkwalletId, maxLimit, spent) {
		if (!this.validateNumeric(linkwalletId)) {
			return this.buildDefaultResponseObject(false, "Invalid Wallet ID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["maxLimit", "spent"], [maxLimit, spent], paramNames, paramValues);

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}

		var query = this.constructUpdate("Wallet", paramNames, "linkwalletId", linkwalletId);
		var ret = null;
		
		
		/*this.client.query(query, paramValues, (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully updated Wallet", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated Wallet", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	async deleteWallet(linkwalletId) {
		if (!this.validateNumeric(linkwalletId)) {
			return this.buildDefaultResponseObject(false, "Invalid Wallet ID provided", true);
		}

		var query = this.constructDelete("Wallet", "linkwalletId");
		var ret = null;
		
		
		/*this.client.query(query, [linkwalletId], (err, res) => {
			if (err) {
				console.log(err.stack);
				ret = this.returnDatabaseError(err);
				this.client.end();
				callback(ret);
			} else {
				ret = this.buildDefaultResponseObject(true, "Successfully deleted Wallet", true);
				this.client.end();
				callback(ret);
			}
		});*/
		
		
		
		let res;
		try
		{
			res = await this.client.query(query, [linkwalletId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted Wallet", true);
			return ret;
			
		}
		catch(err)
		{
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}
    //UD
	
	

    //Jared Helpers
	
	constructInsert(tableName, tableIdName, columns, values)
	{
		var query = "INSERT INTO " + tableName + "(";
		var columnsString = columns.join(',');
		var prepVals = [];
		for(var i = 1; i <= values.length; i++)
		{
			if((typeof values[i-1]) === 'string' && !values[i-1].startsWith("201"))
			{
				prepVals.push("$" + i + "::text");
			}
			else
			{
				prepVals.push("$" + i);
			}
		}
		var valuesString = prepVals.join(',');
		query += columnsString;
		query += ") VALUES (";
		query += valuesString;
		query += ") RETURNING " + tableIdName + ";";
		return query;
	}
	
	bigAppend(val1, val2, list1, list2)
	{
		list1.push(val1);
		list2.push(val2);
	}
	
	
    
    
    //Savva Helpers
	
	
	setValidParams(potentialParamNames, potentialParamValues, actualParamNames, actualParamValues) {
		if (potentialParamNames.length !== potentialParamValues.length) {
			return;
		}
		for (var i = 0; i < potentialParamValues.length; i++) {
			if (potentialParamValues[i] !== undefined) {
				actualParamNames.push(potentialParamNames[i]); //since js is pass by reference for arrays, this will update the array in the caller
				actualParamValues.push(potentialParamValues[i]);
			}
		}
	}

	constructUpdate(tableName, paramList, idName, idValue) {
		var query = "UPDATE " + tableName + " SET ";

		for (var i = 1; i < paramList.length + 1; i++) {
			if (i !== paramList.length) {
				query += paramList[i - 1] + " = $" + i + ",";
			} else {
				query += paramList[i - 1] + " = $" + i;
			}
		}

		query += " WHERE " + idName + " = " + idValue;
		//console.log(query);
		return query;
	}

	constructDelete(tableName, idName) {
		return "DELETE FROM " + tableName + " WHERE " + idName + " = $1";
	}
	
	
	
	
	
	
	
	

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
