import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionDestructionService } from './core/services/session-destruction.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  private readonly sessionDestructionService = inject(SessionDestructionService);
}
