import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNavigationComponent } from './main-navigation.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TranslateModule } from '@ngx-translate/core';
import { provideHttpClient } from '@angular/common/http';

describe('MainNavigationComponent', () => {
  let component: MainNavigationComponent;
  let fixture: ComponentFixture<MainNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainNavigationComponent, TranslateModule.forRoot()],
      providers: [provideAnimationsAsync(), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(MainNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
