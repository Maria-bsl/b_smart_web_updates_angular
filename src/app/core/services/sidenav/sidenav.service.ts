import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
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
  private _transformer = (node: SideNavItem, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      level: level,
      name: node.name,
    };
  };
  treeControl = new FlatTreeControl<SideNavExpandableItem>(
    (node) => node.level,
    (node) => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: SideNavExpandableItem) => node.expandable;
  constructor() {}
  setDataSource(sidenavItems: SideNavItem[]) {
    this.dataSource.data = sidenavItems;
  }
  getLink(name: string) {
    return this.dataSource.data.find((e) => e.name === name)?.link;
  }
  getIcon(name: string) {
    return this.dataSource.data.find((e) => e.name === name)?.icon;
  }
  // public dataSource = new MatTreeFlatDataSource(
  //   this.treeControl,
  //   this.treeFlattener
  // );
}
