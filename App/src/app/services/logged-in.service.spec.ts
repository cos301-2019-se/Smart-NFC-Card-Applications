import { TestBed } from '@angular/core/testing';

import { LoggedInService } from './logged-in.service';
import { LocalStorageService } from './local-storage.service';
import { IonicStorageModule } from '@ionic/storage';
import { RequestModuleService } from './request-module.service';
import { HttpClient } from 'selenium-webdriver/http';
import { HttpClientModule } from '@angular/common/http';

describe('LoggedInService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
      IonicStorageModule.forRoot()
    ],
    providers: [
      LocalStorageService,
      RequestModuleService
    ]
  }));

  it('should be created', () => {
    const service: LoggedInService = TestBed.get(LoggedInService);
    expect(service).toBeTruthy();
  });
});
