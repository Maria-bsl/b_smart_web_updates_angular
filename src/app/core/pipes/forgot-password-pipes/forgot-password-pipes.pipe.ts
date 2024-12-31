import { Pipe, PipeTransform } from '@angular/core';
import { MElementPair } from '../../services/dom-manipulation/element-dom-manipulation.service';
import { EForgotPasswordForm } from '../../enums/forgot-password-form.enum';
import { ELoginForm } from '../../enums/login-form';

type GetCapchaImageArgumentTypes = string | number;

@Pipe({
  name: 'getCapchaImageSourcePipe',
  standalone: true,
})
export class GetCapchaImageSourcePipe implements PipeTransform {
  transform(value: MElementPair, id: number): unknown {
    if (value) {
      let capchaImage = value.get(id) as HTMLImageElement;
      return capchaImage.src;
    } else {
      return '';
    }
  }
}
