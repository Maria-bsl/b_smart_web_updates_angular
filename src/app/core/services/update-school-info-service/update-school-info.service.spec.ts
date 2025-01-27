import { TestBed } from '@angular/core/testing';

import { UpdateSchoolInfoService } from './update-school-info.service';

describe('UpdateSchoolInfoService', () => {
  let service: UpdateSchoolInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateSchoolInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
