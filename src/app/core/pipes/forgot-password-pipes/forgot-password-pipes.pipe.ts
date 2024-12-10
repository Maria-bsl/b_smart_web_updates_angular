import { Pipe, PipeTransform } from '@angular/core';
import { MElementPair } from '../../services/dom-manipulation/element-dom-manipulation.service';
import { EForgotPasswordForm } from '../../enums/forgot-password-form.enum';

type GetCapchaImageArgumentTypes = string | number;

@Pipe({
  name: 'getCapchaImageSourcePipe',
  standalone: true,
})
export class GetCapchaImageSourcePipe implements PipeTransform {
  transform(
    value: MElementPair,
    ...args: GetCapchaImageArgumentTypes[]
  ): unknown {
    if (value) {
      let capchaImage = value.get(
        EForgotPasswordForm.CAPCHA_IMAGE
      ) as HTMLImageElement;
      return capchaImage.src;
    } else {
      return '';
    }
  }
}
