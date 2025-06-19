import { TestBed } from '@angular/core/testing';

import { LogdatabaseServiceService } from './logdatabase.service.service';

describe('LogdatabaseServiceService', () => {
  let service: LogdatabaseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogdatabaseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
