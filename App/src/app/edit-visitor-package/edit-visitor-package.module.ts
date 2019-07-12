/**
*	File Name:	    edit-visitor-package.module.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      EditVisitorPackagePageModule
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/07/11	Wian		  1.0		    Original
*
*	Functional Description:   This file allows the module to be imported to use the component
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditVisitorPackagePage } from './edit-visitor-package.page';

const routes: Routes = [
  {
    path: '',
    component: EditVisitorPackagePage
  }
];

/**
* Purpose:	This class provides the module for the edit visitor package page
*	Usage:		This module is imported by the tabs component
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditVisitorPackagePage]
})
export class EditVisitorPackagePageModule {}
