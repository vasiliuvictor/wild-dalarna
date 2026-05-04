import { AfterViewInit, Component, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { Hero } from './components/hero/hero';
import { Topbar } from './components/topbar/topbar';
import { Sidebar } from './components/sidebar/sidebar';
import { MapCanvas } from './components/map-canvas/map-canvas';
import { PlaceModal } from './components/place-modal/place-modal';
import { NewsEvents } from './components/news-events/news-events';
import { NewsLists } from './components/news-lists/news-lists';
import { LakesMapCanvas } from './components/lakes-map-canvas/lakes-map-canvas';
import { LakesSidebar } from './components/lakes-sidebar/lakes-sidebar';
import { NavCategories } from './components/nav-categories/nav-categories';
import { Place } from './models/place.model';
import { Lake } from './models/lake.model';
import { PlacesService } from './services/places';
import { LakesService } from './services/lakes.service';

@Component({
  selector: 'app-root',
  imports: [Hero, Topbar, Sidebar, MapCanvas, PlaceModal, NewsEvents, NewsLists, LakesMapCanvas, LakesSidebar, NavCategories],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit, OnDestroy {
  @ViewChild(MapCanvas) mapCanvas!: MapCanvas;
  @ViewChild(LakesMapCanvas) lakesMapCanvas!: LakesMapCanvas;

  private places = inject(PlacesService);
  protected lakes = inject(LakesService);

  protected selectedPlace = signal<Place | null>(null);
  protected showFab = signal(false);

  private fabObserver!: IntersectionObserver;

  ngAfterViewInit(): void {
    const navCat = document.getElementById('nav-categories');
    if (navCat) {
      this.fabObserver = new IntersectionObserver(([entry]) => {
        this.showFab.set(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      }, { threshold: 0 });
      this.fabObserver.observe(navCat);
    }
  }

  ngOnDestroy(): void {
    this.fabObserver?.disconnect();
  }

  scrollToApp(): void {
    document.getElementById('app')?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToNav(): void {
    document.getElementById('nav-categories')?.scrollIntoView({ behavior: 'smooth' });
  }

  onSelectPlace(place: Place): void {
    this.mapCanvas.flyToPlace(place.id);
    this.selectedPlace.set(place);
  }

  onSelectLake(lake: Lake): void {
    this.lakesMapCanvas.flyToLake(lake.id);
  }

  onOpenModal(id: string): void {
    const place = this.places.getPlaceById(id);
    if (place) this.selectedPlace.set(place);
  }

  onCloseModal(): void {
    this.selectedPlace.set(null);
  }
}
