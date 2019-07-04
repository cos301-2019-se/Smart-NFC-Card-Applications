import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateVisitorPackagePageModule } from './create-visitor-package/create-visitor-package.module'
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { HttpClientModule } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { Device } from '@ionic-native/device/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { LocalStorageService } from './services/local-storage.service';
import { BusinessCardsService } from './services/business-cards.service';
import { NfcControllerService } from './services/nfc-controller.service';
import { LocationService } from './services/location.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule,
    CreateVisitorPackagePageModule,
  ],
  providers: [
    SplashScreen,
    StatusBar,
    AndroidPermissions,
    LocalStorageService,
    BusinessCardsService,
    LocationService,
    Geolocation, 
    LaunchNavigator,
    NFC, 
    Ndef, 
    NfcControllerService,
    ModalController,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
