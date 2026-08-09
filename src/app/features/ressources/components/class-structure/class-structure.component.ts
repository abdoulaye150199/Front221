import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '@shared/imports/standalone-imports';
import { ClassStructureFacade } from './class-structure.facade';

@Component({
  selector: 'app-class-structure',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './class-structure.component.html',
  styleUrls: ['./class-structure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClassStructureComponent extends ClassStructureFacade {}
