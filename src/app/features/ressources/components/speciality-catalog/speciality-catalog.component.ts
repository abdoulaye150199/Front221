import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '@shared/imports/standalone-imports';
import { SpecialityCatalogFacade } from './speciality-catalog.facade';

@Component({
  selector: 'app-speciality-catalog',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './speciality-catalog.component.html',
  styleUrls: ['./speciality-catalog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecialityCatalogComponent extends SpecialityCatalogFacade {}
