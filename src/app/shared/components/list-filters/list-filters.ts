import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LIST_FILTER_IMPORTS } from '../../imports/standalone-imports';
import { ListFilterConfig, SelectOption } from '../../models';

@Component({
  selector: 'app-list-filters',
  standalone: true,
  imports: [...LIST_FILTER_IMPORTS],
  templateUrl: './list-filters.html',
  styleUrls: ['./list-filters.scss'],
})
export class ListFiltersComponent {
  @Input({ required: true }) pageSizeLabel = '';
  @Input({ required: true }) pageSizeValue = '';
  @Input({ required: true }) pageSizeOptions: SelectOption[] = [];
  @Input() filters: ListFilterConfig[] = [];
  @Input() searchTerm = '';
  @Input() searchPlaceholder = 'Rechercher...';

  @Output() pageSizeChange = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<{ id: string; value: string }>();
  @Output() searchTermChange = new EventEmitter<string>();

  onFilterValueChange(id: string, value: string): void {
    this.filterChange.emit({ id, value });
  }
}
