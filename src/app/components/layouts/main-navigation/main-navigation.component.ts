import { Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
    selector: 'app-main-navigation',
    imports: [
        MatSidenavModule,
        MatToolbarModule,
        MatSlideToggle,
        MatIconModule,
        NavBarComponent,
    ],
    templateUrl: './main-navigation.component.html',
    styleUrl: './main-navigation.component.scss'
})
export class MainNavigationComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  onMenuClicked() {
    this.sidenav.open();
  }
}
