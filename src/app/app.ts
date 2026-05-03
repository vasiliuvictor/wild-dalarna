import { Component, inject, signal, ViewChild } from '@angular/core';
import { Hero } from './components/hero/hero';
import { Topbar } from './components/topbar/topbar';
import { Sidebar } from './components/sidebar/sidebar';
import { MapCanvas } from './components/map-canvas/map-canvas';
import { PlaceModal } from './components/place-modal/place-modal';
import { NewsEvents } from './components/news-events/news-events';
import { NewsLists } from './components/news-lists/news-lists';
import { LakesMapCanvas } from './components/lakes-map-canvas/lakes-map-canvas';
import { NavCategories } from './components/nav-categories/nav-categories';
import { Place } from './models/place.model';
import { PlacesService } from './services/places';

@Component({
  selector: 'app-root',
  imports: [Hero, Topbar, Sidebar, MapCanvas, PlaceModal, NewsEvents, NewsLists, LakesMapCanvas, NavCategories],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  @ViewChild(MapCanvas) mapCanvas!: MapCanvas;

  private places = inject(PlacesService);

  protected selectedPlace = signal<Place | null>(null);

  scrollToApp(): void {
    document.getElementById('app')?.scrollIntoView({ behavior: 'smooth' });
  }

  onSelectPlace(place: Place): void {
    this.mapCanvas.flyToPlace(place.id);
    this.selectedPlace.set(place);
  }

  onOpenModal(id: string): void {
    const place = this.places.getPlaceById(id);
    if (place) this.selectedPlace.set(place);
  }

  onCloseModal(): void {
    this.selectedPlace.set(null);
  }
}
