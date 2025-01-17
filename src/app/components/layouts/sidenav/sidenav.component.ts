import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
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
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { AppConst } from 'src/app/utilities/app-consts';
import { OnGenericComponent } from 'src/app/core/interfaces/essentials/on-generic-component';
import { TranslateModule } from '@ngx-translate/core';

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
    TranslateModule,
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
  literalsText: string = ``;
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
  @ViewChild(MatSidenav) _sidenav!: MatSidenav;
  s_sidenavWidth = signal<number>(0);
  SIDEBAR_SIZES = [60, 260];
  AppConst: typeof AppConst = AppConst;
  ids$!: Observable<MElementPair>;
  s_isFullyExpanded = signal<boolean>(true);
  constructor(
    private domService: ElementDomManipulationService,
    private unsubscribe: UnsubscribeService,
    private _appConfig: AppConfigService,
    private _sidenavService: SidenavService
  ) {
    //this._appConfig.initLanguage();
    this.registerIcons();
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
        if (entry.contentRect.width > 200) {
          this.s_isFullyExpanded.set(true);
        } else {
          this.s_isFullyExpanded.set(false);
          this.treeControl.collapseAll();
        }
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
  registerIcons(): void {
    const icons = [
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
    const feather = ['chevron-right', 'chevron-down', 'chevron-up'];
    this._appConfig.addIcons(feather, '../assets/assets/feather');
    this._appConfig.addIcons(icons, '../assets/assets/icons');
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
  toggleNode(node: SideNavItem, button: HTMLButtonElement) {
    const toggle = () => {
      if (this.treeControl.isExpanded(node)) {
        this.treeControl.collapse(node);
      } else {
        this.treeControl.collapseAll();
        this.treeControl.expand(node);
      }
    };
    this.sidebar$.subscribe({
      next: (sidebar) => {
        if (sidebar) {
          setTimeout(() => {
            if (!sidebar.classList.contains('show-lite')) {
              sidebar.classList.add('show-lite');
              toggle();
            }
          }, 50);
        }
      },
      error: (err) => console.error(err.message),
    });
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
  get isOpenedSidebar() {
    return this._sidenavService.s_isOpened();
  }
  get sidebar$() {
    return this.ids$.pipe(
      this.unsubscribe.takeUntilDestroy,
      map((e) => e.get(ESideBarForm.SIDEBAR) as HTMLDivElement)
    );
  }
}
