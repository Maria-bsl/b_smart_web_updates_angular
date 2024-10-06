import { TestBed } from '@angular/core/testing';

import { FormInputService } from './form-input.service';

describe('FormInputService', () => {
  let service: FormInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
