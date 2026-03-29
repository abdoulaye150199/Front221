import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class HeaderComponent {
  userInitial = 'A';
  userName = 'Amadou Diallo';
  userRole = 'Administrateur';
}
