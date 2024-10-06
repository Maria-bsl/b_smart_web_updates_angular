import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-admin-navigation',
  standalone: true,
  imports: [RouterModule, MatCardModule, MatToolbarModule, MatSlideToggle],
  templateUrl: './admin-navigation.component.html',
  styleUrl: './admin-navigation.component.scss',
})
export class AdminNavigationComponent {}
