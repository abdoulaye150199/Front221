import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PAGINATION_IMPORTS } from '../../imports/standalone-imports';

@Component({
  selector: 'app-number-pagination',
  standalone: true,
  imports: [...PAGINATION_IMPORTS],
  templateUrl: './number-pagination.html',
  styleUrl: './number-pagination.scss',
})
export class NumberPaginationComponent {
  @Input() currentPage = 1;
  @Input() pages: number[] = [];
  @Input() canPrev = false;
  @Input() canNext = false;

  @Output() pageChange = new EventEmitter<number>();
}
