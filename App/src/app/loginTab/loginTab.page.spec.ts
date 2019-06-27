import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTabPage } from './loginTab.page';

import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';

import { BusinessCardsService } from '../services/business-cards.service';
import { LocalStorageService } from '../services/local-storage.service';
import { RequestModuleService } from '../services/request-module.service';
import { ModalController, AngularDelegate } from '@ionic/angular';

describe('LoginTabPage', () => {
  let component: LoginTabPage;
  let fixture: ComponentFixture<LoginTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginTabPage],
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
    fixture = TestBed.createComponent(LoginTabPage);
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
    expect(component.title).toBe("Login");
    expect(component.loggedIn).toBe(false);
  });
});
