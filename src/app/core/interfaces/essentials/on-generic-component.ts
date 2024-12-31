import { Observable } from 'rxjs';
import { MElementPair } from '../../services/dom-manipulation/element-dom-manipulation.service';

export declare interface OnGenericComponent {
  /**
   * Comma separated list of document Ids present on a DOM
   */
  keys: string;
  /**
   * Document Id entries mapped to their respective HTML Element.
   */
  ids$: Observable<MElementPair>;
  /**
   * Maps components keys to their respective HTML Element.
   */
  initIds(): void;
  /**
   * Event handlers for the HTML Elements.
   */
  attachEventHandlers(): void;
  /**
   * Register custom svg icons
   */
  registerIcons(): void;
}
