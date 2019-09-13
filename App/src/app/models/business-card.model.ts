/**
*	File Name:	        business-card.model.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	    VastExpanse
*	Copyright:	        © Copyright 2019 University of Pretoria
*	Classes:	        BusinessCard
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/05/19	Wian		  1.0		    Original
*
*	Functional Description:   This class provides the business card model
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { LocationModel } from './location.model';

/**
*   Purpose:	This class provides the BusinessCard model
*	Usage:		This class can be used to generate business card objects
*	@author:	Wian du Plooy
*	@version:	1.0
*/
export class BusinessCard {
    businessCardId: string;
    companyName: string;
    employeeName: string;
    contactNumber: string;
    email: string;
    website: string;
    location: LocationModel;

    /**
     * Function that creates a CSV of the business card model
     * @return String csv
     */
    toCSV(){
        return `${this.businessCardId},${this.companyName},${this.employeeName},${this.contactNumber},${this.email},${this.website},${this.location.getLabel()},${this.location.getLatitude()},${this.location.getLongitude()}`;
    }
}