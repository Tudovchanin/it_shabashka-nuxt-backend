
export class ValidateForm {
  public errorMessageEmail:string|null;
  public errorMessagePassword:string|null;
  public errorMessageName:string|null
  constructor() {
    this.errorMessageEmail = null;
    this.errorMessagePassword = null;
    this. errorMessageName = null;
  }
  isEmailValid(value: string, regexps: RegExp, errorMessageEmail:string) {
    if (!regexps.test(value)) {
      this.errorMessageEmail = errorMessageEmail;
      return false;
    } else {
      return true;
    }
  }
  isPasswordValid(value: string, regexps: RegExp, errorMessagePassword:string) {
    if (!regexps.test(value)) {
      this.errorMessagePassword = errorMessagePassword;
      return false;
    }  else {
      return true;
    }
  }
  isNameValid(value: string, regexps: RegExp, errorMessagePassword:string) {
    if (!regexps.test(value)) {
      this.errorMessageName = errorMessagePassword;
      return false;
    }  else {
      return true;
    }
  }



  clearStateError() {
    this.errorMessageEmail = null;
    this.errorMessagePassword = null;
    this.errorMessageName = null;
  }
}