import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { APP_DATA } from '../../data';
import { HEADER_IMPORTS } from '../../imports/standalone-imports';

interface HeaderData {
  userInitial: string;
  userName: string;
  userRole: string;
}

const headerData = APP_DATA.shared.header as HeaderData;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [...HEADER_IMPORTS],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  readonly userInitial = headerData.userInitial;
  readonly userName = headerData.userName;
  readonly userRole = headerData.userRole;

  constructor(private readonly router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }
}
