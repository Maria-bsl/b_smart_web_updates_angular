import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { HtmlSelectOption } from '../core/interfaces/helpers/data/html-select-option';
import { every } from 'rxjs';

export class AppUtilities {
  static PASSWORD_REGEX: string =
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,14}$';
  static hasFormControlError(control: FormControl) {
    return control && control.invalid && control.touched;
  }
  static clearFormControl(control: FormControl) {
    control.setValue('');
  }
  static matchValidator(matchTo: string, reverse?: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
        !!control.parent.value &&
        control.value === (control.parent?.controls as any)[matchTo].value
        ? null
        : { matching: true };
    };
  }
  static getSelectOptionsAsArray(select: HTMLSelectElement) {
    let selectOptions: HtmlSelectOption[] = [];
    for (let i = 0; i < select.options.length; i++) {
      let optionTag = select.options[i] as HTMLOptionElement;
      let option = {
        value: optionTag?.value,
        text: optionTag?.text,
        selected: optionTag?.selected,
      } as unknown as HtmlSelectOption;
      selectOptions.push(option);
    }
    return selectOptions;
  }
  static updateInputValueFromFormControl(
    control: FormControl,
    element: HTMLInputElement | HTMLSelectElement
  ) {
    control.valueChanges.subscribe({
      next: (value) => {
        element.value = value;
      },
    });
  }
  static updateInputValueFromFormControlDispatchEvent(
    control: FormControl,
    element: HTMLInputElement | HTMLSelectElement
  ) {
    control.valueChanges.subscribe({
      next: (value) => {
        element.value = value;
        let event = new Event('change', { bubbles: true });
        element.dispatchEvent(event);
      },
    });
  }
  static isValueEmptyElement(element: HTMLInputElement | HTMLSelectElement) {
    return !element.value || element.value.length === 0;
  }
  // static getFormControlFromGroup(group: FormGroup, name: string): FormControl {
  //   return group.get(name) as FormControl;
  // }
  static isEqualStrings(value1: string, value2: string) {
    return value1 === value2;
  }
  static isValidFormInputs(formInputs: any) {
    const hasNullValue = (obj: any): boolean => {
      for (const key of Object.keys(obj)) {
        const value = obj[key];

        if (Array.isArray(value)) {
          for (let index = 0; index < value.length; index++) {
            if (hasNullValue(value[index])) {
              console.error(`Found null in array item ${index} of ${key}`);
              return true;
            }
          }
        } else if (typeof value === 'object' && value !== null) {
          if (hasNullValue(value)) {
            console.error(`Found null in object at key ${key}`);
            return true;
          }
        } else if (value === null) {
          console.error(`Found null at key ${key}`);
          return true;
        }
      }
      return false;
    };

    const hasNulls = hasNullValue(formInputs);
    return !hasNulls;
  }
}
