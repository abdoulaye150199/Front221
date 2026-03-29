import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfesseursRoutingModule } from './professeurs-routing-module';
import { ProfesseursComponent } from './professeurs';

@NgModule({
  declarations: [],
  imports: [CommonModule, ProfesseursRoutingModule, ProfesseursComponent],
})
export class ProfesseursModule {}
