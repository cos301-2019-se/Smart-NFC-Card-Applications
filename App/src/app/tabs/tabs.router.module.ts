/**
*	File Name:	    tabs.router.module.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      TabsPageRoutingModule
*	Related documents:	None
*
*	Update History:
*	Date		    Author		Version		Changes
*	-----------------------------------------------------------------------------------------
*	2019/05/19	Wian		  1.0		    Original
*
*	Functional Description:   This file allows tab routing to take place
*	Error Messages:   “Error”
*	Assumptions:  That all the injectables are working
*	Constraints: 	None
*/

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'manage-tab',
        children: [
          {
            path: '',
            loadChildren: '../manage-tab/manage-tab.module#ManageTabPageModule'
          }
        ]
      },
      {
        path: 'share-tab',
        children: [
          {
            path: '',
            loadChildren: '../share-tab/share-tab.module#ShareTabPageModule'
          }
        ]
      },
      {
        path: 'card-tab',
        children: [
          {
            path: '',
            loadChildren: '../card-tab/card-tab.module#CardTabPageModule'
          }
        ]
      },
      {
        path: 'package-tab',
        children: [
          {
            path: '',
            loadChildren: '../package-tab/package-tab.module#PackageTabPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/manage-tab',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/manage-tab',
    pathMatch: 'full'
  }
];

/**
* Purpose:	This class provides tabs routing functionality
*	Usage:		This module is the tab routing module
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
