import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfesseursComponent } from './professeurs';

const routes: Routes = [
  {
    path: '',
    component: ProfesseursComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfesseursRoutingModule {}
