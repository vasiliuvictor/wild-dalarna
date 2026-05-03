import {
  Component, ElementRef, HostListener,
  inject, input, OnChanges, output, signal, ViewChild,
} from '@angular/core';
import { Place } from '../../models/place.model';
import { PlacesService } from '../../services/places';

@Component({
  selector: 'app-place-modal',
  imports: [],
  templateUrl: './place-modal.html',
  styleUrl: './place-modal.scss',
})
export class PlaceModal implements OnChanges {
  @ViewChild('modalBody') modalBodyRef!: ElementRef<HTMLDivElement>;

  private places = inject(PlacesService);

  readonly place = input<Place | null>(null);
  readonly close = output<void>();

  protected isOpen = signal(false);
  protected scrollHintVisible = signal(false);

  ngOnChanges(): void {
    this.isOpen.set(this.place() !== null);
    if (this.place()) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => this.checkScroll());
    }
  }

  get cat() {
    const p = this.place();
    return p ? this.places.categories[p.category] : null;
  }

  get mapsUrl(): string {
    const p = this.place();
    if (!p) return '';
    return this.places.getMapsLink(p);
  }

  stars(rating: number): string {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  }

  onOverlayClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.doClose();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Escape' && this.isOpen()) this.doClose();
  }

  doClose(): void {
    this.isOpen.set(false);
    document.body.style.overflow = '';
    this.close.emit();
  }

  onBodyScroll(): void { this.checkScroll(); }

  private checkScroll(): void {
    const el = this.modalBodyRef?.nativeElement;
    if (!el) return;
    const scrollable = el.scrollHeight > el.clientHeight + 4;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
    this.scrollHintVisible.set(scrollable && !atBottom);
  }
}
