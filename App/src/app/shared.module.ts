/**
*	File Name:	    shared.module.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      SharedModule
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/05/19	Wian		  1.0		    Original
*
*	Functional Description:   This file allows the shared functions to be imported
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/
import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FilterPipe } from './services/filter.pipe';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

/**
*   Purpose:	This class provides the shared module for the app
*	Usage:		This module is the main app module
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@NgModule({
    declarations: [
        FilterPipe
    ],
    exports: [
        FilterPipe
    ],
    imports: [
        CommonModule
    ],
    providers: [
        Uid,
        AndroidPermissions,
        BarcodeScanner
    ]
})
export class SharedModule{}