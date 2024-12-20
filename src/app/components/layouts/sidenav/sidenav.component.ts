import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChange,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import {
  MatTree,
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
  MatTreeNestedDataSource,
} from '@angular/material/tree';
import { SidenavService } from 'src/app/core/services/sidenav/sidenav.service';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';
import {
  ElementDomManipulationService,
  MElementPair,
} from 'src/app/core/services/dom-manipulation/element-dom-manipulation.service';
import { ESideBarForm } from 'src/app/core/enums/sidebar.enum';
import { UnsubscribeService } from 'src/app/core/services/unsubscribe-service/unsubscribe.service';
import { delay, map, Observable, of } from 'rxjs';
import { SideNavItem } from 'src/app/core/interfaces/helpers/sidenav/side-nav-item';
import { AppConfigService } from 'src/app/core/services/app-config/app-config.service';
import { MatButtonModule } from '@angular/material/button';
import { NestedTreeControl } from '@angular/cdk/tree';
import { sidenavAnimation } from 'src/app/shared/animations/side-nav-slide.animation';
import {
  IsActiveSidenavLinkPipe,
  SidenavItemPipePipe,
} from 'src/app/core/pipes/sidenav-pipe/sidenav-item-pipe.pipe';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppConst } from 'src/app/utilities/app-consts';
import { OnGenericComponent } from 'src/app/core/interfaces/essentials/on-generic-component';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    CommonModule,
    MatTreeModule,
    MatButtonModule,
    MatSidenavModule,
    SidenavItemPipePipe,
    IsActiveSidenavLinkPipe,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  animations: [sidenavAnimation],
  encapsulation: ViewEncapsulation.Emulated,
})
export class SidenavComponent
  implements AfterViewInit, OnChanges, OnGenericComponent
{
  @Input('keys') keys: string = '';
  @Input('literals-text')
  literalsText: string = `<li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='txKulA'><img class='link-thumbnail' src='/images/dashboard-icon.png' /><span class='app-link__text'>Dashboard</span></a></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='#'><img class='link-thumbnail' src='/assets/feather/sliders.svg' /><span class='app-link__text'>Setup</span></span><span class='dropdown-icon position-absolute'><i class='fas fa-angle-down'></i></span></a><ul class='app-nav__dropdown px-2 list-unstyled' aria-labelledby='my-dropdown'><li><a class='links dp__app-link d-block' href='t0HDIA'><span>Academic</span></a></li><li><a class='links dp__app-link d-block' href='Y765WI'><span>Designation</span></a></li><li><a class='links dp__app-link d-block' href='SetupZone.aspx'><span>Zone</span></a></li><li><a class='links dp__app-link d-block' href='aLN1Na'><span>Region</span></a></li><li><a class='links dp__app-link d-block' href='oDUNHF'><span>District</span></a></li><li><a class='links dp__app-link d-block' href='F4eXwM'><span>Ward</span></a></li><li><a class='links dp__app-link d-block' href='1llJU8'><span>Medium</span></a></li><li><a class='links dp__app-link d-block' href='2177qc'><span>Term</span></a></li><li><a class='links dp__app-link d-block' href='e0J8aG'><span>Bank Branches</span></a></li><li><a class='links dp__app-link d-block' href='LlGggp'><span>Fee</span></a></li><li><a class='links dp__app-link d-block' href='ipmNt3'><span>Questions</span></a></li><li><a class='links dp__app-link d-block' href='UjnDj4'><span>Create User</span></a></li><li><a class='links dp__app-link d-block' href='SetupAModule.aspx'><span>Access Modules</span></a></li><li><a class='links dp__app-link d-block' href='SetupPackage.aspx'><span>Packages</span></a></li><li><a class='links dp__app-link d-block' href='SetupPackageP.aspx'><span>Package Price</span></a></li><li><a class='links dp__app-link d-block' href='Edays.aspx'><span>Password Aging</span></a></li><li><a class='links dp__app-link d-block' href='Bsc3r8'><span>SMTP Configuration</span></a></li><li><a class='links dp__app-link d-block' href='SetupSMS.aspx'><span>SMS Configuration</span></a></li><li><a class='links dp__app-link d-block' href='SetupEText.aspx'><span>Email Text</span></a></li><li><a class='links dp__app-link d-block' href='SetupSText.aspx'><span>SMS Text</span></a></li></li></ul><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='3fMukD'><img class='link-thumbnail' src='/assets/feather/mail.svg' /><span class='app-link__text'>Email Resend</span></a></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='SchoolGroup.aspx'><img class='link-thumbnail' src='/assets/feather/lock.svg' /><span class='app-link__text'>School Group</span></a></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='WeLgvw'><img class='link-thumbnail' src='/assets/feather/lock.svg' /><span class='app-link__text'>Change Password</span></a></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='DRHkv1'><img class='link-thumbnail' src='/assets/feather/shield.svg' /><span class='app-link__text'>Access Rights</span></a></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='77dy0j'><img class='link-thumbnail' src='/assets/feather/key.svg' /><span class='app-link__text'>Reset Password</span></a></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='34dy0j'><img class='link-thumbnail' src='/assets/feather/user-x.svg' /><span class='app-link__text'>Block/UnBlock User</span></a></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='Notifications.aspx'><img class='link-thumbnail' src='/assets/feather/user-x.svg' /><span class='app-link__text'>Notifications</span></a></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='Parent_Det_SMS.aspx'><img class='link-thumbnail' src='/assets/feather/user-x.svg' /><span class='app-link__text'>Send SMS to Parents</span></a></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='#'><img class='link-thumbnail' src='/assets/feather/server.svg' /><span class='app-link__text'>Schools</span></span><span class='dropdown-icon position-absolute'><i class='fas fa-angle-down'></i></span></a><ul class='app-nav__dropdown px-2 list-unstyled' aria-labelledby='my-dropdown'><li><a class='links dp__app-link d-block' href='emyf7z'><span>School Registration</span></a></li><li><a class='links dp__app-link d-block' href='KmAabM'><span>Update School Info</span></a></li></ul></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='#'><img class='link-thumbnail' src='/assets/feather/refresh-ccw.svg' /><span class='app-link__text'>Fee Reverse Inbox</span><span class='dropdown-icon position-absolute'><i class='fas fa-angle-down'></i></span></a><ul class='app-nav__dropdown px-2 list-unstyled' aria-labelledby='my-dropdown'><li><a class='links dp__app-link d-block' href='K5A9bM'><span>Fee Reverse Inbox</span></a></li><li><a class='links dp__app-link d-block' href='KmA9bM'><span>Fee Reverse</span></a></li></ul></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='#'><img class='link-thumbnail' src='/assets/feather/check-circle.svg' /><span class='app-link__text'>Approvals</span><span class='dropdown-icon position-absolute'><i class='fas fa-angle-down'></i></span></a><ul class='app-nav__dropdown px-2 list-unstyled' aria-labelledby='my-dropdown'><li><a class='links dp__app-link d-block' href='R1Smf9'><span>School Registration</span></a></li><li><a class='links dp__app-link d-block' href='RRSmf9'><span>School Modification</span></a></li></ul></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='#'><img class='link-thumbnail' src='/assets/feather/check-square.svg' /><span class='app-link__text'>Returns</span></span><span class='dropdown-icon position-absolute'><i class='fas fa-angle-down'></i></span></a><ul class='app-nav__dropdown px-2 list-unstyled' aria-labelledby='my-dropdown'><li><a class='links dp__app-link d-block' href='InboxR.aspx'><span>School Registration</span></a></li><li><a class='links dp__app-link d-block' href='UInboxR.aspx'><span>School Modification</span></a></li></ul></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='#'><img class='link-thumbnail' src='/assets/feather/file-text.svg' /><span class='app-link__text'>Reports</span><span class='dropdown-icon position-absolute'><i class='fas fa-angle-down'></i></span></a><ul class='app-nav__dropdown px-2 list-unstyled' aria-labelledby='my-dropdown'><li><a class='links dp__app-link d-block' href='sWCg36'><span>Registered School</span></a></li><li><a class='links dp__app-link d-block' href='o0Fudz'><span>School Fee Allocation</span></a></li><li><a class='links dp__app-link d-block' href='F2p55f'><span>Charges to School</span></a></li><li><a class='links dp__app-link d-block' href='uojmeU'><span>Student Details</span></a></li><li><a class='links dp__app-link d-block' href='AcadStu_Report.aspx'><span>Academic Student Details</span></a></li><li><a class='links dp__app-link d-block' href='KKz9CM'><span>Idle Schools</span></a></li><li><a class='links dp__app-link d-block' href='SkR0Ti'><span>Fee Details</span></a></li><li><a class='links dp__app-link d-block' href='AFee_Bal_Report.aspx'><span>Admission Fee Details</span></a></li><li><a class='links dp__app-link d-block' href='65g6rq'><span>Payment Details</span></a></li><li><a class='links dp__app-link d-block' href='IuNT2v'><span>Fee Balance</span></a></li><li><a class='links dp__app-link d-block' href='F2p9tf'><span>Payment Summary</span></a></li><li><a class='links dp__app-link d-block' href='KmASfM'><span>School Invoices</span></a></li><li><a class='links dp__app-link d-block' href='UsersList.aspx'><span>Users(Bank) List</span></a></li><li><a class='links dp__app-link d-block' href='UsersListS.aspx'><span>Users(Schools) List</span></a></li><li><a class='links dp__app-link d-block' href='Parent_Det_Report.aspx'><span>Parent Details</span></a></li><li><a class='links dp__app-link d-block' href='Schools_Logs_Report.aspx'><span>School Logs</span></a></li></ul></li><li class='app-nav__item'><a class='links app-link app-link__dropdown position-relative' href='#'><img class='link-thumbnail' src='/assets/feather/clipboard.svg' /><span class='app-link__text'>Audit Trail</span><span class='dropdown-icon position-absolute'><i class='fas fa-angle-down'></i></span></a><ul class='app-nav__dropdown px-2 list-unstyled' aria-labelledby='my-dropdown'><li><a class='links dp__app-link d-block' href='NkUuTt'><span>Academic</span></a></li><li><a class='links dp__app-link d-block' href='3siK47'><span>Designation</span></a></li><li><a class='links dp__app-link d-block' href='4tgb3D'><span>Region</span></a></li><li><a class='links dp__app-link d-block' href='I9sjyJ'><span>District</span></a></li><li><a class='links dp__app-link d-block' href='MXytPr'><span>Ward</span></a></li><li><a class='links dp__app-link d-block' href='ADo10Y'><span>Medium</span></a></li><li><a class='links dp__app-link d-block' href='iGCnMi'><span>Term</span></a></li><li><a class='links dp__app-link d-block' href='K04y9A'><span>Fee</span></a></li><li><a class='links dp__app-link d-block' href='PRdHMa'><span>Create User</span></a></li><li><a class='links dp__app-link d-block' href='fgJEox'><span>SMTP Configuration</span></a></li><li><a class='links dp__app-link d-block' href='EEfFL8'><span>Class</span></a></li><li><a class='links dp__app-link d-block' href='R3iBVX'><span>Section</span></a></li><li><a class='links dp__app-link d-block' href='Ezh3Ct'><span>Allocation</span></a></li><li><a class='links dp__app-link d-block' href='ibDBJI'><span>School Users</span></a></li><li><a class='links dp__app-link d-block' href='KndRxB'><span>Students</span></a></li><li><a class='links dp__app-link d-block' href='CVSKEj'><span>Fee Data</span></a></li></ul></li>`;
  @Output('togglesidebar') toggleSideBar: EventEmitter<void> =
    new EventEmitter<void>();
  treeControl = new NestedTreeControl<SideNavItem>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<SideNavItem>();
  currentPathName = signal<string>(location.pathname);
  hasChild = (_: number, node: SideNavItem) =>
    !!node.children && node.children.length > 0;
  @ViewChild(MatTree<SideNavItem, SideNavItem>) tree!: MatTree<
    SideNavItem,
    SideNavItem
  >;
  @ViewChild('treeElementContainer', { static: false, read: ElementRef })
  treeElementContainer!: ElementRef;
  s_sidenavWidth = signal<number>(0);
  SIDEBAR_SIZES = [60, 260];
  AppConst: typeof AppConst = AppConst;
  ids$!: Observable<MElementPair>;
  constructor(
    private domService: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService
  ) {
    let icons = [
      'house-solid',
      'cookie-bite-solid',
      'paper-plane-solid',
      'circle-exclamation-solid',
      'lock-solid',
      'circle-info-solid',
      'key-solid',
      'ban-solid',
      'bell-solid',
      'comments-solid',
      'landmark-solid',
      'clock-rotate-left-solid',
      'thumbs-up-solid',
      'right-left-solid',
      'flag-solid',
      'chart-simple-solid',
      'group-arrows-rotate-solid',
    ];
    let feather = ['chevron-right', 'chevron-down', 'chevron-up'];
    this._appConfig.addIcons(feather, '../assets/assets/feather');
    this._appConfig.addIcons(icons, '../assets/assets/icons');

    //this._appConfig.addIcons(feather, '/assets/feather');
    //this._appConfig.addIcons(icons, '/assets/icons');
  }
  private literalsTextChanged(change: SimpleChange) {
    this.parseLiteralsTextHandler();
  }
  private parseSideNavItems(literals: HTMLLIElement[]) {
    const getIconImage = (anchor: HTMLAnchorElement, index: number) => {
      const img = anchor.querySelector('img');
      (!img || !img?.src) &&
        console.warn(`Nav item at index ${index} does not have an image.`);
      return img?.src ?? '';
    };
    const getName = (
      anchor: HTMLAnchorElement,
      index: number,
      childIndex?: number
    ) => {
      const msg = childIndex
        ? `Span text element of child item at index ${childIndex} for item at index ${index} was not found.`
        : `Span text element at index ${index} was not found.`;
      const span = anchor.querySelector('span');
      !span && console.warn(msg);
      return span?.innerHTML;
    };
    const parseChildItems = (ul: HTMLUListElement, parentIndex: number) => {
      const lis = ul.querySelectorAll('li');
      let children: SideNavItem[] = [];
      lis.forEach((li, index) => {
        const anchor = li.querySelector('a')!;
        const navItem: SideNavItem = {
          link: anchor,
          icon: '',
          name: getName(anchor, parentIndex, index),
          children: [],
          isChild: true,
        };
        children.push(navItem);
      });
      return children;
    };
    const getChildren = (literal: HTMLLIElement, index: number) => {
      const anchor = literal.querySelector('a')!;
      const ul = literal.querySelector('ul');
      const navItem: SideNavItem = {
        link: anchor,
        icon: getIconImage(anchor, index),
        name: getName(anchor, index),
        children: ul ? parseChildItems(ul, index) : [],
        isChild: false,
      };
      return navItem;
    };

    const sidenavItems = literals.map((literal, index) =>
      getChildren(literal, index)
    );
    this.dataSource.data = sidenavItems;
  }
  private parseLiteralsTextHandler() {
    const parseLiterals = (literals: string) => {
      const ul = document.createElement('ul');
      ul.innerHTML = literals;
      return Array.from(ul.querySelectorAll('li'));
    };
    const isValidLiteral = (li: HTMLLIElement) => {
      return li.classList.contains('app-nav__item');
    };
    const literals$ = of(this.literalsText);
    literals$
      .pipe(
        this.unsubscribe.takeUntilDestroy,
        map((html) =>
          parseLiterals(html).filter((literal) => isValidLiteral(literal))
        )
      )
      .subscribe({
        next: (literals) => this.parseSideNavItems(literals),
        error: (err) => console.error(err),
      });
  }
  private initSidebar() {
    const sidebar$ = this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(ESideBarForm.SIDEBAR) as HTMLDivElement)
    );
    const resizeObserver = (sidebar: HTMLDivElement) => {
      const adjustSidebar = (entry: ResizeObserverEntry) => {
        console.log(entry.contentRect.width);
      };
      const observer = new ResizeObserver((entries) => {
        entries.forEach(adjustSidebar);
      });
      observer.observe(sidebar);
    };
    sidebar$.subscribe({
      next: (sidebar) => resizeObserver(sidebar),
      error: (err) => console.error(err),
    });
  }
  ngAfterViewInit(): void {
    this.initIds();
    if (this.literalsText) {
      this.parseLiteralsTextHandler();
    }
    this.initSidebar();
  }
  attachEventHandlers(): void {}
  initIds() {
    this.ids$ = new Observable((subscriber) => {
      const ids = this.domService.getDocumentElements(
        this.keys,
        Object.keys(ESideBarForm).filter((key) => isNaN(Number(key))).length
      );
      ids.size > 0 && subscriber.next(ids);
      subscriber.complete();
    });
  }
  toggleNode(node: SideNavItem) {
    if (node.isChild) return;
    else if (this.treeControl.isExpanded(node)) {
      this.treeControl.collapse(node);
    } else {
      this.treeControl.collapseAll();
      this.treeControl.expand(node);
    }
  }
  nodeClicked(event: MouseEvent, node: SideNavItem) {
    node.link?.href &&
      node.link?.href !== '#' &&
      this.domService.clickAnchorHref(node.link!);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['literalsText']) {
      this.literalsTextChanged(changes['literalsText']);
    }
  }
  get treeStyle() {
    return window.getComputedStyle(this.treeElementContainer.nativeElement);
  }
}
