import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NFC, Ndef, NdefRecord } from '@ionic-native/nfc/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Platform } from '@ionic/angular';

import { IonicStorageModule } from '@ionic/storage';
import { LocalStorageService } from './local-storage.service';
import { BusinessCardsService } from './business-cards.service';
import { NfcControllerService } from './nfc-controller.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    SplashScreen,
    AndroidPermissions,
    LocalStorageService,
    BusinessCardsService,
    NFC, Ndef,
    NfcControllerService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
