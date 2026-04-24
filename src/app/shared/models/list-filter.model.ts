import { SelectOption } from './select-option.model';

export interface ListFilterConfig {
  id: string;
  label: string;
  value: string;
  options: SelectOption[];
}
