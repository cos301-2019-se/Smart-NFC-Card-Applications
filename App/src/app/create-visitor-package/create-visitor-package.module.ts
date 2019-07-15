/**
*	File Name:	    create-visitor-package.module.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      CreateVisitorPackagePageModule
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/06/26	Wian		  1.0		    Original
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

import { CreateVisitorPackagePage } from './create-visitor-package.page';

const routes: Routes = [
  {
    path: '',
    component: CreateVisitorPackagePage
  }
];

/**
* Purpose:	This class provides the module for the create visitor package page
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
  declarations: [CreateVisitorPackagePage]
})
export class CreateVisitorPackagePageModule {}
