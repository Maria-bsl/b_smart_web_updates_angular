export interface SideNavItem {
  name?: string;
  icon?: string;
  link?: HTMLAnchorElement;
  children?: SideNavItem[];
  isChild: boolean;
}
