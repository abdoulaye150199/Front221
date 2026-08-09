import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '@shared/imports/standalone-imports';
import { UeModuleFacade } from './ue-module.facade';

@Component({
  selector: 'app-ue-module',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './ue-module.component.html',
  styleUrls: ['./ue-module.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UeModuleComponent extends UeModuleFacade {}
