import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVisitorPackagePage } from './edit-visitor-package.page';
import { NavParams, ModalController, AngularDelegate } from '@ionic/angular';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { RequestModuleService } from '../services/request-module.service';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { IonicStorageModule } from '@ionic/storage';

export class NavParamsMock {
  static returnParam = null;
  public get(key): any {
    if (NavParamsMock.returnParam) {
       return NavParamsMock.returnParam
    }
    return 'default';
  }
  static setParams(value){
    NavParamsMock.returnParam = value;
  }
}

describe('EditVisitorPackagePage', () => {
  let component: EditVisitorPackagePage;
  let fixture: ComponentFixture<EditVisitorPackagePage>;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVisitorPackagePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicStorageModule.forRoot()
      ],
      providers: [
        ModalController, AngularDelegate,
        RequestModuleService,
        HttpClient, HttpHandler,
        NFC, Ndef,
        AndroidPermissions,
        {provide: NavParams, useClass: NavParamsMock},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVisitorPackagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
