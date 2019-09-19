import { TestBed } from '@angular/core/testing';

import { QrCodeService } from './qr-code.service';
import { SharedModule } from '../shared.module';

describe('QrCodeService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      SharedModule
    ]
  }));

  it('should be created', () => {
    const service: QrCodeService = TestBed.get(QrCodeService);
    expect(service).toBeTruthy();
  });
});
