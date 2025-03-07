import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [RouterModule]
})
export class AppComponent implements OnInit {
  switchTheme = new FormControl<boolean>(false);
  @HostBinding('class') className = '';
  lightClass = 'light-theme';
  darkClass = 'dark-theme';
  private initTheme() {
    this.className = this.switchTheme.value ? this.darkClass : this.lightClass;
    this.switchTheme.valueChanges.subscribe({
      next: (result) => {
        this.className = result ? this.darkClass : this.lightClass;
        if (result) {
          document.body.classList.add(this.darkClass);
          document.body.classList.remove(this.lightClass);
        } else {
          document.body.classList.add(this.lightClass);
          document.body.classList.remove(this.darkClass);
        }
      },
    });
  }
  ngOnInit(): void {
    //document.body.classList.add('dark-theme');
    //this.initTheme();
    console.log('it is now on hello world');
  }
}
