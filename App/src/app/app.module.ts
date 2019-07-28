/**
*	File Name:	    app.module.ts
*	Project:		    Smart-NFC-Application
*	Orginization:	  VastExpanse
*	Copyright:	    © Copyright 2019 University of Pretoria
*	Classes:	      AppModule
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
import { NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PopoverMenuComponent } from './popover-menu/popover-menu.component';
import { CreateVisitorPackagePageModule } from './create-visitor-package/create-visitor-package.module';
import { EditVisitorPackagePageModule } from './edit-visitor-package/edit-visitor-package.module';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Device } from '@ionic-native/device/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Toast } from '@ionic-native/toast/ngx';

import { LocalStorageService } from './services/local-storage.service';
import { BusinessCardsService } from './services/business-cards.service';
import { NfcControllerService } from './services/nfc-controller.service';
import { LocationService } from './services/location.service';
import { EventEmitterService } from './services/event-emitter.service';
import { FilterService } from './services/filter.service';
import { LoggedInService } from './services/logged-in.service';
import { DateService } from './services/date.service';

/**
* Purpose:	This class provides the module for the app
*	Usage:		This module is the main app module
*	@author:	Wian du Plooy
*	@version:	1.0
*/
@NgModule({
  declarations: [
    AppComponent, 
    PopoverMenuComponent
  ],
  entryComponents: [
    PopoverMenuComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    CreateVisitorPackagePageModule,
    EditVisitorPackagePageModule
  ],
  providers: [
    SplashScreen,
    StatusBar,
    Toast,
    AndroidPermissions,
    LocalStorageService,
    BusinessCardsService,
    LocationService,
    EventEmitterService,
    Geolocation, 
    LaunchNavigator,
    NFC, 
    Ndef, 
    NfcControllerService,
    ModalController,
    Device,
    FilterService,
    LoggedInService,
    DateService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
enableProdMode();
