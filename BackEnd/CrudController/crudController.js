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
	
	/**
	*	Retrieves a company using companyId
	*	@param companyId 
	*	@param function(return)
	*	@return { companyId, companyName, companyWebsite, passwordId }
	*/
	getCompanyByCompanyId(companyId, callback)
	{
		var query = 'SELECT * FROM Company WHERE companyId = $1';
		
		var ret = null;
		
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
		});	
	}

	/**
	*	Retrieves a company using passwordId
	*	@param passwordId 
	*	@param function(return)
	*	@return { companyId, companyName, companyWebsite, passwordId }
	*/
	getCompanyByPasswordId(passwordId, callback)
	{
		var query = 'SELECT * FROM Company WHERE passwordId = $1';
		
		var ret = null;
		
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
	
	/**
	*	Retrieves a building using buildingId
	*	@param buildingId 
	*	@param function(return)
	*	@return { buildingId, latitude, longitude, branchName, companyId, wifiParamsId }
	*/
	getBuildingByBuildingId(buildingId, callback)
	{
		var query = 'SELECT * FROM Building WHERE buildingId = $1';
		
		var ret = null;
		
		this.client.query(query, [buildingId], (err, res) => 
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
		});	
	}
	
	/**
	*	Retrieves a set of buildings using companyId
	*	@param companyId 
	*	@param function(return)
	*	@return [ { buildingId, latitude, longitude, branchName, companyId, wifiParamsId } ]
	*/
	getBuildingsByCompanyId(companyId, callback)
	{
		var query = 'SELECT * FROM Building WHERE companyId = $1';
		
		var ret = null;
		
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
		});	
	}
	
		/**
	*	Retrieves a set of buildings using wifiParamsId
	*	@param wifiParamsId 
	*	@param function(return)
	*	@return [ { buildingId, latitude, longitude, branchName, companyId, wifiParamsId } ]
	*/
	getBuildingsByWifiParamsId(wifiParamsId, callback)
	{
		var query = 'SELECT * FROM Building WHERE wifiParamsId = $1';
		
		var ret = null;
		
		this.client.query(query, [wifiParamsId], (err, res) => 
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
	
	/**
	*	Retrieves a password using passwordId
	*	@param passwordId 
	*	@param function(return)
	*	@return { passwordId, username, hash, salt, apiKey, expirationDate }
	*/
	getPasswordByPasswordId(passwordId, callback)
	{
		var query = 'SELECT * FROM Password WHERE passwordId = $1';
		
		var ret = null;
		
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
		});	
	}

	/**
	*	Retrieves a password using username
	*	@param username 
	*	@param function(return)
	*	@return { passwordId, username, hash, salt, apiKey, expirationDate }
	*/
	getPasswordByUsername(username, callback)
	{
		var query = 'SELECT * FROM Password WHERE username = $1';
		
		var ret = null;
		
		this.client.query(query, [username], (err, res) => 
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
		});	
	}

	/**
	*	Retrieves a password using apiKey
	*	@param apiKey 
	*	@param function(return)
	*	@return { passwordId, username, hash, salt, apiKey, expirationDate }
	*/
	getPasswordByApiKey(apiKey, callback)
	{
		var query = 'SELECT * FROM Password WHERE apiKey = $1';
		
		var ret = null;
		
		this.client.query(query, [apiKey], (err, res) => 
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
	
	/**
	*	Retrieves a room using roomId
	*	@param roomId 
	*	@param function(return)
	*	@return { roomId, roomName, parentRoomList, buildingId }
	*/
	getRoomByRoomId(roomId, callback)
	{
		var query = 'SELECT * FROM Room WHERE roomId = $1';
		
		var ret = null;
		
		this.client.query(query, [roomId], (err, res) => 
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
		});	
	}
	
	/**
	*	Retrieves a set of rooms using buildingId
	*	@param buildingId 
	*	@param function(return)
	*	@return [ { roomId, roomName, parentRoomList, buildingId } ]
	*/
	getRoomsByBuildingId(buildingId, callback)
	{
		var query = 'SELECT * FROM Room WHERE buildingId = $1';
		
		var ret = null;
		
		this.client.query(query, [buildingId], (err, res) => 
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
	
	/**
	*	Retrieves a nfcaccesspoints using nfcReaderId
	*	@param nfcReaderId 
	*	@param function(return)
	*	@return { nfcReaderId, roomId }
	*/
	getNFCAccessPointsByNfcReaderId(nfcReaderId, callback)
	{
		var query = 'SELECT * FROM NFCAccessPoints WHERE nfcReaderId = $1';
		
		var ret = null;
		
		this.client.query(query, [nfcReaderId], (err, res) => 
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
		});	
	}
	
	/**
	*	Retrieves a set of nfcaccesspointss using roomId
	*	@param roomId 
	*	@param function(return)
	*	@return [ { nfcReaderId, roomId } ]
	*/
	getNFCAccessPointssByRoomId(roomId, callback)
	{
		var query = 'SELECT * FROM NFCAccessPoints WHERE roomId = $1';
		
		var ret = null;
		
		this.client.query(query, [roomId], (err, res) => 
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
	
	/**
	*	Retrieves a employee using employeeId
	*	@param employeeId 
	*	@param function(return)
	*	@return { employeeId, firstName, surname, title, cellphone, email, companyId, buildingId, passwordId }
	*/
	getEmployeeByEmployeeId(employeeId, callback)
	{
		var query = 'SELECT * FROM Employee WHERE employeeId = $1';
		
		var ret = null;
		
		this.client.query(query, [employeeId], (err, res) => 
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
		});	
	}

	/**
	*	Retrieves a employee using passwordId
	*	@param passwordId 
	*	@param function(return)
	*	@return { employeeId, firstName, surname, title, cellphone, email, companyId, buildingId, passwordId }
	*/
	getEmployeeByPasswordId(passwordId, callback)
	{
		var query = 'SELECT * FROM Employee WHERE passwordId = $1';
		
		var ret = null;
		
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
		});	
	}
	
	/**
	*	Retrieves a set of employees using companyId
	*	@param companyId 
	*	@param function(return)
	*	@return [ { employeeId, firstName, surname, title, cellphone, email, companyId, buildingId, passwordId } ]
	*/
	getEmployeesByCompanyId(companyId, callback)
	{
		var query = 'SELECT * FROM Employee WHERE companyId = $1';
		
		var ret = null;
		
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
		});	
	}

	/**
	*	Retrieves a set of employees using buildingId
	*	@param buildingId 
	*	@param function(return)
	*	@return [ { employeeId, firstName, surname, title, cellphone, email, companyId, buildingId, passwordId } ]
	*/
	getEmployeesByBuildingId(buildingId, callback)
	{
		var query = 'SELECT * FROM Employee WHERE buildingId = $1';
		
		var ret = null;
		
		this.client.query(query, [buildingId], (err, res) => 
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
	
	/**
	*	Retrieves a client using clientId
	*	@param clientId 
	*	@param function(return)
	*	@return { clientId, macAddress }
	*/
	getClientByClientId(clientId, callback)
	{
		var query = 'SELECT * FROM Client WHERE clientId = $1';
		
		var ret = null;
		
		this.client.query(query, [clientId], (err, res) => 
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
		});	
	}

	/**
	*	Retrieves a client using macAddress
	*	@param macAddress 
	*	@param function(return)
	*	@return { clientId, macAddress }
	*/
	getClientByMacAddress(macAddress, callback)
	{
		var query = 'SELECT * FROM Client WHERE macAddress = $1';
		
		var ret = null;
		
		this.client.query(query, [macAddress], (err, res) => 
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
	
	/**
	*	Retrieves a wifiparams using wifiParamsId
	*	@param wifiParamsId 
	*	@param function(return)
	*	@return { wifiParamsId, ssid, networkType, password }
	*/
	getWiFiParamsByWifiParamsId(wifiParamsId, callback)
	{
		var query = 'SELECT * FROM WiFiParams WHERE wifiParamsId = $1';
		
		var ret = null;
		
		this.client.query(query, [wifiParamsId], (err, res) => 
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
	
	/**
	*	Retrieves a tempwifiaccess using tempWifiAccessId
	*	@param tempWifiAccessId 
	*	@param function(return)
	*	@return { tempWifiAccessId, wifiParamsId }
	*/
	getTempWifiAccessByTempWifiAccessId(tempWifiAccessId, callback)
	{
		var query = 'SELECT * FROM TempWifiAccess WHERE tempWifiAccessId = $1';
		
		var ret = null;
		
		this.client.query(query, [tempWifiAccessId], (err, res) => 
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
		});	
	}
	
	/**
	*	Retrieves a set of tempwifiaccesss using wifiParamsId
	*	@param wifiParamsId 
	*	@param function(return)
	*	@return [ { tempWifiAccessId, wifiParamsId } ]
	*/
	getTempWifiAccesssByWifiParamsId(wifiParamsId, callback)
	{
		var query = 'SELECT * FROM TempWifiAccess WHERE wifiParamsId = $1';
		
		var ret = null;
		
		this.client.query(query, [wifiParamsId], (err, res) => 
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
	
	/**
	*	Retrieves a visitorpackage using visitorPackageId
	*	@param visitorPackageId 
	*	@param function(return)
	*	@return { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime }
	*/
	getVisitorPackageByVisitorPackageId(visitorPackageId, callback)
	{
		var query = 'SELECT * FROM VisitorPackage WHERE visitorPackageId = $1';
		
		var ret = null;
		
		this.client.query(query, [visitorPackageId], (err, res) => 
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
		});	
	}

	/**
	*	Retrieves a visitorpackage using tempWifiAccessId
	*	@param tempWifiAccessId 
	*	@param function(return)
	*	@return { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime }
	*/
	getVisitorPackageByTempWifiAccessId(tempWifiAccessId, callback)
	{
		var query = 'SELECT * FROM VisitorPackage WHERE tempWifiAccessId = $1';
		
		var ret = null;
		
		this.client.query(query, [tempWifiAccessId], (err, res) => 
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
		});	
	}

	/**
	*	Retrieves a visitorpackage using tpaId
	*	@param tpaId 
	*	@param function(return)
	*	@return { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime }
	*/
	getVisitorPackageByTpaId(tpaId, callback)
	{
		var query = 'SELECT * FROM VisitorPackage WHERE tpaId = $1';
		
		var ret = null;
		
		this.client.query(query, [tpaId], (err, res) => 
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
		});	
	}

	/**
	*	Retrieves a visitorpackage using linkWalletId
	*	@param linkWalletId 
	*	@param function(return)
	*	@return { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime }
	*/
	getVisitorPackageByLinkWalletId(linkWalletId, callback)
	{
		var query = 'SELECT * FROM VisitorPackage WHERE linkWalletId = $1';
		
		var ret = null;
		
		this.client.query(query, [linkWalletId], (err, res) => 
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
		});	
	}
	
	/**
	*	Retrieves a set of visitorpackages using employeeId
	*	@param employeeId 
	*	@param function(return)
	*	@return [ { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime } ]
	*/
	getVisitorPackagesByEmployeeId(employeeId, callback)
	{
		var query = 'SELECT * FROM VisitorPackage WHERE employeeId = $1';
		
		var ret = null;
		
		this.client.query(query, [employeeId], (err, res) => 
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
		});	
	}

	/**
	*	Retrieves a set of visitorpackages using clientId
	*	@param clientId 
	*	@param function(return)
	*	@return [ { visitorPackageId, tempWifiAccessId, tpaId, linkWalletId, employeeId, clientId, startTime, endTime } ]
	*/
	getVisitorPackagesByClientId(clientId, callback)
	{
		var query = 'SELECT * FROM VisitorPackage WHERE clientId = $1';
		
		var ret = null;
		
		this.client.query(query, [clientId], (err, res) => 
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
	
	/**
	*	Retrieves a tpa using tpaId
	*	@param tpaId 
	*	@param function(return)
	*	@return { tpaId }
	*/
	getTPAByTpaId(tpaId, callback)
	{
		var query = 'SELECT * FROM TPA WHERE tpaId = $1';
		
		var ret = null;
		
		this.client.query(query, [tpaId], (err, res) => 
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
	
	/**
	*	Retrieves a set tpaxrooms using tpaId
	*	@param tpaId 
	*	@param function(return)
	*	@return [ { tpaId, roomId } ]
	*/
	getTPAxRoomsByTpaId(tpaId, callback)
	{
		var query = 'SELECT * FROM TPAxRoom WHERE tpaId = $1';
		
		var ret = null;
		
		this.client.query(query, [tpaId], (err, res) => 
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
		});	
	}
	
	/**
	*	Retrieves a set tpaxrooms using roomId
	*	@param roomId 
	*	@param function(return)
	*	@return [ { tpaId, roomId } ]
	*/
	getTPAxRoomsByRoomId(roomId, callback)
	{
		var query = 'SELECT * FROM TPAxRoom WHERE roomId = $1';
		
		var ret = null;
		
		this.client.query(query, [roomId], (err, res) => 
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
	
	/**
	*	Retrieves a wallet using linkWalletId
	*	@param linkWalletId 
	*	@param function(return)
	*	@return { linkWalletId, maxLimit, spent }
	*/
	getWalletByLinkWalletId(linkWalletId, callback)
	{
		var query = 'SELECT * FROM Wallet WHERE linkWalletId = $1';
		
		var ret = null;
		
		this.client.query(query, [linkWalletId], (err, res) => 
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
