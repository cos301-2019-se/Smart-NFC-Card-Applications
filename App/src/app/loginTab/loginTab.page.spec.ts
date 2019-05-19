import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTabPage } from './loginTab.page';

import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';

import { BusinessCardsService } from '../business-cards.service';
import { LocalStorageService } from '../local-storage.service';
import { RequestModuleService } from '../request-module.service';

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
        RequestModuleService
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

  it('login should dissappear after successful login', () => {
    component.username = 'admin';
    component.password = 'password';
    component.login();
    expect(component.title).toBe("Menu");
    expect(component.loggedIn).toBe(true);
  });

  it('login should show after successful logout', () => {
    component.logout();
    expect(component.title).toBe("Login");
    expect(component.loggedIn).toBe(false);
  });
});
