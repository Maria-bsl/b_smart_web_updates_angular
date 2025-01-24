import { Pipe, PipeTransform } from '@angular/core';
import { SideNavItem } from '../../interfaces/helpers/sidenav/side-nav-item';

type NavItem = {
  rawLabel: string;
  icon: string;
  localized: string;
};

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
  private createNavItem(
    label: string,
    icon: string,
    localized: string
  ): NavItem {
    return {
      rawLabel: label,
      icon: icon,
      localized: localized,
    };
  }
  transform(node: SideNavItem, ...args: unknown[]): NavItem {
    switch (node.name?.trim()) {
      case 'Dashboard':
        return this.createNavItem(
          'Dashboard',
          'house-solid',
          'sideNavItems.Dashboard'
        );
      case 'Setup':
        return this.createNavItem(
          'Setup',
          'cookie-bite-solid',
          'sideNavItems.Setup'
        );
      case 'Email Resend':
        return this.createNavItem(
          'Email Resend',
          'paper-plane-solid',
          'sideNavItems.EmailResend'
        );
      case 'School Group':
        return this.createNavItem(
          'Email Resend',
          'group-arrows-rotate-solid',
          'sideNavItems.SchoolGroup'
        );
      case 'Change Password':
        return this.createNavItem(
          'Change password',
          'lock-solid',
          'sideNavItems.ChangePassword'
        );
      case 'Access Rights':
        return this.createNavItem(
          'Access Rights',
          'circle-exclamation-solid',
          'sideNavItems.AccessRights'
        );
      case 'Reset Password':
        return this.createNavItem(
          'Reset Password',
          'key-solid',
          'sideNavItems.ResetPassword'
        );
      case 'Block/UnBlock User':
        return this.createNavItem(
          'Block/UnBlock User',
          'ban-solid',
          'sideNavItems.Block/UnBlockUser'
        );
      case 'Notifications':
        return this.createNavItem(
          'Notifications',
          'bell-solid',
          'sideNavItems.Notifications'
        );
      case 'Send SMS to Parents':
        return this.createNavItem(
          'Send SMS to Parents',
          'comments-solid',
          'sideNavItems.SendSMSToParents'
        );
      case 'Schools':
        return this.createNavItem(
          'Schools',
          'landmark-solid',
          'sideNavItems.Schools'
        );
      case 'Fee Reverse Inbox':
        return this.createNavItem(
          'Fee Reverse Inbox',
          'clock-rotate-left-solid',
          'sideNavItems.FeeReverseInbox'
        );
      case 'Approvals':
        return this.createNavItem(
          'Approvals',
          'thumbs-up-solid',
          'sideNavItems.Approvals'
        );
      case 'Returns':
        return this.createNavItem(
          'Returns',
          'right-left-solid',
          'sideNavItems.Returns'
        );
      case 'Reports':
        return this.createNavItem(
          'Reports',
          'flag-solid',
          'sideNavItems.Returns'
        );
      case 'Audit Trail':
        return this.createNavItem(
          'Audit Trail',
          'chart-simple-solid',
          'sideNavItems.Returns'
        );
      default:
        return this.createNavItem(
          node.name ?? '',
          'chart-simple-solid',
          'sideNavItems.Returns'
        );
      //return node.name ?? '';
    }
  }
}
