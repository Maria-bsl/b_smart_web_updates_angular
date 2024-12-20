import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const sidenavAnimation = trigger('slideVertical', [
  state(
    '*',
    style({
      height: 0,
    })
  ),
  state(
    'show',
    style({
      height: '*',
    })
  ),
  transition('* => *', [animate('500ms cubic-bezier(0.25, 0.8, 0.25, 1)')]),
]);
