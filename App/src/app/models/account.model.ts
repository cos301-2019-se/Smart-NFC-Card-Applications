/**
*	File Name:	        account.model.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	    VastExpanse
*	Copyright:	        © Copyright 2019 University of Pretoria
*	Classes:	        AccountModel
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/07/13	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the location model
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { RoomModel } from './room.model';
import { WifiDetailsModel } from './wifi-details.model';
import { LocationModel } from './location.model';

/**
*   Purpose:	This class provides the Account model
*	Usage:		This class can be used to store account information 
*	@author:	Wian du Plooy
*	@version:	1.0
*/
export class AccountModel {    
    public employeeId: number;
    public company: string;
    public building: LocationModel;
    public rooms: RoomModel[];
    public wifi: WifiDetailsModel;

    constructor(){
        
    }
}