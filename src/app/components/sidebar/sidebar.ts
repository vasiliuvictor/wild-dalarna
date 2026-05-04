import { Component, ElementRef, HostListener, inject, output, signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { PlacesService } from '../../services/places';
import { Place } from '../../models/place.model';

@Component({
  selector: 'app-sidebar',
  imports: [KeyValuePipe],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected places = inject(PlacesService);
  readonly selectPlace = output<Place>();
  private el = inject(ElementRef);

  protected openCats = signal(new Set<string>());
  protected mobileCatOpen = signal(false);

  toggleMobileCats(): void { this.mobileCatOpen.update(v => !v); }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (this.mobileCatOpen() && !this.el.nativeElement.contains(e.target as Node)) {
      this.mobileCatOpen.set(false);
    }
  }

  get filteredGrouped(): Record<string, Place[]> {
    const grouped: Record<string, Place[]> = {};
    for (const p of this.places.filteredPlaces()) {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    }
    return grouped;
  }

  get sidebarCount(): string {
    const fp = this.places.filteredPlaces();
    const catCount = new Set(fp.map(p => p.category)).size;
    return `${fp.length} places · ${catCount} categories`;
  }

  onSearch(value: string): void {
    this.places.searchTerm.set(value);
  }

  toggleCat(key: string): void {
    this.openCats.update(s => {
      const next = new Set(s);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  isCatOpen(key: string): boolean {
    return this.openCats().has(key);
  }

  onPlaceClick(place: Place): void {
    this.mobileCatOpen.set(false);
    this.selectPlace.emit(place);
  }

  categoryOrder = (): number => 0;
}
