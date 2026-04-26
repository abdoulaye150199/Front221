import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
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
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  readonly userInitial = headerData.userInitial;
  readonly userName = headerData.userName;
  readonly userRole = headerData.userRole;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/auth/login']);
  }
}
