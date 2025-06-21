import { TestBed } from '@angular/core/testing';

import { CountryReverseGeocoderService } from './country-reverse-geocoder.service';

describe('CountryReverseGeocoderService', () => {
  let service: CountryReverseGeocoderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryReverseGeocoderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
