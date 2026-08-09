import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '@shared/imports/standalone-imports';
import { ParameterSettingsFacade } from './parameter-settings.facade';

/**
 * Conteneur de présentation des paramètres.
 *
 * L'état, la pagination, la validation et les opérations CRUD sont isolés
 * dans la façade afin de garder la couche Angular déclarative.
 */
@Component({
  selector: 'app-parameter-settings',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './parameter-settings.component.html',
  styleUrls: ['./parameter-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParameterSettingsComponent extends ParameterSettingsFacade {}
