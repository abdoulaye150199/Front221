import { Component } from '@angular/core';
import { FORM_ACTION_IMPORTS } from '../../shared/imports/standalone-imports';

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [...FORM_ACTION_IMPORTS],
  templateUrl: './paiement.html',
  styleUrl: './paiement.scss',
})
export class PaiementComponent {
  searchTerm = '';
}
