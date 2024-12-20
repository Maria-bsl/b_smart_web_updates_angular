import { TestBed } from '@angular/core/testing';

import { ErrorTracerService } from './error-tracer.service';

describe('ErrorTracerService', () => {
  let service: ErrorTracerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorTracerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
