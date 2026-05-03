import { Component, inject, signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { PlacesService } from '../../services/places';
import { MapEngineService } from '../../services/map-engine';

@Component({
  selector: 'app-map-legend',
  imports: [KeyValuePipe],
  templateUrl: './map-legend.html',
  styles: `:host { display: block; }`,
})
export class MapLegend {
  protected places = inject(PlacesService);
  private engine = inject(MapEngineService);

  protected isOpen = signal(false);

  toggle(): void { this.isOpen.update(v => !v); }

  toggleCategory(key: string): void {
    this.places.toggleCategory(key);
    this.engine.draw();
  }

  isDimmed(key: string): boolean {
    return !this.places.activeCategoryFilters().has(key);
  }

  keepOrder = (): number => 0;
}
