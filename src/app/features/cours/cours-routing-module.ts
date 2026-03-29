import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursComponent } from './cours';

const routes: Routes = [
  {
    path: '',
    component: CoursComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoursRoutingModule {}
