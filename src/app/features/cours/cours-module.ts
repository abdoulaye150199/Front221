import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursRoutingModule } from './cours-routing-module';
import { CoursComponent } from './cours';

@NgModule({
  declarations: [],
  imports: [CommonModule, CoursRoutingModule, CoursComponent],
})
export class CoursModule {}
