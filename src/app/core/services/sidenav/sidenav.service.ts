import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable, signal, WritableSignal } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { SideNavExpandableItem } from '../../interfaces/helpers/sidenav/side-nav-expandable-item';
import { SideNavItem } from '../../interfaces/helpers/sidenav/side-nav-item';

@Injectable({
  providedIn: 'root',
})
export class SidenavService {
  s_isOpened: WritableSignal<boolean> = signal<boolean>(true);
}
