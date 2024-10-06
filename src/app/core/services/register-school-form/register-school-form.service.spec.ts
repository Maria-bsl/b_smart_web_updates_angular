import { TestBed } from '@angular/core/testing';

import { RegisterSchoolFormService } from './register-school-form.service';

describe('RegisterSchoolFormService', () => {
  let service: RegisterSchoolFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterSchoolFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
