import { TestBed } from '@angular/core/testing';

import { LocationService } from './location.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';
import { LocationModel } from '../models/location.model';

describe('LocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Geolocation,
      LaunchNavigator
    ]
  }));

  it('should be created', () => {
    const service: LocationService = TestBed.get(LocationService);
    expect(service).toBeTruthy();
  });
});
