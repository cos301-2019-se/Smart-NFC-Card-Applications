import { TestBed } from '@angular/core/testing';

import { UniqueIdService } from './unique-id.service';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

describe('UniqueIdService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Uid,
      AndroidPermissions
    ]
  }));

  it('should be created', () => {
    const service: UniqueIdService = TestBed.get(UniqueIdService);
    expect(service).toBeTruthy();
  });
});
