import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionDestructionService } from './core/services/session-destruction.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  protected readonly title = signal('ecole-221');
  private sessionDestructionService = inject(SessionDestructionService);

  ngOnInit(): void {
    // Initialiser la surveillance de la session
    // Le service s'initialise automatiquement dans son constructeur
  }
}
