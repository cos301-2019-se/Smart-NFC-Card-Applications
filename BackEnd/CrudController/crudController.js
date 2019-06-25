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
	*	@param function(return)
	*	@return { companyId }
	*/
	createCompany(companyName,companyWebsite,passwordId,callback)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({companyName})[0], companyName, c, v);
		this.bigAppend(Object.keys({companyWebsite})[0], companyWebsite, c, v);
		this.bigAppend(Object.keys({passwordId})[0], passwordId, c, v);
					
		var ret = null;
		
		this.client.query(this.constructInsert("Company", "companyId", c, v),
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
				ret = this.buildDefaultResponseObject(true, "Successfully added company", false, false);
				ret.data.companyId = res.rows[0].companyid;
				//this.client.end();
				callback(ret);
			}
		});		
		
	}
	

	
	
    //CR

    //UD
	
	
	
	//Building
	
	/**
	*	Creates a new building
	*	@param latitude 
	*	@param longitude 
	*	@param branchName 
	*	@param companyId 
	*	@param wifiParamsId 
	*	@param function(return)
	*	@return { buildingId }
	*/
	createBuilding(latitude,longitude,branchName,companyId,wifiParamsId,callback)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({latitude})[0], latitude, c, v);
		this.bigAppend(Object.keys({longitude})[0], longitude, c, v);
		this.bigAppend(Object.keys({branchName})[0], branchName, c, v);
		this.bigAppend(Object.keys({companyId})[0], companyId, c, v);
		this.bigAppend(Object.keys({wifiParamsId})[0], wifiParamsId, c, v);
					
		var ret = null;
		
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
		});		
		
	}
	
	
    //CR
    
    //UD
	
	
	
	//Password
	
	/**
	*	Creates a new password
	*	@param username 
	*	@param hash 
	*	@param salt 
	*	@param apiKey 
	*	@param expirationDate 
	*	@param function(return)
	*	@return { passwordId }
	*/
	createPassword(username,hash,salt,apiKey,expirationDate,callback)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({username})[0], username, c, v);
		this.bigAppend(Object.keys({hash})[0], hash, c, v);
		this.bigAppend(Object.keys({salt})[0], salt, c, v);
		this.bigAppend(Object.keys({apiKey})[0], apiKey, c, v);
		this.bigAppend(Object.keys({expirationDate})[0], expirationDate, c, v);
					
		var ret = null;
		
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
		});		
		
	}
	
    //CR
    
    //UD
	
	
	
	//Room
	
	/**
	*	Creates a new room
	*	@param roomName 
	*	@param parentRoomList 
	*	@param buildingId 
	*	@param function(return)
	*	@return { roomId }
	*/
	createRoom(roomName,parentRoomList,buildingId,callback)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({roomName})[0], roomName, c, v);
		this.bigAppend(Object.keys({parentRoomList})[0], parentRoomList, c, v);
		this.bigAppend(Object.keys({buildingId})[0], buildingId, c, v);
					
		var ret = null;
		
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
		});		
		
	}
	
    //CR
    
    //UD
	
	
	
	//NFCAccessPoints
	
	/**
	*	Creates a new nfcaccesspoints
	*	@param roomId 
	*	@param function(return)
	*	@return { nfcReaderId }
	*/
	createNFCAccessPoints(roomId,callback)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({roomId})[0], roomId, c, v);
					
		var ret = null;
		
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
		});		
		
	}
	
	
    //CR
    
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
	*	@param function(return)
	*	@return { employeeId }
	*/
	createEmployee(firstName,surname,title,cellphone,email,companyId,buildingId,passwordId,callback)
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
		});		
		
	}

    //CR
    
    //UD
	
	
	
	//Client
	
	/**
	*	Creates a new client
	*	@param macAddress 
	*	@param function(return)
	*	@return { clientId }
	*/
	createClient(macAddress,callback)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({macAddress})[0], macAddress, c, v);
					
		var ret = null;
		
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
		});		
		
	}
	
    //CR
    
    //UD
	
	
	//WiFiParams
	
	/**
	*	Creates a new wifiparams
	*	@param ssid 
	*	@param networkType 
	*	@param password 
	*	@param function(return)
	*	@return { wifiParamsId }
	*/
	createWiFiParams(ssid,networkType,password,callback)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({ssid})[0], ssid, c, v);
		this.bigAppend(Object.keys({networkType})[0], networkType, c, v);
		this.bigAppend(Object.keys({password})[0], password, c, v);
					
		var ret = null;
		
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
		});		
		
	}
	
    //CR
    
    //UD
	
	
	//TempWifiAccess
	
	/**
	*	Creates a new tempwifiaccess
	*	@param wifiParamsId 
	*	@param function(return)
	*	@return { tempWifiAccessId }
	*/
	createTempWifiAccess(wifiParamsId,callback)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({wifiParamsId})[0], wifiParamsId, c, v);
					
		var ret = null;
		
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
		});		
		
	}
	
	
    //CR
    
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
	*	@param function(return)
	*	@return { visitorPackageId }
	*/
	createVisitorPackage(tempWifiAccessId,tpaId,linkWalletId,employeeId,clientId,startTime,endTime,callback)
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
		});		
		
	}
	
    //CR
    
    //UD
	
	
	//TPA
	
	/**
	*	Creates a new tpa
	*	@param function(return)
	*	@return { tpaId }
	*/
	createTPA(callback)
	{
		var c = [];
		var v = [];
				
					
		var ret = null;
		
		var query = "INSERT INTO TPA DEFAULT VALUES RETURNING tpaid";
		
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
		});		
		
	}
	
	
    //CR
    
    //UD
	
	
	
    //TPAxRoom
	
	/**
	*	Creates a new tpaxroom
	*	@param tpaId 
	*	@param roomId 
	*	@param function(return)
	*	@return { tpaId }
	*/
	createTPAxRoom(tpaId,roomId,callback)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({tpaId})[0], tpaId, c, v);
		this.bigAppend(Object.keys({roomId})[0], roomId, c, v);
					
		var ret = null;
		
		var query = "INSERT INTO TPAxRoom(tpaId,roomId) VALUES ($1,$2) RETURNING CONCAT(tpaId, '_', roomId) AS tpaxroomid;";
		
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
		});		
		
	}
    
    //CR
    
    //UD
	
	
	
	//Wallet
	
	/**
	*	Creates a new wallet
	*	@param maxLimit 
	*	@param spent 
	*	@param function(return)
	*	@return { linkWalletId }
	*/
	createWallet(maxLimit,spent,callback)
	{
		var c = [];
		var v = [];
				
		this.bigAppend(Object.keys({maxLimit})[0], maxLimit, c, v);
		this.bigAppend(Object.keys({spent})[0], spent, c, v);
					
		var ret = null;
		
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
		});		
		
	}
	
    //CR
    
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
