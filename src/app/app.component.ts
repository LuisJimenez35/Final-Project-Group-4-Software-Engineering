import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterModule,
    CommonModule, HttpClientModule ]
})
export class AppComponent {
  title = 'AngularApp';

  sidenavOpened = false;

  openSidenav() {
    this.sidenavOpened = true;
  }

  closeSidenav() {
    this.sidenavOpened = false;
  }
}