import { TestBed } from '@angular/core/testing';

import { VisitorPackagesService } from './visitor-packages.service';
import { IonicStorageModule } from '@ionic/storage';
import { VisitorPackage } from '../models/visitor-package.model';
import { LocationModel } from '../models/location.model';

describe('VisitorPackagesService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      IonicStorageModule.forRoot()
    ],
  }));

  it('should be created', () => {
    const service: VisitorPackagesService = TestBed.get(VisitorPackagesService);
    expect(service).toBeTruthy();
  });

  it('createVisitorPackage should create and return a VisitorPackage when valid data given', () => {    
    const service: VisitorPackagesService = TestBed.get(VisitorPackagesService);
    let visitorPackage: VisitorPackage = service.createVisitorPackage(0, 'Company Name', new Date(), new Date(), 'Lobby', new LocationModel(0,0,'Location'), 'wifiSSID', 'wifiPassword', 'wifiType', 100, 0);
    expect(visitorPackage).toEqual(jasmine.objectContaining(service.stub));
  });

  it('setVisitorPackages should clear visitor packages list when sent []', (done) => {
    const service: VisitorPackagesService = TestBed.get(VisitorPackagesService);
    service.setVisitorPackages([]).then(() => {
      return service.getVisitorPackages()
    })
    .then(data => {
      expect(data).toEqual([]);
      done()
    })
  });

  it('addVisitorPackage add a visitor package to the list when valid data given', (done) => {
    const service: VisitorPackagesService = TestBed.get(VisitorPackagesService);
    let date = new Date();
    let visitorPackage: VisitorPackage = service.createVisitorPackage(0, 'Company Name', date , date, 'Lobby', new LocationModel(0,0,'Location'), 'wifiSSID', 'wifiPassword', 'wifiType', 100, 0);
    service.addVisitorPackage(visitorPackage).then(() => {
      return service.getVisitorPackages()
    })
    .then(data => {
      expect(data[0]).toEqual(service.stub);
      done();
    })
  });

  it('removeVisitorPackage should not delete anything if the visitor package does not exist', (done) => {
    const service: VisitorPackagesService = TestBed.get(VisitorPackagesService);
    let date = new Date();
    let visitorPackage: VisitorPackage = service.createVisitorPackage(0, 'Company Name', date , date, 'Lobby', new LocationModel(0,0,'Location'), 'wifiSSID', 'wifiPassword', 'wifiType', 100, 0);
    service.addVisitorPackage(visitorPackage).then(() => {
      return service.removeVisitorPackage(-1)
    })
    .then(() => {
      return service.getVisitorPackages()
    })
    .then(data => {
      expect(data[0]).toEqual(service.stub);
      done();
    })
  });

  it('removeVisitorPackage should delete the visitor package if it is there to remove', (done) => {
    const service: VisitorPackagesService = TestBed.get(VisitorPackagesService);
    let date = new Date();
    let visitorPackage: VisitorPackage = service.createVisitorPackage(0, 'Company Name', date , date, 'Lobby', new LocationModel(0,0,'Location'), 'wifiSSID', 'wifiPassword', 'wifiType', 100, 0);
    service.addVisitorPackage(visitorPackage).then(() => {
      return service.removeVisitorPackage(0)
    })
    .then(() => {
      return service.getVisitorPackages()
    })
    .then(data => {
      expect(data).toEqual([]);
      done();
    })
  });
});
