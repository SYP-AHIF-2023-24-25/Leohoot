import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appValidatePassword]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidatePasswordDirective , multi: true}]
})
export class ValidatePasswordDirective implements Validator{

  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    const regex: RegExp = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,64}$/);
    const isValid = regex.test(control.value);
    return isValid ? null : { invalidPassword: true };
  }
}
