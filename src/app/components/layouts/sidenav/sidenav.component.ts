import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { SidenavService } from 'src/app/core/services/sidenav/sidenav.service';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

type SideNav = { name: string; icon: string };

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    CommonModule,
    RouterModule,
    MatTreeModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  animations: [
    trigger('*<=1', [
      state(
        '*',
        style({
          height: 0,
        })
      ),
      state(
        'show',
        style({
          height: '*',
        })
      ),
      transition('* => *', [animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')]),
      //transition(':enter', [style({ opacity: 0, height: '*' }), animate(350)]),
    ]),
  ],
})
export class SidenavComponent {
  // sidenavItems = new FormArray([], []);
  // constructor(
  //   public sidenavService: SidenavService,
  //   private fb: FormBuilder,
  //   private tr: TranslocoService //private sidenavService: SidenavService
  // ) {}
  // ngOnInit(): void {
  //   this.tr.selectTranslation('en').subscribe({
  //     next: (result) => {
  //       this.sidenavService.setDataSource(result['sidenavItems']);
  //     },
  //   });
  // }
  // ngAfterViewInit(): void {}
  // getSideNavItems(sidenavItems: any[]) {
  //   return sidenavItems;
  // }
  // nodeClicked(node: any) {
  //   if (this.sidenavService.treeControl.isExpanded(node)) {
  //     let parent = null;
  //     let index = this.sidenavService.treeControl.dataNodes.findIndex(
  //       (n) => n === node
  //     );
  //     for (let i = index; i >= 0; i--) {
  //       if (node.level > this.sidenavService.treeControl.dataNodes[i].level) {
  //         parent = this.sidenavService.treeControl.dataNodes[i];
  //         break;
  //       }
  //     }
  //     if (parent) {
  //       this.sidenavService.treeControl.collapseDescendants(parent);
  //       this.sidenavService.treeControl.expand(parent);
  //     } else {
  //       this.sidenavService.treeControl.collapseAll();
  //     }
  //     this.sidenavService.treeControl.expand(node);
  //   }
  // }
}
