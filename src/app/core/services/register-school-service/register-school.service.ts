import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class RegisterSchoolService {
  formGroup!: FormGroup;
  constructor(private fb: FormBuilder) {}
  createFormGroup() {
    this.formGroup = this.fb.group({
      schoolName: this.fb.control('', Validators.required),
      schoolAcronym: this.fb.control('', [Validators.maxLength(3)]),
      schoolRegNo: this.fb.control('', [Validators.required]),
      institutionId: this.fb.control('', [Validators.required]),
      authorizedUser: this.fb.control('', [Validators.required]),
      branchName: this.fb.control('', [Validators.required]),
      emailAddress: this.fb.control('', [
        Validators.required,
        Validators.email,
      ]),
      country: this.fb.control('', []),
      region: this.fb.control('', []),
      district: this.fb.control('', []),
      ward: this.fb.control('', []),
      address: this.fb.control('', []),
      website: this.fb.control('', []),
      phoneNumber: this.fb.control('', [Validators.pattern(/^(6|7)\d{8}$/)]),
      mobileNumber: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^(6|7)\d{8}$/),
      ]),
      details: this.fb.array([], []),
    });
  }
}
