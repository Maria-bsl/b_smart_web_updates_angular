export interface AdmissionFormInputs {
  schoolName: HTMLSelectElement;
  academicYear: HTMLSelectElement;
  classGroup: HTMLSelectElement;
  indexNo: HTMLInputElement;
  studentName: HTMLInputElement;
  parentName: HTMLInputElement;
  parentMobile: HTMLInputElement;
  parentEmail: HTMLInputElement;
}

export interface AdmissionFormActions {
  submitButton: HTMLInputElement;
  cancelButton: HTMLInputElement;
}
