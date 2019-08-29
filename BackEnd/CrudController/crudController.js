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
 *	2019/07/17	Savvas		2.1			Added necessary comments and removed unnecessary comments
 *	2019/07/27	Savvas		2.2			Added Update and Deletes for NFC Payment Points and Transactions
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
*	@version:	2.2
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
		this.myPasswordId = null;
		this.myViewRandom = null;
		this.mva = [];
		
		this.tableNameArray = [
		"building",
		"client",
		"company",
		"employee",
		"nfcaccesspoints",
		"nfcpaymentpoints",
		"password",
		"room",
		"tempwifiaccess",
		"tpa",
		"tpaxroom",
		"transaction",
		"visitorpackage",
		"wallet",
		"wifiparams"
		];
		
		for(var i = 0; i < this.tableNameArray.length; i++)
		{
			let thisTable = this.tableNameArray[i];
			this.mva[thisTable] = thisTable;
		}


		this.client = new Client({
			user: 'postgres',
			host: 'localhost',
			database: 'link',
			password: 'nbuser',
			port: 5432,
		});
		/*
		this.client = new Client({
			connectionString: process.env.DATABASE_URL
		});
		*/
		this.client.connect();

		
	}

	async initialize(apiKey, demoMode) {		
		
		this.demoMode = demoMode;
		
		var passwordResult = await this.getPasswordByApiKey(apiKey);
		
		if(!passwordResult.success)
		{
			return passwordResult.message;
		}
		
		passwordResult = passwordResult.data.passwordId;
		var companyResult = await this.getCompanyByPasswordId(passwordResult);
		
		if(!companyResult.success)
		{
			//is an employee
			return companyResult.message;
		}
		
		//now we know we have a company
		
		var companyId = companyResult.data.companyId;
		//console.log("companyId: " + companyId);
		
		var list_employee = await this.queryIntoCSV("SELECT * FROM employee WHERE companyId = " + companyId);
		//console.log("list_employee: " + list_employee);
		
		var list_building = await this.queryIntoCSV("SELECT * FROM building WHERE companyId = " + companyId);
		//console.log("list_building: " + list_building);
		
		var list_visitorpackage = await this.queryIntoCSV("SELECT * FROM visitorpackage WHERE employeeId IN (" + list_employee + ")");
		//console.log("list_visitorpackage: " + list_visitorpackage);
		
		var list_tpa = await this.queryIntoCSV("SELECT tpa.* " +
		"FROM tpa INNER JOIN visitorPackage ON tpa.tpaId = visitorPackage.tpaId " +
		"WHERE visitorPackage.visitorPackageId IN (" + list_visitorpackage + ")");
		//console.log("list_tpa: " + list_tpa);
		
		var list_wallet = await this.queryIntoCSV("SELECT wallet.* " +
		"FROM wallet INNER JOIN visitorPackage ON wallet.linkWalletId = visitorPackage.linkWalletId " +
		"WHERE visitorPackage.visitorPackageId IN (" + list_visitorpackage + ")");
		//console.log("list_wallet: " + list_wallet);
		
		var list_room = await this.queryIntoCSV("SELECT * FROM room WHERE buildingId IN (" + list_building + ")");
		//console.log("list_room: " + list_room);
		
		this.myPasswordId = passwordResult;
		this.myViewRandom = this.randomString(10);
		
		for(var i = 0; i < this.tableNameArray.length; i++)
		{
			let thisTable = this.tableNameArray[i];
			this.mva[thisTable] = this.mva[thisTable] + "_" + this.myPasswordId + "_" + this.myViewRandom;
		}
		
		
		
		//company, building, employee
		
		if(companyId == 1)
		{
			var viewRes = await this.client.query("CREATE VIEW " + this.mva["company"] + " AS " + 
			"(SELECT * FROM company)", []);
		}
		else
		{
			var viewRes = await this.client.query("CREATE VIEW " + this.mva["company"] + " AS " + 
			"(SELECT * FROM company WHERE companyID = " + companyId + ")", []);
		}
			
		
				
		var viewRes = await this.client.query("CREATE VIEW " + this.mva["building"] + " AS " + 
		"(SELECT * FROM building WHERE companyID = " + companyId + ")", []);
		
		var viewRes = await this.client.query("CREATE VIEW " + this.mva["employee"] + " AS " + 
		"(SELECT * FROM employee WHERE companyID = " + companyId + ")", []);
		
		
		//password 
		if(companyId == 1)
		{
			var viewRes = await this.client.query("CREATE VIEW " + this.mva["password"] + " AS " + 
			"(SELECT * FROM password " +
			"WHERE passwordId IN (SELECT passwordId FROM employee WHERE employeeId IN (" + list_employee + ")) " +
			"OR passwordId IN (SELECT passwordId FROM company))", []);
		}
		else
		{
			var viewRes = await this.client.query("CREATE VIEW " + this.mva["password"] + " AS " + 
			"(SELECT * FROM password " +
			"WHERE passwordId IN (SELECT passwordId FROM employee WHERE employeeId IN (" + list_employee + ")) " +
			"OR passwordId = (SELECT passwordId FROM company WHERE companyId = " + companyId + "))", []);
		}
		
		
		
		
		//visitorpackage, client
		
		var viewRes = await this.client.query("CREATE VIEW " + this.mva["visitorpackage"] + " AS " + 
		"(SELECT * FROM visitorpackage WHERE visitorpackageId IN (" + list_visitorpackage + "))", []);
		
		var viewRes = await this.client.query("CREATE VIEW " + this.mva["client"] + " AS " + 
		"(SELECT * FROM client WHERE clientId IN (SELECT clientId FROM visitorpackage WHERE visitorPackageId IN (" + list_visitorpackage + ")))", []);
		
		
		//tpa, tempwifiaccess, wallet, transaction
		
		var viewRes = await this.client.query("CREATE VIEW " + this.mva["tpa"] + " AS " + 
		"(SELECT * FROM tpa WHERE tpaId IN (" + list_tpa + "))", []);
		
		var viewRes = await this.client.query("CREATE VIEW " + this.mva["tempwifiaccess"] + " AS " + 
		"(SELECT * FROM tempwifiaccess WHERE tempwifiaccessId IN (SELECT tempwifiaccessId FROM visitorpackage WHERE visitorPackageId IN (" + list_visitorpackage + ")))", []);
		
		var viewRes = await this.client.query("CREATE VIEW " + this.mva["wallet"] + " AS " + 
		"(SELECT * FROM wallet WHERE linkwalletId IN (" + list_wallet + "))", []);
		
		var viewRes = await this.client.query("CREATE VIEW " + this.mva["transaction"] + " AS " + 
		"(SELECT * FROM transaction WHERE walletId IN (" + list_wallet + "))", []);
		
		
		//wifiparams, nfcpaymentpoint
		
		var viewRes = await this.client.query("CREATE VIEW " + this.mva["wifiparams"] + " AS " + 
		"(SELECT * FROM wifiparams WHERE wifiparamsId IN (SELECT wifiparamsId FROM building WHERE buildingId IN (" + list_building + ")))", []);
		
		var viewRes = await this.client.query("CREATE VIEW " + this.mva["nfcpaymentpoints"] + " AS " + 
		"(SELECT * FROM nfcpaymentpoints WHERE buildingId IN (" + list_building + "))", []);
		
		
		//room, nfcaccesspoints
		
		var viewRes = await this.client.query("CREATE VIEW " + this.mva["room"] + " AS " + 
		"(SELECT * FROM room WHERE roomId IN (" + list_room + "))", []);
		
		var viewRes = await this.client.query("CREATE VIEW " + this.mva["nfcaccesspoints"] + " AS " + 
		"(SELECT * FROM nfcaccesspoints WHERE roomId IN (" + list_room + "))", []);
		
		
		//tpaxroom
		
		var viewRes = await this.client.query("CREATE VIEW " + this.mva["tpaxroom"] + " AS " + 
		"(SELECT * FROM tpaxroom "+
		"WHERE tpaId IN (" + list_tpa + ") "+
		"OR roomId IN (" + list_room + "))", []);
		
		
		return "Pass";
	}
	
	async queryIntoCSV(query)
	{
		var res = await this.client.query(query, []);
		var list = this.resultIntoCSV(res);
		return list;
	}
	
	resultIntoCSV(result)
	{
		
		result = result.rows;
		
		let arr = [];
		
		for(let i = 0; i < result.length; i++)
		{
			let thisOne = result[i];
			let id = thisOne[Object.keys(thisOne)[0]];
			arr.push(id);
		}
		
		let toReturn = this.arrayIntoCSV(arr);
		
		return toReturn;
	}
	
	arrayIntoCSV(arr)
	{
		if(arr.length == 0)
		{
			return -1 + "";
		}
		else if (arr.length == 1)
		{
			return arr[0] + "";
		}
		else
		{
			let s = arr[0];
			for(let i = 1; i < arr.length; i++)
			{
				s += "," + arr[i];
			}
			return s;
		}
	}
	
	async deInitialize() {
		
		if(this.demoMode)
		{
			
		}
		else
		{
			for(var i = 0; i < this.tableNameArray.length; i++)
			{
				let thisTable = this.tableNameArray[i];
				
				try
				{
					var viewRes = await this.client.query("DROP VIEW IF EXISTS " + this.mva[thisTable], []);
				}
				catch(err)
				{
					
				}
			}
		}
			
		
		
		
		return "Yes";
	}

	/**
	 * Builds a failure response object in the standard format with "success" being false and 
	 * "message" being the input parameter of the user
	 * @param errorMessage The error message to be returned to the caller
	 * @return { success, message, data }
	 */
	returnDatabaseError(errorMessage) {
		return this.buildDefaultResponseObject(false, "Database query failed: " + errorMessage, true);
	}

	/**
	*	Creates a new company
	*	@param companyName 
	*	@param companyWebsite 
	*	@param passwordId 
	*	@return { companyId }
	*/
	async createCompany(companyName, companyWebsite, passwordId) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ companyName })[0], companyName, c, v);
		this.bigAppend(Object.keys({ companyWebsite })[0], companyWebsite, c, v);
		this.bigAppend(Object.keys({ passwordId })[0], passwordId, c, v);

		var ret = null;

		let res;
		try {
			res = await this.client.query(this.constructInsert("Company", "companyId", c, v), v);
			ret = this.buildDefaultResponseObject(true, "Successfully added company", false, false);
			ret.data.companyId = res.rows[0].companyid;
			return ret;
		}
		catch (err) {
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
	async getCompanyByCompanyId(companyId) {
		
		var query = 'SELECT * FROM ' + this.mva["company"] + ' WHERE companyId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [companyId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Company with that matching companyId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved company", false, false);
				ret.data.companyId = res.rows[0].companyid;
				ret.data.companyName = res.rows[0].companyname;
				ret.data.companyWebsite = res.rows[0].companywebsite;
				ret.data.passwordId = res.rows[0].passwordid;
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a company using passwordId
	*	@param passwordId 
	*	@return { companyId, companyName, companyWebsite, passwordId }
	*/
	async getCompanyByPasswordId(passwordId) {
		var query = 'SELECT * FROM ' + this.mva["company"] + ' WHERE passwordId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [passwordId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Company with that matching passwordId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved company", false, false);
				ret.data.companyId = res.rows[0].companyid;
				ret.data.companyName = res.rows[0].companyname;
				ret.data.companyWebsite = res.rows[0].companywebsite;
				ret.data.passwordId = res.rows[0].passwordid;
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}


	/**
	*	Retrieves all companies
	*	@return [ { companyId, companyName, companyWebsite, passwordId } ]
	*/
	async getAllCompanies() {
		var query = 'SELECT * FROM ' + this.mva["company"] + '';

		var ret = null;
		var arr = [];

		let res;
		try {
			res = await this.client.query(query, arr);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Company");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved all companies", false, true);

				for (var i = 0; i < res.rows.length; i++) {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}

	}

    /**
	* Update the details of the company with the given ID based on the input parameters.
	* Parameters passed as undefined are ignored in the update (i.e. they are not updated), 
	* for all other paramter values (including null) an update attempt will be made in the database 
	* @param companyId 
    * @param name 
    * @param website 
    * @param passwordId 
	* @return {success, message, data : null}
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

		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated company", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
    * Deletes a company given an ID
    * @param companyId
	* @return {success, message, data : null}
    */
	async deleteCompany(companyId) {
		if (!this.validateNumeric(companyId)) {
			return this.buildDefaultResponseObject(false, "Invalid company ID provided", true);
		}

		var query = this.constructDelete("Company", "companyId");
		var ret = null;

		let res;
		try {
			res = await this.client.query(query, [companyId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted company", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

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
	async createBuilding(latitude, longitude, branchName, companyId, wifiParamsId) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ latitude })[0], latitude, c, v);
		this.bigAppend(Object.keys({ longitude })[0], longitude, c, v);
		this.bigAppend(Object.keys({ branchName })[0], branchName, c, v);
		this.bigAppend(Object.keys({ companyId })[0], companyId, c, v);
		this.bigAppend(Object.keys({ wifiParamsId })[0], wifiParamsId, c, v);

		var ret = null;
		let res;
		try {
			res = await this.client.query(this.constructInsert("Building", "buildingId", c, v), v);
			ret = this.buildDefaultResponseObject(true, "Successfully added building", false, false);
			ret.data.buildingId = res.rows[0].buildingid;
			return ret;
		}
		catch (err) {
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
	async getBuildingByBuildingId(buildingId) {
		var query = 'SELECT * FROM ' + this.mva["building"] + ' WHERE buildingId = $1';

		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [buildingId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Building with that matching buildingId");
				return ret;
			}
			else {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a set of buildings using companyId
	*	@param companyId 
	*
	*	@return [ { buildingId, latitude, longitude, branchName, companyId, wifiParamsId } ]
	*/
	async getBuildingsByCompanyId(companyId) {
		var query = 'SELECT * FROM ' + this.mva["building"] + ' WHERE companyId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [companyId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Building with that matching companyId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved buildings", false, true);
				for (var i = 0; i < res.rows.length; i++) {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
*	Retrieves a set of buildings using wifiParamsId
*	@param wifiParamsId 
*
*	@return [ { buildingId, latitude, longitude, branchName, companyId, wifiParamsId } ]
*/
	async getBuildingsByWifiParamsId(wifiParamsId) {
		var query = 'SELECT * FROM ' + this.mva["building"] + ' WHERE wifiParamsId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [wifiParamsId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Building with that matching wifiParamsId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved buildings", false, true);
				for (var i = 0; i < res.rows.length; i++) {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}


	//CR
	/**
	* Update the details of the building with the given ID based on the input parameters.
	* Parameters passed as undefined are ignored in the update (i.e. they are not updated), 
	* for all other paramter values (including null) an update attempt will be made in the database
	* @param buildingId
	* @param latitude
	* @param longitude
	* @param branchName
	* @param companyId
	* @param wifiParamsId
	* @return {success, message, data : null}
	*/
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

		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated building", true);
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
    * Deletes a building given an ID
    * @param buildingId
	* @return {success, message, data : null}
    */
	async deleteBuilding(buildingId) {
		if (!this.validateNumeric(buildingId)) {
			return this.buildDefaultResponseObject(false, "Invalid building ID provided", true);
		}

		var query = this.constructDelete("Building", "buildingId");
		var ret = null;

		let res;
		try {
			res = await this.client.query(query, [buildingId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted building", true);
			return ret;

		}
		catch (err) {
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
	async createPassword(username, hash, salt, apiKey, expirationDate) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ username })[0], username, c, v);
		this.bigAppend(Object.keys({ hash })[0], hash, c, v);
		this.bigAppend(Object.keys({ salt })[0], salt, c, v);
		this.bigAppend(Object.keys({ apiKey })[0], apiKey, c, v);
		this.bigAppend(Object.keys({ expirationDate })[0], expirationDate, c, v);

		var ret = null;
		let res;
		try {
			res = await this.client.query(this.constructInsert("Password", "passwordId", c, v), v);
			ret = this.buildDefaultResponseObject(true, "Successfully added password", false, false);
			ret.data.passwordId = res.rows[0].passwordid;
			return ret;
		}
		catch (err) {
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
	async getPasswordByPasswordId(passwordId) {
		var query = 'SELECT * FROM ' + this.mva["password"] + ' WHERE passwordId = $1';

		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [passwordId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Password with that matching passwordId");
				return ret;
			}
			else {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a password using username
	*	@param username 
	*
	*	@return { passwordId, username, hash, salt, apiKey, expirationDate }
	*/
	async getPasswordByUsername(username) {
		var query = 'SELECT * FROM ' + this.mva["password"] + ' WHERE username = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [username]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Password with that matching username");
				return ret;
			}
			else {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a password using apiKey
	*	@param apiKey 
	*	@return { passwordId, username, hash, salt, apiKey, expirationDate }
	*/
	async getPasswordByApiKey(apiKey) {
		var query = 'SELECT * FROM ' + this.mva["password"] + ' WHERE apiKey = $1';

		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [apiKey]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Password with that matching apiKey");
				return ret;
			}
			else {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	//CR
	/**
	* Update the details of the Password with the given ID based on the input parameters.
	* Parameters passed as undefined are ignored in the update (i.e. they are not updated), 
	* for all other paramter values (including null) an update attempt will be made in the database
	* @param passwordId 
	* @param username 
	* @param hash 
	* @param salt 
	* @param apiKey 
	* @param expirationDate 
	* @return {success, message, data : null}
	 */
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
		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated password", true);
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
    * Deletes a password given an ID
    * @param passwordId
	* @return {success, message, data : null}
    */
	async deletePassword(passwordId) {
		if (!this.validateNumeric(passwordId)) {
			return this.buildDefaultResponseObject(false, "Invalid password ID provided", true);
		}

		var query = this.constructDelete("Password", "passwordId");
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [passwordId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted password", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Creates a new room
	*	@param roomName 
	*	@param parentRoomList 
	*	@param buildingId 
	*
	*	@return { roomId }
	*/
	async createRoom(roomName, parentRoomList, buildingId) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ roomName })[0], roomName, c, v);
		this.bigAppend(Object.keys({ parentRoomList })[0], parentRoomList, c, v);
		this.bigAppend(Object.keys({ buildingId })[0], buildingId, c, v);

		var ret = null;
		let res;
		try {
			res = await this.client.query(this.constructInsert("Room", "roomId", c, v), v);
			ret = this.buildDefaultResponseObject(true, "Successfully added room", false, false);
			ret.data.roomId = res.rows[0].roomid;
			return ret;
		}
		catch (err) {
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
	async getRoomByRoomId(roomId) {
		var query = 'SELECT * FROM ' + this.mva["room"] + ' WHERE roomId = $1';

		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [roomId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Room with that matching roomId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved room", false, false);
				ret.data.roomId = res.rows[0].roomid;
				ret.data.roomName = res.rows[0].roomname;
				ret.data.parentRoomList = res.rows[0].parentroomlist;
				ret.data.buildingId = res.rows[0].buildingid;
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a set of rooms using buildingId
	*	@param buildingId 
	*
	*	@return [ { roomId, roomName, parentRoomList, buildingId } ]
	*/
	async getRoomsByBuildingId(buildingId) {
		var query = 'SELECT * FROM ' + this.mva["room"] + ' WHERE buildingId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [buildingId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Room with that matching buildingId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved rooms", false, true);
				for (var i = 0; i < res.rows.length; i++) {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	//CR
	/**

	* @param
	 */
	/**
		* Update the details of the Room with the given ID based on the input parameters.
		* Parameters passed as undefined are ignored in the update (i.e. they are not updated), 
		* for all other paramter values (including null) an update attempt will be made in the database
		* @param roomId 
		* @param roomName 
		* @param parentRoomList 
		* @param buildingId 
		* @return {success, message, data : null}
	 */
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
		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated Room", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
    * Deletes a room given an ID
    * @param roomId
	* @return {success, message, data : null}
    */
	async deleteRoom(roomId) {
		if (!this.validateNumeric(roomId)) {
			return this.buildDefaultResponseObject(false, "Invalid room ID provided", true);
		}

		var query = this.constructDelete("Room", "roomId");
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [roomId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted room", true);
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Creates a new nfcaccesspoints
	*	@param roomId 
	*	@return { nfcReaderId }
	*/
	async createNFCAccessPoints(roomId) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ roomId })[0], roomId, c, v);

		var ret = null;
		let res;
		try {
			res = await this.client.query(this.constructInsert("NFCAccessPoints", "nfcReaderId", c, v), v);
			ret = this.buildDefaultResponseObject(true, "Successfully added nfcaccesspoints", false, false);
			ret.data.nfcReaderId = res.rows[0].nfcreaderid;
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}

	}

	/**
	*	Retrieves a nfcaccesspoints using nfcReaderId
	*	@param nfcReaderId 
	*	@return { nfcReaderId, roomId }
	*/
	async getNFCAccessPointsByNfcReaderId(nfcReaderId) {
		var query = 'SELECT * FROM ' + this.mva["nfcaccesspoints"] + ' WHERE nfcReaderId = $1';

		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [nfcReaderId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in NFCAccessPoints with that matching nfcReaderId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved nfcaccesspoints", false, false);
				ret.data.nfcReaderId = res.rows[0].nfcreaderid;
				ret.data.roomId = res.rows[0].roomid;
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a set of nfcaccesspointss using roomId
	*	@param roomId 
	*
	*	@return [ { nfcReaderId, roomId } ]
	*/
	async getNFCAccessPointssByRoomId(roomId) {
		var query = 'SELECT * FROM ' + this.mva["nfcaccesspoints"] + ' WHERE roomId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [roomId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in NFCAccessPoints with that matching roomId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved nfcaccesspointss", false, true);
				for (var i = 0; i < res.rows.length; i++) {
					var obj = {};

					obj.nfcReaderId = res.rows[i].nfcreaderid;
					obj.roomId = res.rows[i].roomid;

					ret.data.push(obj);
				}
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}


	//CR
    /**
	* Update the details of the an Access Point with the given ID based on the input parameters.
	* Parameters passed as undefined are ignored in the update (i.e. they are not updated), 
	* for all other paramter values (including null) an update attempt will be made in the database 
	* @param nfcReaderId 
    * @param roomId 
	* @return {success, message, data : null}
    */
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
		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated NFC access point", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
    * Deletes an Access point given an ID
    * @param nfcReaderId
	* @return {success, message, data : null}
    */
	async deleteAccessPoints(nfcReaderId) {
		if (!this.validateNumeric(nfcReaderId)) {
			return this.buildDefaultResponseObject(false, "Invalid NFC Reader ID provided", true);
		}

		var query = this.constructDelete("NFCAccessPoints", "nfcReaderId");
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [nfcReaderId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted Access Point", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

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
	async createEmployee(firstName, surname, title, cellphone, email, companyId, buildingId, passwordId) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ firstName })[0], firstName, c, v);
		this.bigAppend(Object.keys({ surname })[0], surname, c, v);
		this.bigAppend(Object.keys({ title })[0], title, c, v);
		this.bigAppend(Object.keys({ cellphone })[0], cellphone, c, v);
		this.bigAppend(Object.keys({ email })[0], email, c, v);
		this.bigAppend(Object.keys({ companyId })[0], companyId, c, v);
		this.bigAppend(Object.keys({ buildingId })[0], buildingId, c, v);
		this.bigAppend(Object.keys({ passwordId })[0], passwordId, c, v);

		var ret = null;
		let res;
		try {
			res = await this.client.query(this.constructInsert("Employee", "employeeId", c, v), v);
			ret = this.buildDefaultResponseObject(true, "Successfully added employee", false, false);
			ret.data.employeeId = res.rows[0].employeeid;
			return ret;
		}
		catch (err) {
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
	async getEmployeeByEmployeeId(employeeId) {
		var query = 'SELECT * FROM ' + this.mva["employee"] + ' WHERE employeeId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [employeeId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Employee with that matching employeeId");
				return ret;
			}
			else {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a employee using passwordId
	*	@param passwordId 
	*
	*	@return { employeeId, firstName, surname, title, cellphone, email, companyId, buildingId, passwordId }
	*/
	async getEmployeeByPasswordId(passwordId) {
		var query = 'SELECT * FROM ' + this.mva["employee"] + ' WHERE passwordId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [passwordId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Employee with that matching passwordId");
				return ret;
			}
			else {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a set of employees using companyId
	*	@param companyId 
	*
	*	@return [ { employeeId, firstName, surname, title, cellphone, email, companyId, buildingId, passwordId } ]
	*/
	async getEmployeesByCompanyId(companyId) {
		var query = 'SELECT * FROM ' + this.mva["employee"] + ' WHERE companyId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [companyId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Employee with that matching companyId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved employees", false, true);
				for (var i = 0; i < res.rows.length; i++) {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a set of employees using buildingId
	*	@param buildingId 
	*	@return [ { employeeId, firstName, surname, title, cellphone, email, companyId, buildingId, passwordId } ]
	*/
	async getEmployeesByBuildingId(buildingId) {
		var query = 'SELECT * FROM ' + this.mva["employee"] + ' WHERE buildingId = $1';

		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [buildingId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Employee with that matching buildingId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved employees", false, true);
				for (var i = 0; i < res.rows.length; i++) {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	//CR

	//UD

	/**
	* Update the details of the employee with the given ID based on the input parameters.
	* Parameters passed as undefined are ignored in the update (i.e. they are not updated), 
	* for all other paramter values (including null) an update attempt will be made in the database
	* @param employeeId
	* @param firstName
	* @param surname
	* @param title The title of the employee e.g. Mrs
	* @param cellphone
	* @param email
	* @param companyId
	* @param buildingId
	* @param passwordId
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
		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated employee", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
    * Deletes an employee given an ID
    * @param employeeId
	* @return {success, message, data : null}
    */
	async deleteEmployee(employeeId) {
		if (!this.validateNumeric(employeeId)) {
			return this.buildDefaultResponseObject(false, "Invalid employee ID provided", true);
		}

		var query = this.constructDelete("Employee", "employeeId");
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [employeeId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted employee", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}


	//Client

	/**
	*	Creates a new client
	*	@param macAddress 
	*	@return { clientId }
	*/
	async createClient(macAddress) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ macAddress })[0], macAddress, c, v);

		var ret = null;
		let res;
		try {
			res = await this.client.query(this.constructInsert("Client", "clientId", c, v), v);
			ret = this.buildDefaultResponseObject(true, "Successfully added client", false, false);
			ret.data.clientId = res.rows[0].clientid;
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}

	}

	/**
	*	Retrieves a client using clientId
	*	@param clientId 
	*	@return { clientId, macAddress }
	*/
	async getClientByClientId(clientId) {
		var query = 'SELECT * FROM ' + this.mva["client"] + ' WHERE clientId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [clientId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Client with that matching clientId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved client", false, false);
				ret.data.clientId = res.rows[0].clientid;
				ret.data.macAddress = res.rows[0].macaddress;
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a client using macAddress
	*	@param macAddress 
	*	@return { clientId, macAddress }
	*/
	async getClientByMacAddress(macAddress) {
		var query = 'SELECT * FROM ' + this.mva["client"] + ' WHERE macAddress = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [macAddress]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Client with that matching macAddress");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved client", false, false);
				ret.data.clientId = res.rows[0].clientid;
				ret.data.macAddress = res.rows[0].macaddress;
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	* Update the details of the client with the given ID based on the input parameters.
	* Parameters passed as undefined are ignored in the update (i.e. they are not updated), 
	* for all other paramter values (including null) an update attempt will be made in the database
	* @param clientId
	* @param macAddress
	* @return {success, message, data : null}
	*/
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
		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated client", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
    * Deletes a client given an ID
    * @param clientId
	* @return {success, message, data : null}
    */
	async deleteClient(clientId) {
		if (!this.validateNumeric(clientId)) {
			return this.buildDefaultResponseObject(false, "Invalid client ID provided", true);
		}

		var query = this.constructDelete("Client", "clientId");
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [clientId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted client", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Creates a new wifiparams
	*	@param ssid 
	*	@param networkType 
	*	@param password 
	*
	*	@return { wifiParamsId }
	*/
	async createWiFiParams(ssid, networkType, password) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ ssid })[0], ssid, c, v);
		this.bigAppend(Object.keys({ networkType })[0], networkType, c, v);
		this.bigAppend(Object.keys({ password })[0], password, c, v);

		var ret = null;
		let res;
		try {
			res = await this.client.query(this.constructInsert("WiFiParams", "wifiParamsId", c, v), v);
			ret = this.buildDefaultResponseObject(true, "Successfully added wifiparams", false, false);
			ret.data.wifiParamsId = res.rows[0].wifiparamsid;
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}

	}

	/**
	*	Retrieves a wifiparams using wifiParamsId
	*	@param wifiParamsId 
	*	@return { wifiParamsId, ssid, networkType, password }
	*/
	async getWiFiParamsByWifiParamsId(wifiParamsId) {
		var query = 'SELECT * FROM ' + this.mva["wifiparams"] + ' WHERE wifiParamsId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [wifiParamsId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in WiFiParams with that matching wifiParamsId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved wifiparams", false, false);
				ret.data.wifiParamsId = res.rows[0].wifiparamsid;
				ret.data.ssid = res.rows[0].ssid;
				ret.data.networkType = res.rows[0].networktype;
				ret.data.password = res.rows[0].password;
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	* Update the details of the WiFi parameters with the given ID based on the input parameters.
	* Parameters passed as undefined are ignored in the update (i.e. they are not updated), 
	* for all other paramter values (including null) an update attempt will be made in the database
	* @param wifiParamsId
	* @param ssid
	* @param networkType
	* @param password
	* @return {success, message, data : null}
	*/
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
		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated WiFi params", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
    * Deletes WiFi Parameters given an ID
    * @param wifiParamsId
	* @return {success, message, data : null}
    */
	async deleteWiFiParams(wifiParamsId) {
		if (!this.validateNumeric(wifiParamsId)) {
			return this.buildDefaultResponseObject(false, "Invalid WiFi Params ID provided", true);
		}

		var query = this.constructDelete("WiFiParams", "wifiParamsId");
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [wifiParamsId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted WiFi Params", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Creates a new tempwifiaccess
	*	@param wifiParamsId 
	*	@return { tempWifiAccessId }
	*/
	async createTempWifiAccess(wifiParamsId) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ wifiParamsId })[0], wifiParamsId, c, v);

		var ret = null;
		let res;
		try {
			res = await this.client.query(this.constructInsert("TempWifiAccess", "tempWifiAccessId", c, v), v);
			ret = this.buildDefaultResponseObject(true, "Successfully added tempwifiaccess", false, false);
			ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}

	}

	/**
	*	Retrieves a tempwifiaccess using tempWifiAccessId
	*	@param tempWifiAccessId 
	*	@return { tempWifiAccessId, wifiParamsId }
	*/
	async getTempWifiAccessByTempWifiAccessId(tempWifiAccessId) {
		var query = 'SELECT * FROM ' + this.mva["tempwifiaccess"] + ' WHERE tempWifiAccessId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [tempWifiAccessId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in TempWifiAccess with that matching tempWifiAccessId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tempwifiaccess", false, false);
				ret.data.tempWifiAccessId = res.rows[0].tempwifiaccessid;
				ret.data.wifiParamsId = res.rows[0].wifiparamsid;
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a set of tempwifiaccesss using wifiParamsId
	*	@param wifiParamsId 
	*	@return [ { tempWifiAccessId, wifiParamsId } ]
	*/
	async getTempWifiAccesssByWifiParamsId(wifiParamsId) {
		var query = 'SELECT * FROM ' + this.mva["tempwifiaccess"] + ' WHERE wifiParamsId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [wifiParamsId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in TempWifiAccess with that matching wifiParamsId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tempwifiaccesss", false, true);
				for (var i = 0; i < res.rows.length; i++) {
					var obj = {};

					obj.tempWifiAccessId = res.rows[i].tempwifiaccessid;
					obj.wifiParamsId = res.rows[i].wifiparamsid;

					ret.data.push(obj);
				}
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}


	/**
	* Update the details of the Temporary WiFi Access WiFi parameters with the given ID based on the input parameters.
	* Parameters passed as undefined are ignored in the update (i.e. they are not updated), 
	* for all other paramter values (including null) an update attempt will be made in the database
	* @param tempWifiAccessId
	* @param wifiParamsId
	* @return {success, message, data : null}
	*/
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
		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated Temp WiFi Access params", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
    * Deletes temporary WiFi access given an ID
    * @param tempWifiAccessId
	* @return {success, message, data : null}
    */
	async deleteTempWifiAccess(tempWifiAccessId) {
		if (!this.validateNumeric(tempWifiAccessId)) {
			return this.buildDefaultResponseObject(false, "Invalid Temp Wifi Access ID provided", true);
		}

		var query = this.constructDelete("TempWifiAccess", "tempWifiAccessId");
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [tempWifiAccessId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted Temp Wifi Access", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Creates a new visitorpackage
	*	@param tempWifiAccessId 
	*	@param tpaId 
	*	@param linkWalletId 
	*	@param employeeId 
	*	@param clientId 
	*	@param startTime 
	*	@param endTime 
	*	@return { visitorPackageId }
	*/
	async createVisitorPackage(tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ tempWifiAccessId })[0], tempWifiAccessId, c, v);
		this.bigAppend(Object.keys({ tpaId })[0], tpaId, c, v);
		this.bigAppend(Object.keys({ linkWalletId })[0], linkWalletId, c, v);
		this.bigAppend(Object.keys({ employeeId })[0], employeeId, c, v);
		this.bigAppend(Object.keys({ clientId })[0], clientId, c, v);
		this.bigAppend(Object.keys({ startTime })[0], startTime, c, v);
		this.bigAppend(Object.keys({ endTime })[0], endTime, c, v);

		var ret = null;
		let res;
		try {
			res = await this.client.query(this.constructInsert("VisitorPackage", "visitorPackageId", c, v), v);
			ret = this.buildDefaultResponseObject(true, "Successfully added visitorpackage", false, false);
			ret.data.visitorPackageId = res.rows[0].visitorpackageid;
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}

	}

	/**
	*	Retrieves a visitorpackage using visitorPackageId
	*	@param visitorPackageId 
	*	@return { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime }
	*/
	async getVisitorPackageByVisitorPackageId(visitorPackageId) {
		var query = 'SELECT * FROM ' + this.mva["visitorpackage"] + ' WHERE visitorPackageId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [visitorPackageId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching visitorPackageId");
				return ret;
			}
			else {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a visitorpackage using tempWifiAccessId
	*	@param tempWifiAccessId 
	*	@return { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime }
	*/
	async getVisitorPackageByTempWifiAccessId(tempWifiAccessId) {
		var query = 'SELECT * FROM ' + this.mva["visitorpackage"] + ' WHERE tempWifiAccessId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [tempWifiAccessId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching tempWifiAccessId");
				return ret;
			}
			else {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a visitorpackage using tpaId
	*	@param tpaId 
	*	@return { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime }
	*/
	async getVisitorPackageByTpaId(tpaId) {
		var query = 'SELECT * FROM ' + this.mva["visitorpackage"] + ' WHERE tpaId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [tpaId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching tpaId");
				return ret;
			}
			else {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a visitorpackage using linkWalletId
	*	@param linkWalletId 
	*	@return { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime }
	*/
	async getVisitorPackageByLinkWalletId(linkWalletId) {
		var query = 'SELECT * FROM ' + this.mva["visitorpackage"] + ' WHERE linkWalletId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [linkWalletId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching linkWalletId");
				return ret;
			}
			else {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a set of visitorpackages using employeeId
	*	@param employeeId 
	*	@return [ { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime } ]
	*/
	async getVisitorPackagesByEmployeeId(employeeId) {
		var query = 'SELECT * FROM ' + this.mva["visitorpackage"] + ' WHERE employeeId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [employeeId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching employeeId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackages", false, true);
				for (var i = 0; i < res.rows.length; i++) {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a set of visitorpackages using clientId
	*	@param clientId 
	*	@return [ { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime } ]
	*/
	async getVisitorPackagesByClientId(clientId) {
		var query = 'SELECT * FROM ' + this.mva["visitorpackage"] + ' WHERE clientId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [clientId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in VisitorPackage with that matching clientId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved visitorpackages", false, true);
				for (var i = 0; i < res.rows.length; i++) {
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
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	* Update the details of the Visitor Package with the given ID based on the input parameters.
	* Parameters passed as undefined are ignored in the update (i.e. they are not updated), 
	* for all other paramter values (including null) an update attempt will be made in the database
	* @param visitorPackageId
	* @param tempWifiAccessId
	* @param tpaId Temporary Access ID
	* @param linkWalletId
	* @param employeeId
	* @param clientId
	* @param startTime
	* @param endTime
	* @return {success, message, data : null}
	*/
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
		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated Visitor Package", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
    * Deletes a visitor package given an ID
    * @param visitorPackageId
	* @return {success, message, data : null}
    */
	async deleteVisitorPackage(visitorPackageId) {
		if (!this.validateNumeric(visitorPackageId)) {
			return this.buildDefaultResponseObject(false, "Invalid Visitor Package ID provided", true);
		}

		var query = this.constructDelete("VisitorPackage", "visitorPackageId");
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [visitorPackageId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted Visitor Package", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Creates a new tpa
	*	@return { tpaId }
	*/
	async createTPA() {
		var c = [];
		var v = [];

		var ret = null;
		var query = "INSERT INTO TPA DEFAULT VALUES RETURNING tpaid";
		let res;
		try {
			res = await this.client.query(query, v);
			ret = this.buildDefaultResponseObject(true, "Successfully added tpa", false, false);
			ret.data.tpaId = res.rows[0].tpaid;
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}

	}

	/**
	*	Retrieves a tpa using tpaId
	*	@param tpaId 
	*	@return { tpaId }
	*/
	async getTPAByTpaId(tpaId) {
		var query = 'SELECT * FROM ' + this.mva["tpa"] + ' WHERE tpaId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [tpaId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in TPA with that matching tpaId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tpa", false, false);
				ret.data.tpaId = res.rows[0].tpaid;
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}


	/**
    * Deletes a Temporary Physical Access entry given an ID
    * @param tpaId
	* @return {success, message, data : null}
    */
	async deleteTPA(tpaId) {
		if (!this.validateNumeric(tpaId)) {
			return this.buildDefaultResponseObject(false, "Invalid TPA ID provided", true);
		}

		var query = this.constructDelete("TPA", "tpaId");
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [tpaId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted TPA entry", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Creates a new tpaxroom
	*	@param tpaId 
	*	@param roomId 
	*	@return { tpaId }
	*/
	async createTPAxRoom(tpaId, roomId) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ tpaId })[0], tpaId, c, v);
		this.bigAppend(Object.keys({ roomId })[0], roomId, c, v);

		var ret = null;

		var query = "INSERT INTO TPAxRoom(tpaId,roomId) VALUES ($1,$2) RETURNING CONCAT(tpaId, '_', roomId) AS tpaxroomid;";
		let res;
		try {
			res = await this.client.query(query, v);
			ret = this.buildDefaultResponseObject(true, "Successfully added tpaxroom", false, false);
			ret.data.tpaxroomId = res.rows[0].tpaxroomid;
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}

	}

	/**
	*	Retrieves a set tpaxrooms using tpaId
	*	@param tpaId 
	*	@return [ { tpaId, roomId } ]
	*/
	async getTPAxRoomsByTpaId(tpaId) {
		var query = 'SELECT * FROM ' + this.mva["tpaxroom"] + ' WHERE tpaId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [tpaId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in TPAxRoom with that matching tpaId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tpaxrooms", false, true);
				for (var i = 0; i < res.rows.length; i++) {
					var obj = {};

					obj.tpaId = res.rows[i].tpaid;
					obj.roomId = res.rows[i].roomid;

					ret.data.push(obj);
				}
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a set tpaxrooms using roomId
	*	@param roomId 
	*	@return [ { tpaId, roomId } ]
	*/
	async getTPAxRoomsByRoomId(roomId) {
		var query = 'SELECT * FROM ' + this.mva["tpaxroom"] + ' WHERE roomId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [roomId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in TPAxRoom with that matching roomId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved tpaxrooms", false, true);
				for (var i = 0; i < res.rows.length; i++) {
					var obj = {};

					obj.tpaId = res.rows[i].tpaid;
					obj.roomId = res.rows[i].roomid;

					ret.data.push(obj);
				}
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}



	//note this function is slightly different to others, see parameter list
	/**
	* Update the details of the TPAxRoom table. In order to identify the record to be updated 
	* two "current" IDs are required. Then the "potentiallyChanged" parameters behave as follows:
	* "potentiallyChanged" parameters passed as undefined are ignored in the update (i.e. they are not updated), 
	* for all other paramter values (including null) an update attempt will be made in the database
	* @param currentTpaId 
	* @param currentRoomId 
	* @param potentiallyChangedTpaId 
	* @param potentiallyChangedRoomId 
	* @return {success, message, data : null}
 	*/
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

		var ret = null;
		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated TPAxRoom", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}


	/**
    * Deletes a TPAxRoom entry given the two IDs (required as this is a composite key)
    * @param tpaId
	* @param roomId
	* @return {success, message, data : null}
    */
	async deleteTPAxRoom(tpaId, roomId) {
		if (!this.validateNumeric(tpaId) || !this.validateNumeric(roomId)) {
			return this.buildDefaultResponseObject(false, "Invalid TPA ID OR Room ID provided", true);
		}

		var query = "DELETE FROM TPAxRoom WHERE tpaId = $1 AND roomId = $2";
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [tpaId, roomId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted TPAxRoom entry", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Creates a new wallet
	*	@param maxLimit 
	*	@param spent 
	*	@return { linkWalletId }
	*/
	async createWallet(maxLimit, spent) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ maxLimit })[0], maxLimit, c, v);
		this.bigAppend(Object.keys({ spent })[0], spent, c, v);

		var ret = null;
		let res;
		try {
			res = await this.client.query(this.constructInsert("Wallet", "linkWalletId", c, v), v);
			ret = this.buildDefaultResponseObject(true, "Successfully added wallet", false, false);
			ret.data.linkWalletId = res.rows[0].linkwalletid;
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}

	}

	/**
	*	Retrieves a wallet using linkWalletId
	*	@param linkWalletId 
	*	@return { linkWalletId, maxLimit, spent }
	*/
	async getWalletByLinkWalletId(linkWalletId) {
		var query = 'SELECT * FROM ' + this.mva["wallet"] + ' WHERE linkWalletId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [linkWalletId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Wallet with that matching linkWalletId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved wallet", false, false);
				ret.data.linkWalletId = res.rows[0].linkwalletid;
				ret.data.maxLimit = res.rows[0].maxlimit;
				ret.data.spent = res.rows[0].spent;
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	* Update the details of the Wallet with the given ID based on the input parameters.
	* Parameters passed as undefined are ignored in the update (i.e. they are not updated), 
	* for all other paramter values (including null) an update attempt will be made in the database
	* @param linkwalletId
	* @param maxLimit
	* @param spent
	* @return {success, message, data : null}
	*/
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
		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated Wallet", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
    * Deletes a wallet given an ID
    * @param linkwalletId
	* @return {success, message, data : null}
    */
	async deleteWallet(linkwalletId) {
		if (!this.validateNumeric(linkwalletId)) {
			return this.buildDefaultResponseObject(false, "Invalid Wallet ID provided", true);
		}

		var query = this.constructDelete("Wallet", "linkwalletId");
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [linkwalletId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted Wallet", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}


	//new for payment!


	/**
	*	Creates a new nfcPaymentPoint
	*	@param buildingId 
	*	@param description 
	*	@return { nfcPaymentPointId }
	*/
	async createNfcPaymentPoint(buildingId, description) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ buildingId })[0], buildingId, c, v);
		this.bigAppend(Object.keys({ description })[0], description, c, v);

		var ret = null;
		let res;
		try {
			res = await this.client.query(this.constructInsert("NfcPaymentPoints", "nfcPaymentPointId", c, v), v);
			ret = this.buildDefaultResponseObject(true, "Successfully added nfcpaymentpoint", false, false);
			ret.data.nfcPaymentPointId = res.rows[0].nfcpaymentpointid;
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}

	}



	/**
	*	Retrieves a nfcPaymentPoint using nfcPaymentPointId
	*	@param nfcPaymentPointId 
	*	@return { nfcPaymentPointId, buildingId, description }
	*/
	async getNfcPaymentPointByNfcPaymentPointId(nfcPaymentPointId) {
		var query = 'SELECT * FROM ' + this.mva["nfcpaymentpoints"] + ' WHERE nfcPaymentPointId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [nfcPaymentPointId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in NfcPaymentPoints with that matching nfcPaymentPointId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved nfcPaymentPoint", false, false);
				ret.data.nfcPaymentPointId = res.rows[0].nfcpaymentpointid;
				ret.data.buildingId = res.rows[0].buildingid;
				ret.data.description = res.rows[0].description;
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a set of nfcPaymentPoints using buildingId
	*	@param buildingId 
	*	@return [ { nfcPaymentPointId, buildingId, description } ]
	*/
	async getNfcPaymentPointsByBuildingId(buildingId) {
		var query = 'SELECT * FROM ' + this.mva["nfcpaymentpoints"] + ' WHERE buildingId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [buildingId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in NfcPaymentPoints with that matching buildingId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved nfcPaymentPoints", false, true);
				for (var i = 0; i < res.rows.length; i++) {
					var obj = {};

					obj.nfcPaymentPointId = res.rows[i].nfcpaymentpointid;
					obj.buildingId = res.rows[i].buildingid;
					obj.description = res.rows[i].description;

					ret.data.push(obj);
				}
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}


	/**
	* Update the details of the NFC Payment Point with the given ID based on the input parameters.
	* Parameters passed as undefined are ignored in the update (i.e. they are not updated), 
	* for all other paramter values (including null) an update attempt will be made in the database
	* @param nfcPaymentPointId
	* @param buildingId
	* @param description
	* @return {success, message, data : null}
	*/
	async updateNfcPaymentPoint(nfcPaymentPointId, buildingId, description) {
		if (!this.validateNumeric(nfcPaymentPointId)) {
			return this.buildDefaultResponseObject(false, "Invalid NFC Payment Point ID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["buildingId", "description"], [buildingId, description], paramNames, paramValues);

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}

		var query = this.constructUpdate("NfcPaymentPoints", paramNames, "nfcPaymentPointId", nfcPaymentPointId);
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated NFC Payment Point", true);
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
    * Deletes a NFC Payment Point given an ID
    * @param nfcPaymentPointId
	* @return {success, message, data : null}
    */
	async deleteNfcPaymentPoint(nfcPaymentPointId) {
		if (!this.validateNumeric(nfcPaymentPointId)) {
			return this.buildDefaultResponseObject(false, "Invalid NFC Payment Point ID provided", true);
		}

		var query = this.constructDelete("NfcPaymentPoints", "nfcPaymentPointId");
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [nfcPaymentPointId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted NFC Payment Point", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}



	/**
	*	Creates a new transaction
	*	@param walletId 
	*	@param amount 
	*	@param nfcPaymentPointId 
	*	@param transactionTime 
	*	@param description 
	*	@return { transactionId }
	*/
	async createTransaction(walletId, amount, nfcPaymentPointId, transactionTime, description) {
		var c = [];
		var v = [];

		this.bigAppend(Object.keys({ walletId })[0], walletId, c, v);
		this.bigAppend(Object.keys({ amount })[0], amount, c, v);
		this.bigAppend(Object.keys({ nfcPaymentPointId })[0], nfcPaymentPointId, c, v);
		this.bigAppend(Object.keys({ transactionTime })[0], transactionTime, c, v);
		this.bigAppend(Object.keys({ description })[0], description, c, v);

		var ret = null;
		let res;
		try {
			res = await this.client.query(this.constructInsert("Transaction", "transactionId", c, v), v);
			ret = this.buildDefaultResponseObject(true, "Successfully added transaction", false, false);
			ret.data.transactionId = res.rows[0].transactionid;
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}

	}



	/**
	*	Retrieves a transaction using transactionId
	*	@param transactionId 
	*	@return { transactionId, walletId, amount, nfcPaymentPointId, transactionTime, description }
	*/
	async getTransactionByTransactionId(transactionId) {
		var query = 'SELECT * FROM ' + this.mva["transaction"] + ' WHERE transactionId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [transactionId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Transaction with that matching transactionId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved Transaction", false, false);
				ret.data.transactionId = res.rows[0].transactionid;
				ret.data.walletId = res.rows[0].walletid;
				ret.data.amount = res.rows[0].amount;
				ret.data.nfcPaymentPointId = res.rows[0].nfcpaymentpointid;
				ret.data.transactionTime = res.rows[0].transactiontime;
				ret.data.description = res.rows[0].description;
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a set of transactions using walletId
	*	@param walletId 
	*	@return [ { transactionId, walletId, amount, nfcPaymentPointId, transactionTime, description } ]
	*/
	async getTransactionsByWalletId(walletId) {
		var query = 'SELECT * FROM ' + this.mva["transaction"] + ' WHERE walletId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [walletId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Transaction with that matching walletId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved transactions", false, true);
				for (var i = 0; i < res.rows.length; i++) {
					var obj = {};

					obj.transactionId = res.rows[i].transactionid;
					obj.walletId = res.rows[i].walletid;
					obj.amount = res.rows[i].amount;
					obj.nfcPaymentPointId = res.rows[i].nfcpaymentpointid;
					obj.transactionTime = res.rows[i].transactiontime;
					obj.description = res.rows[i].description;

					ret.data.push(obj);
				}
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a set of transactions using nfcPaymentPointId
	*	@param nfcPaymentPointId 
	*	@return [ { transactionId, walletId, amount, nfcPaymentPointId, transactionTime, description } ]
	*/
	async getTransactionsByNfcPaymentPointId(nfcPaymentPointId) {
		var query = 'SELECT * FROM ' + this.mva["transaction"] + ' WHERE nfcPaymentPointId = $1';

		var ret = null;


		let res;
		try {
			res = await this.client.query(query, [nfcPaymentPointId]);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no rows in Transaction with that matching nfcPaymentPointId");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved transactions", false, true);
				for (var i = 0; i < res.rows.length; i++) {
					var obj = {};

					obj.transactionId = res.rows[i].transactionid;
					obj.walletId = res.rows[i].walletid;
					obj.amount = res.rows[i].amount;
					obj.nfcPaymentPointId = res.rows[i].nfcpaymentpointid;
					obj.transactionTime = res.rows[i].transactiontime;
					obj.description = res.rows[i].description;

					ret.data.push(obj);
				}
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	* Update the details of the Transaction with the given ID based on the input parameters.
	* Parameters passed as undefined are ignored in the update (i.e. they are not updated), 
	* for all other paramter values (including null) an update attempt will be made in the database
	* @param transactionId
	* @param walletId
	* @param amount
	* @param nfcPaymentPointId
	* @param transactionTime
	* @param description
	* @return {success, message, data : null}
	*/
	async updateTransaction(transactionId, walletId, amount, nfcPaymentPointId, transactionTime, description) {
		if (!this.validateNumeric(transactionId)) {
			return this.buildDefaultResponseObject(false, "Invalid Transaction ID provided", true);
		}

		var paramNames = [];
		var paramValues = [];

		this.setValidParams(["walletId", "amount", "nfcPaymentPointId", "transactionTime", "description"], [walletId, amount, nfcPaymentPointId, transactionTime, description], paramNames, paramValues);

		if (paramValues.length !== paramNames.length || paramNames.length === 0) {
			return this.buildDefaultResponseObject(false, "No valid parameters provided for update", true);
		}

		var query = this.constructUpdate("Transaction", paramNames, "transactionId", transactionId);
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, paramValues);
			ret = this.buildDefaultResponseObject(true, "Successfully updated Transaction", true);
			return ret;
		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
    * Deletes a Transaction given an ID
    * @param transactionId
	* @return {success, message, data : null}
    */
	async deleteTransaction(transactionId) {
		if (!this.validateNumeric(transactionId)) {
			return this.buildDefaultResponseObject(false, "Invalid Transaction ID provided", true);
		}

		var query = this.constructDelete("Transaction", "transactionId");
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, [transactionId]);
			ret = this.buildDefaultResponseObject(true, "Successfully deleted Transaction", true);
			return ret;

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}
	}

	/**
	*	Retrieves a set of transactions (with reporting information) for the specified company. 
	*	By default all transactions are returned unless date time constraints are provided or an employee username is specified
	*	@param companyId
	*	@param startDate Date Object (optional) Starting date to retrieve transactions for
	*	@param endDate Date Object (optional) Ending date to retrieve transactions for
	*	@param employeeUsername string (optional) Username of the employee
	*	@return [ {employeeName, employeeSurname, employeeEmail, amountSpent, paymentDesc, paymentPointDesc, transactiontime  } ]
	*/
	async getAllTransactionsByCompanyId(companyId, startDate, endDate, employeeUsername) {
		if (!this.validateNumeric(companyId)) {
			return this.buildDefaultResponseObject(false, "Invalid Company ID provided", true);
		}

		let hasStart = false;
		let hasEnd = false;
		if (startDate) {
			if (this.isValidDate(startDate))
				hasStart = true;
			else
				return this.buildDefaultResponseObject(false, "Invalid Start Date provided", true);
		}

		if (endDate) {
			if (this.isValidDate(endDate))
				hasEnd = true;
			else
				return this.buildDefaultResponseObject(false, "Invalid End Date provided", true);
		}

		let whereStatement = "WHERE c.companyId = $1";
		let paramsArray = [companyId];
		if (hasStart) {
			if (hasEnd) {
				//have start and end date
				if (startDate <= endDate) {
					whereStatement += " AND transactiontime >= $2 AND transactiontime <= $3";
					paramsArray.push(startDate);
					paramsArray.push(endDate);
				} else {
					return this.buildDefaultResponseObject(false, "Start date is greater than end date", true);
				}
			} else {
				//just have a start date
				whereStatement += " AND transactiontime >= $2";
				paramsArray.push(startDate);
			}
		} else if (hasEnd) {
			//just have an end date
			whereStatement += " AND transactiontime <= $2";
			paramsArray.push(endDate);
		}
		
		
		let fromStatement = `FROM ((((${this.mva["company"]} c INNER JOIN ${this.mva["employee"]} e ON c.companyId = e.companyId)
								INNER JOIN ${this.mva["visitorpackage"]} v ON e.employeeId = v.employeeId)
								INNER JOIN ${this.mva["transaction"]} t ON v.linkwalletid = t.walletId)
								INNER JOIN ${this.mva["nfcpaymentpoints"]} n ON t.nfcpaymentpointid = n.nfcpaymentpointid)`;
		if (employeeUsername) {
			//extra joins required to narrow down by employee
			fromStatement = `FROM (((((${this.mva["company"]} c INNER JOIN ${this.mva["employee"]} e ON c.companyId = e.companyId)
								INNER JOIN ${this.mva["visitorpackage"]} v ON e.employeeId = v.employeeId)
			 					INNER JOIN ${this.mva["password"]} p ON e.passwordId = p.passwordId )
								INNER JOIN ${this.mva["transaction"]} t ON v.linkwalletid = t.walletId)
								INNER JOIN ${this.mva["nfcpaymentpoints"]} n ON t.nfcpaymentpointid = n.nfcpaymentpointid)`
			paramsArray.push(employeeUsername);
			whereStatement += " AND username = $" + (paramsArray.length);
		}

		let query = `SELECT firstname AS "employeeName", surname AS "employeeSurname", email AS "employeeEmail", amount AS "amountSpent",
						t.description AS "paymentDesc", n.description AS "paymentPointDesc", transactiontime AS "transactiontime"
					${fromStatement}
					${whereStatement}
					ORDER BY transactiontime DESC;`;
		var ret = null;
		let res;
		try {
			res = await this.client.query(query, paramsArray);
			if (res.rows.length == 0) {
				ret = this.returnDatabaseError("no transactions found");
				return ret;
			}
			else {
				ret = this.buildDefaultResponseObject(true, "Successfully retrieved transactions", false, true);
				for (var i = 0; i < res.rows.length; i++) {
					var obj = {};

					obj.employeeName = res.rows[i].employeeName;
					obj.employeeSurname = res.rows[i].employeeSurname;
					obj.employeeEmail = res.rows[i].employeeEmail;
					obj.amountSpent = res.rows[i].amountSpent;
					obj.paymentDesc = res.rows[i].paymentDesc;
					obj.paymentPointDesc = res.rows[i].paymentPointDesc;
					obj.transactiontime = res.rows[i].transactiontime;

					ret.data.push(obj);
				}
				return ret;
			}

		}
		catch (err) {
			console.log(err.stack);
			ret = this.returnDatabaseError(err);
			return ret;
		}

	}




	//Jared Helpers
	/**
	 * Helper function for the Inserts performed in the database. It creates the insert statement based on the tablename,
	 * the id field of the table, and the values of the columns, and returns that query string.
	 * @param tableName The name of the table to be inserted into
	 * @param tableIdName The name of the id field of that table
	 * @param columns An array containing all column names of that table except id
	 * @param values An array containing all values to be inserted into the parallel column in columns
	 * @return string The query string
	 */
	constructInsert(tableName, tableIdName, columns, values) {
		var query = "INSERT INTO " + this.mva[tableName.toLowerCase()] + "(";
		var columnsString = columns.join(',');
		var prepVals = [];
		for (var i = 1; i <= values.length; i++) {
			if ((typeof values[i - 1]) === 'string' && !values[i - 1].startsWith("201")) {
				prepVals.push("$" + i + "::text");
			}
			else {
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

	/**
	 * Helper function for the Inserts performed in the database. It takes in 2 values and 2 lists,
	 * and inserts the first value into the first list, and the second value into the second list
	 * @param val1 The value to be inserted into list1
	 * @param val2 The value to be inserted into list2
	 * @param list1 An array that val1 will be inserted in, at the end
	 * @param list2 An array that val2 will be inserted in, at the end
	 */
	bigAppend(val1, val2, list1, list2) {
		list1.push(val1);
		list2.push(val2);
	}

	//Savva Helpers
	/**
	 * Helper function for the Updates performed in the database. This trims the arrays based on if values are provided as 
	 * undefined. Therefore the "potential" arrays have all names/values with certain values being undefined and the "actual" 
	 * arrays only include the names/values that are not undefined
	 * @param potentialParamNames Array of potential parameter names to be updated (attributes in the respective table)
	 * @param potentialParamValues Array of potential parameter values to be updated corresponding to the potentialParamNames array
	 * @param actualParamNames Initially empty array which gets populated with the actual parameters to be updated
	 * @param actualParamValues Initially empty array whih gets populated with the actual parameter values to be updated
	 */
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

	/**
	 * Helper function for the Updates performed in the database.
	 * Constructs the SQL update statement given the parameters
	 * @param tableName
	 * @param paramList Array of parameter names to be updated (i.e. column names)
	 * @param idName Name of the column ID that uniquely identifies a record
	 * @param idValue Value of the column ID that uniquely identifies a record
	 */
	constructUpdate(tableName, paramList, idName, idValue) {
		var query = "UPDATE " + this.mva[tableName.toLowerCase()] + " SET ";

		for (var i = 1; i < paramList.length + 1; i++) {
			if (i !== paramList.length) {
				query += paramList[i - 1] + " = $" + i + ",";
			} else {
				query += paramList[i - 1] + " = $" + i;
			}
		}

		query += " WHERE " + idName + " = " + idValue;
		return query;
	}

	/**
	 * Helper function for the deletes performed in the database.
	 * Constructs the SQL delete statement given the parameters
	 * @param tableName
	 * @param idName Name of the column ID that uniquely identifies a record
	 */
	constructDelete(tableName, idName) {
		return "DELETE FROM " + this.mva[tableName.toLowerCase()] + " WHERE " + idName + " = $1";
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
	/**
	 * Checks if the parameter is a valid date
	 * @param date The parameter that will be checked for being a date
	 * @return boolean Will return true if the parameter is a date, false otherwise
	 */
	isValidDate(date) {
		return date instanceof Date && !isNaN(date);
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
}

module.exports = CrudController;
