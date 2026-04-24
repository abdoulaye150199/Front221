import { Component } from '@angular/core';
import { MAIN_LAYOUT_IMPORTS } from '../imports/page-imports';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [...MAIN_LAYOUT_IMPORTS],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.scss'],
})
export class MainLayoutComponent {}
