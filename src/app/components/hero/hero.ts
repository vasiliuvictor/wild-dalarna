import { Component, inject, output } from '@angular/core';
import { PlacesService } from '../../services/places';

@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styles: `
    :host { display: block; }
  `,
})
export class Hero {
  protected places = inject(PlacesService);
  readonly scrollToApp = output<void>();

  scrollDown(): void {
    this.scrollToApp.emit();
  }
}
