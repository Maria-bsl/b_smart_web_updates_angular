import { Pipe, PipeTransform } from '@angular/core';
import { SideNavItem } from '../../interfaces/helpers/sidenav/side-nav-item';

@Pipe({
  name: 'isSidenavActiveLink',
  standalone: true,
})
export class IsActiveSidenavLinkPipe implements PipeTransform {
  transform(node: SideNavItem, currentPath: string): boolean {
    const childrenEndsWith = (nodes: SideNavItem[]): boolean => {
      let exists = nodes.some((item) => item.link?.href.endsWith(currentPath));
      return exists;
    };
    if (node.link && node.link.href !== '#') {
      let endsWith = node.link.href.endsWith(currentPath);
      return endsWith ? endsWith : childrenEndsWith(node.children ?? []);
    }
    return false;
  }
}

@Pipe({
  name: 'sidenavItemPipe',
  standalone: true,
})
export class SidenavItemPipePipe implements PipeTransform {
  transform(node: SideNavItem, ...args: unknown[]): string {
    switch (node.name?.trim()) {
      case 'Dashboard':
        return 'house-solid';
      case 'Setup':
        return 'cookie-bite-solid';
      case 'Email Resend':
        return 'paper-plane-solid';
      case 'School Group':
        return 'group-arrows-rotate-solid';
      case 'Change Password':
        return 'lock-solid';
      case 'Access Rights':
        return 'circle-exclamation-solid';
      case 'Reset Password':
        return 'key-solid';
      case 'Block/UnBlock User':
        return 'ban-solid';
      case 'Notifications':
        return 'bell-solid';
      case 'Send SMS to Parents':
        return 'comments-solid';
      case 'Schools':
        return 'landmark-solid';
      case 'Fee Reverse Inbox':
        return 'clock-rotate-left-solid';
      case 'Approvals':
        return 'thumbs-up-solid';
      case 'Returns':
        return 'right-left-solid';
      case 'Reports':
        return 'flag-solid';
      case 'Audit Trail':
        return 'chart-simple-solid';
      default:
        return '';
    }
  }
}
