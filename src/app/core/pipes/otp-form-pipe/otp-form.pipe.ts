import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getCountDown',
  standalone: true,
  pure: true,
})
export class OtpFormPipe implements PipeTransform {
  transform(remaining: number, ...args: unknown[]): string {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} `;
  }
}
