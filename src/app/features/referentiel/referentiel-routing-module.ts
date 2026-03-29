import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferentielComponent } from './referentiel';

const routes: Routes = [
  {
    path: '',
    component: ReferentielComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferentielRoutingModule {}
