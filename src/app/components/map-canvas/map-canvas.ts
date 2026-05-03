import {
  AfterViewInit, Component, effect, ElementRef,
  inject, NgZone, OnDestroy, output, signal, ViewChild,
} from '@angular/core';
import { Cluster } from '../../models/place.model';
import { MapEngineService } from '../../services/map-engine';
import { PlacesService } from '../../services/places';
import { MapLegend } from '../map-legend/map-legend';

@Component({
  selector: 'app-map-canvas',
  imports: [MapLegend],
  templateUrl: './map-canvas.html',
  styleUrl: './map-canvas.scss',
})
export class MapCanvas implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private engine = inject(MapEngineService);
  protected places = inject(PlacesService);

  readonly openModal = output<string>();

  protected hintHidden = signal(false);
  protected zoomLabel = signal('1×');

  protected tooltipVisible = signal(false);
  protected tooltipLeft = signal(0);
  protected tooltipTop = signal(0);
  protected tooltipHtml = signal('');

  protected popupVisible = signal(false);
  protected popupLeft = signal(0);
  protected popupTop = signal(0);
  protected popupCluster = signal<Cluster | null>(null);

  private ngZone = inject(NgZone);

  private panStart: { mx: number; my: number; ox: number; oy: number } | null = null;
  private didPan = false;
  private lastTouchDist: number | null = null;
  private resizeObserver!: ResizeObserver;
  private hintTimer!: ReturnType<typeof setTimeout>;
  private docMouseMove!: (e: MouseEvent) => void;
  private docMouseUp!: (e: MouseEvent) => void;

  constructor() {
    effect(() => {
      this.places.filteredPlaces();
      if (this.engine['imgLoaded']) {
        this.engine.draw();
        this.zoomLabel.set(this.engine.zoomLabel());
      }
    });
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.engine.init(
      canvas,
      (id) => { this.hidePopup(); this.openModal.emit(id); },
      (cluster, cx, cy) => this.showPopup(cluster, cx, cy),
    );

    this.resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        this.engine.resize();
        this.zoomLabel.set(this.engine.zoomLabel());
      });
    });
    this.resizeObserver.observe(canvas.parentElement!);

    this.hintTimer = setTimeout(() => this.hintHidden.set(true), 5500);

    this.ngZone.runOutsideAngular(() => {
      this.docMouseMove = (e: MouseEvent) => {
        if (!this.panStart) return;
        const dx = e.clientX - this.panStart.mx, dy = e.clientY - this.panStart.my;
        if (!this.didPan && Math.hypot(dx, dy) > 4) this.didPan = true;
        if (this.didPan) {
          this.engine.ox = this.engine['clampOx'](this.panStart.ox + dx / this.engine.scale);
          this.engine.oy = this.engine['clampOy'](this.panStart.oy + dy / this.engine.scale);
          this.engine.draw();
        }
      };

      this.docMouseUp = (e: MouseEvent) => {
        if (!this.panStart) return;
        const wasPan = this.didPan;
        this.panStart = null;
        if (!wasPan) {
          const rect = this.canvasRef.nativeElement.getBoundingClientRect();
          this.ngZone.run(() => {
            this.engine.handleClickAt(e.clientX - rect.left, e.clientY - rect.top);
            this.zoomLabel.set(this.engine.zoomLabel());
          });
        }
      };

      document.addEventListener('mousemove', this.docMouseMove);
      document.addEventListener('mouseup', this.docMouseUp);
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    clearTimeout(this.hintTimer);
    document.removeEventListener('mousemove', this.docMouseMove);
    document.removeEventListener('mouseup', this.docMouseUp);
  }

  zoomIn(): void { this.engine.zoom(1.4); this.zoomLabel.set(this.engine.zoomLabel()); this.hidePopup(); }
  zoomOut(): void { this.engine.zoom(1 / 1.4); this.zoomLabel.set(this.engine.zoomLabel()); this.hidePopup(); }
  resetView(): void { this.engine.fitView(); this.zoomLabel.set(this.engine.zoomLabel()); this.hidePopup(); }

  flyToPlace(placeId: string): void {
    const place = this.places.getPlaceById(placeId);
    if (place) this.engine.flyToPlace(place);
  }

  onMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return;
    this.panStart = { mx: e.clientX, my: e.clientY, ox: this.engine.ox, oy: this.engine.oy };
    this.didPan = false;
    this.hidePopup();
  }

  onCanvasMouseMove(e: MouseEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.updateTooltip(e.clientX - rect.left, e.clientY - rect.top);
  }

  onWheel(e: WheelEvent): void {
    e.preventDefault();
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.engine.zoom(e.deltaY < 0 ? 1.18 : 1 / 1.18, e.clientX - rect.left, e.clientY - rect.top);
    this.zoomLabel.set(this.engine.zoomLabel());
    this.hintHidden.set(true);
  }

  onMouseLeave(): void {
    this.tooltipVisible.set(false);
  }

  onTouchStart(e: TouchEvent): void {
    if (e.touches.length === 1) {
      this.panStart = { mx: e.touches[0].clientX, my: e.touches[0].clientY, ox: this.engine.ox, oy: this.engine.oy };
      this.didPan = false; this.lastTouchDist = null;
    } else if (e.touches.length === 2) {
      this.panStart = null;
      this.lastTouchDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
    }
  }

  onTouchMove(e: TouchEvent): void {
    e.preventDefault();
    if (e.touches.length === 1 && this.panStart) {
      const dx = e.touches[0].clientX - this.panStart.mx, dy = e.touches[0].clientY - this.panStart.my;
      if (Math.hypot(dx, dy) > 4) this.didPan = true;
      if (!this.didPan) return;
      this.engine.ox = this.engine['clampOx'](this.panStart.ox + dx / this.engine.scale);
      this.engine.oy = this.engine['clampOy'](this.panStart.oy + dy / this.engine.scale);
      this.engine.draw();
    } else if (e.touches.length === 2 && this.lastTouchDist) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY,
      );
      const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      this.engine.zoom(d / this.lastTouchDist, mx - rect.left, my - rect.top);
      this.zoomLabel.set(this.engine.zoomLabel());
      this.lastTouchDist = d;
    }
  }

  onTouchEnd(e: TouchEvent): void {
    if (e.changedTouches.length === 1 && !this.didPan) {
      const t = e.changedTouches[0];
      const rect = this.canvasRef.nativeElement.getBoundingClientRect();
      this.engine.handleClickAt(t.clientX - rect.left, t.clientY - rect.top);
      this.zoomLabel.set(this.engine.zoomLabel());
    }
    this.panStart = null; this.lastTouchDist = null;
  }

  private updateTooltip(cx: number, cy: number): void {
    const hit = this.engine.hitTest(cx, cy);
    if (hit) {
      if (hit.items.length === 1) {
        const p = hit.items[0];
        const c = this.places.categories[p.category];
        this.tooltipHtml.set(
          `<strong>${p.name}</strong><br><small style="color:${c.color}">${c.label}</small>${p.rating ? `<br>★ ${p.rating}` : ''}`
        );
      } else {
        const icons = [...new Set(hit.items.map(p => p.category))].map(k => this.places.categories[k].icon).join(' ');
        this.tooltipHtml.set(
          `<strong>${hit.items.length} places</strong> ${icons}<br><small style="color:#b8d4c0">Click to zoom in &amp; expand</small>`
        );
      }
      this.tooltipLeft.set(cx + 14);
      this.tooltipTop.set(cy - 10);
      this.tooltipVisible.set(true);
    } else {
      this.tooltipVisible.set(false);
    }
  }

  protected showPopup(cluster: Cluster, cx: number, cy: number): void {
    this.popupCluster.set(cluster);
    this.popupVisible.set(true);
    requestAnimationFrame(() => {
      const popup = document.querySelector('.cluster-popup') as HTMLElement;
      if (!popup) return;
      const pw = popup.offsetWidth || 215, ph = popup.offsetHeight || 180;
      const mapArea = this.canvasRef.nativeElement.parentElement!;
      let left = cx + 14, top = cy - 10;
      if (left + pw > mapArea.clientWidth - 8) left = cx - pw - 14;
      if (top + ph > mapArea.clientHeight - 8) top = mapArea.clientHeight - ph - 8;
      if (top < 4) top = 4;
      this.popupLeft.set(left);
      this.popupTop.set(top);
    });
  }

  protected hidePopup(): void {
    this.popupVisible.set(false);
  }

  protected popupOpenModal(id: string): void {
    this.hidePopup();
    this.openModal.emit(id);
  }
}
