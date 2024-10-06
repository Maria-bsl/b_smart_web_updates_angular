export interface SideNavItem {
  name: string;
  icon: string;
  link: string;
  children?: SideNavItem[];
}
