/**
*	File Name:	    manage-tab.module.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      ManageTabPageModule
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/05/19	Wian		  1.0		    Original
*
*	Functional Description:   This file allows the module to be imported to use the component
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageTabPage } from './manage-tab.page';
import { SharedModule } from '../shared.module';

/**
* Purpose:	This class provides the module for the manage tab page
*	Usage:		This module is imported by the tabs component
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ManageTabPage }]),    
    SharedModule
  ],
  declarations: [ManageTabPage]
})
export class ManageTabPageModule {}
