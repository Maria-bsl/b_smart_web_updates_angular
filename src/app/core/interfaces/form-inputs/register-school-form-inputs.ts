export interface AccoountDetailsFormInputs {
  accountNoInput: HTMLInputElement;
  currenySelect: HTMLSelectElement;
  removeInput: HTMLInputElement;
}

export interface RegisterSchoolFormActions {
  addRowButton: HTMLInputElement;
  cancelButton: HTMLInputElement;
  registerButton: HTMLInputElement;
}

export interface RegisterSchoolFormInputs {
  schoolNameInput: HTMLInputElement;
  schoolAcronymInput: HTMLInputElement;
  institutionIdInput: HTMLInputElement;
  schoolRegNoInput: HTMLInputElement;
  authorizedUserInput: HTMLInputElement;
  branchNameSelect: HTMLSelectElement;
  emailAddressInput: HTMLInputElement;
  countriesSelect: HTMLSelectElement;
  regionSelect: HTMLSelectElement;
  districtSelect: HTMLSelectElement;
  wardSelect: HTMLSelectElement;
  addressInput: HTMLInputElement;
  websiteInput: HTMLInputElement;
  phoneNumber: HTMLInputElement;
  mobileNumber: HTMLInputElement;
  accountDetails: AccoountDetailsFormInputs[];
}

export interface UpdateSchoolFormInputs extends RegisterSchoolFormInputs {
  activeSchoolName: HTMLSelectElement;
}

export interface UpdateSchoolFormActions extends RegisterSchoolFormActions {}
