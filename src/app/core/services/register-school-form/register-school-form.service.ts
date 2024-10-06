import { Injectable } from '@angular/core';
import { RegisterSchoolFormInputs } from '../../interfaces/form-inputs/register-school-form-inputs';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class RegisterSchoolFormService {
  constructor() {}
  loadRegisterForm(form: RegisterSchoolFormInputs, formGroup: FormGroup) {}
}
