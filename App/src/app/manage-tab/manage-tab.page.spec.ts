import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTabPage } from './manage-tab.page';

import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';

import { BusinessCardsService } from '../services/business-cards.service';
import { LocalStorageService } from '../services/local-storage.service';
import { RequestModuleService } from '../services/request-module.service';
import { ModalController, AngularDelegate } from '@ionic/angular';

describe('ManageTabPage', () => {
  let component: ManageTabPage;
  let fixture: ComponentFixture<ManageTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageTabPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientModule,
        IonicStorageModule.forRoot()
      ],
      providers: [
        LocalStorageService,
        BusinessCardsService,
        RequestModuleService,
        ModalController, AngularDelegate
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('login should display an error if username and password is missing', () => {
    component.login();
    expect(component.error).toBe("Please enter a username and password.");
    expect(component.loggedIn).toBe(false);
  });

  it('login should show after successful logout', () => {
    component.logout();
    expect(component.loggedIn).toBe(false);
  });
});
