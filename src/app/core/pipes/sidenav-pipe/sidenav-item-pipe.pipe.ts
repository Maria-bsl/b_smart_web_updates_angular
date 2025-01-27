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
          'sideNavItems.Reports'
        );
      case 'Audit Trail':
        return this.createNavItem(
          'Audit Trail',
          'chart-simple-solid',
          'sideNavItems.AuditTrail'
        );
      case 'Academic':
        return this.createNavItem('Academic', '', 'sideNavItems.Academic');
      case 'Designation':
        return this.createNavItem(
          'Designation',
          '',
          'sideNavItems.Designation'
        );
      case 'Zone':
        return this.createNavItem('Zone', '', 'sideNavItems.Zone');
      case 'Region':
        return this.createNavItem('Region', '', 'sideNavItems.Region');
      case 'District':
        return this.createNavItem('District', '', 'sideNavItems.District');
      case 'Ward':
        return this.createNavItem('Ward', '', 'sideNavItems.Ward');
      case 'Medium':
        return this.createNavItem('Medium', '', 'sideNavItems.Medium');
      case 'Term':
        return this.createNavItem('Term', '', 'sideNavItems.Term');
      case 'Bank Branches':
        return this.createNavItem(
          'Bank Branches',
          '',
          'sideNavItems.BankBranches'
        );
      case 'Fee':
        return this.createNavItem('Fee', '', 'sideNavItems.Fee');
      case 'Questions':
        return this.createNavItem('Questions', '', 'sideNavItems.Questions');
      case 'Create User':
        return this.createNavItem('Create User', '', 'sideNavItems.CreateUser');
      case 'Access Modules':
        return this.createNavItem(
          'Access Modules',
          '',
          'sideNavItems.AccessModules'
        );
      case 'Password Aging':
        return this.createNavItem(
          'Password Aging',
          '',
          'sideNavItems.PasswordAging'
        );
      case 'SMTP Configuration':
        return this.createNavItem(
          'SMTP Configuration',
          '',
          'sideNavItems.SMTPConfiguration'
        );
      case 'Email Text':
        return this.createNavItem(
          'SMTP Configuration',
          '',
          'sideNavItems.SMTPConfiguration'
        );
      case 'SMS Text':
        return this.createNavItem('SMS Text', '', 'sideNavItems.SMSText');
      case 'School Registration':
        return this.createNavItem(
          'School Registration',
          '',
          'sideNavItems.SchoolRegistration'
        );
      case 'School Modification':
        return this.createNavItem(
          'School Modification',
          '',
          'sideNavItems.SchoolModification'
        );
      case 'School Deletion':
        return this.createNavItem(
          'School Deletion',
          '',
          'sideNavItems.SchoolDeletion'
        );
      case 'School Deletion':
        return this.createNavItem(
          'School Deletion',
          '',
          'sideNavItems.SchoolDeletion'
        );
      case 'Registered School':
        return this.createNavItem(
          'Registered School',
          '',
          'sideNavItems.RegisteredSchool'
        );
      case 'School Fee Allocation':
        return this.createNavItem(
          'School Fee Allocation',
          '',
          'sideNavItems.SchoolFeeAllocation'
        );
      case 'Student Details':
        return this.createNavItem(
          'Student Details',
          '',
          'sideNavItems.StudentDetails'
        );
      case 'Academic Student Details':
        return this.createNavItem(
          'Academic Student Details',
          '',
          'sideNavItems.AcademicStudentDetails'
        );
      case 'Idle Schools':
        return this.createNavItem(
          'Idle Schools',
          '',
          'sideNavItems.IdleSchools'
        );
      case 'Fee Details':
        return this.createNavItem('Fee Details', '', 'sideNavItems.FeeDetails');
      case 'Fee Details Summary':
        return this.createNavItem(
          'Fee Details Summary',
          '',
          'sideNavItems.FeeDetailsSummary'
        );
      case 'Admission Fee Details':
        return this.createNavItem(
          'Admission Fee Details',
          '',
          'sideNavItems.AdmissionFeeDetails'
        );
      case 'Payment Details':
        return this.createNavItem(
          'Payment Details',
          '',
          'sideNavItems.PaymentDetails'
        );
      case 'Fee Balance':
        return this.createNavItem('Fee Balance', '', 'sideNavItems.FeeBalance');
      case 'Fee Balance Summary':
        return this.createNavItem(
          'Fee Balance Summary',
          '',
          'sideNavItems.FeeBalanceSummary'
        );
      case 'Payment Summary':
        return this.createNavItem(
          'Payment Summary',
          '',
          'sideNavItems.PaymentSummary'
        );
      case 'School Invoices':
        return this.createNavItem(
          'School Invoices',
          '',
          'sideNavItems.SchoolInvoices'
        );
      case 'Users(Bank) List':
        return this.createNavItem(
          'Users (Bank) List',
          '',
          'sideNavItems.UsersBankList'
        );
      case 'Users(Schools) List':
        return this.createNavItem(
          'Users (Schools) List',
          '',
          'sideNavItems.UsersSchoolsList'
        );
      case 'Parent Details':
        return this.createNavItem(
          'Parent Details',
          '',
          'sideNavItems.ParentDetails'
        );
      case 'School Logs':
        return this.createNavItem('School Logs', '', 'sideNavItems.SchoolLogs');
      case 'Class':
        return this.createNavItem('Class', '', 'sideNavItems.Class');
      case 'Section':
        return this.createNavItem('Section', '', 'sideNavItems.Section');
      case 'Allocation':
        return this.createNavItem('Allocation', '', 'sideNavItems.Allocation');
      case 'School Users':
        return this.createNavItem(
          'School Users',
          '',
          'sideNavItems.SchoolUsers'
        );
      case 'Students':
        return this.createNavItem('Students', '', 'sideNavItems.Students');
      case 'Fee Data':
        return this.createNavItem('Fee Data', '', 'sideNavItems.FeeData');
      default:
        return this.createNavItem(
          'Mokokoli mpe moko',
          'chart-simple-solid',
          node.name ?? 'Mokokoli mpe moko'
        );
      //return node.name ?? '';
    }
  }
}
