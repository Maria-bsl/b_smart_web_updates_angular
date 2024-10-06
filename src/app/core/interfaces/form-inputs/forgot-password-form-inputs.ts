export interface ForgotPasswordFormInputs {
  username: HTMLInputElement;
  secretQuestion: HTMLSelectElement;
  answer: HTMLInputElement;
  capchaText: HTMLInputElement;
  capchaImage: HTMLImageElement;
  alternateCapcha: HTMLInputElement;
  backToLoginLink: HTMLAnchorElement;
  invalidCapcha: HTMLElement;
}

export interface ForgotPasswordFormActions {
  submitFormButton: HTMLInputElement;
}
