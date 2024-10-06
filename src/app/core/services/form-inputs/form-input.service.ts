import { Injectable } from '@angular/core';
import { AppUtilities } from 'src/app/utilities/app-utilities';
import { HtmlSelectOption } from '../../interfaces/helpers/data/html-select-option';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormInputService {
  constructor() {}
  isValidFormInputs(formInputs: any) {
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
  parseHtmlSelectToFormControl(
    htmlSelect: HTMLSelectElement,
    formControl: FormControl
  ) {
    if (!AppUtilities.isValueEmptyElement(htmlSelect)) {
      formControl.setValue(htmlSelect.value);
    }
    formControl.valueChanges.subscribe({
      next: (value) => {
        htmlSelect.value = value;
        // let event = new Event('change', { bubbles: true });
        // htmlSelect.dispatchEvent(event);
      },
    });
  }
  parseHtmlInputToFormControl(
    htmlInput: HTMLInputElement,
    formControl: FormControl
  ) {
    if (!AppUtilities.isValueEmptyElement(htmlInput)) {
      formControl.setValue(htmlInput.value);
    }
    formControl.valueChanges.subscribe({
      next: (value) => {
        htmlInput.value = value;
      },
    });
  }
  matchFormControlValueWithHtmlElementValue(
    control: FormControl,
    htmlElement: HTMLSelectElement | HTMLInputElement
  ) {
    if (control.value !== htmlElement.value) {
      htmlElement.value = control.value;
      let event = new Event('change', { bubbles: true });
      htmlElement.dispatchEvent(event);
    }
  }
  getSelectionOptionsArray(select: HTMLSelectElement) {
    let selectOptions: HtmlSelectOption[] = [];
    for (let i = 0; i < select.options.length; i++) {
      let optionTag = select.options[i] as HTMLOptionElement;
      let option: HtmlSelectOption = {
        value: optionTag?.value,
        text: optionTag?.text,
        selected: optionTag?.selected,
      };
      selectOptions.push(option);
    }
    return selectOptions;
  }
}
