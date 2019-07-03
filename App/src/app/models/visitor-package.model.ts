/**
*	File Name:	        visitor-package.model.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	    VastExpanse
*	Copyright:	        © Copyright 2019 University of Pretoria
*	Classes:	        VisitorPackage
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/06/28	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the visitor package model
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { LocationModel } from './location.model';

/**
*   Purpose:	This class provides the VisitorPackage model
*	Usage:		This class can be used to generate visitor package objects
*	@author:	Wian du Plooy
*	@version:	1.0
*/
export class VisitorPackage {
    packageId: number;
    companyName: string;
    startDate: Date;
    endDate: Date;
    access: string;
    location: LocationModel;
    wifiSsid: string;
    wifiPassword: string;
    wifiType: string;
    spendingLimit: number;
    amountSpent: number;
}