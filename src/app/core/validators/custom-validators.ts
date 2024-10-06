import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const confirmPasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  return control.get('newPassword')?.value ===
    control.get('confirmPassword')?.value
    ? null
    : { mismatch: true };
};
