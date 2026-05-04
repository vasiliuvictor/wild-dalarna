import {
  AfterViewInit, Component, effect, ElementRef,
  HostListener, inject, NgZone, OnDestroy, signal, ViewChild,
} from '@angular/core';
import { LakeCluster } from '../../models/lake.model';
import { LAKE_CATEGORIES, LakesService } from '../../services/lakes.service';
import { LakesMapEngineService } from '../../services/lakes-map-engine.service';

@Component({
  selector: 'app-lakes-map-canvas',
  imports: [],
  templateUrl: './lakes-map-canvas.html',
  styleUrl: './lakes-map-canvas.scss',
})
export class LakesMapCanvas implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  protected lakes = inject(LakesService);
  private engine = inject(LakesMapEngineService);
  private ngZone = inject(NgZone);
  private hostEl = inject(ElementRef);

  readonly categoryEntries = Object.entries(LAKE_CATEGORIES);

  protected hintHidden = signal(false);
  protected zoomLabel = signal('1×');
  protected legendOpen = signal(false);

  protected tooltipVisible = signal(false);
  protected tooltipLeft = signal(0);
  protected tooltipTop = signal(0);
  protected tooltipHtml = signal('');

  protected popupVisible = signal(false);
  protected popupLeft = signal(0);
  protected popupTop = signal(0);
  protected popupCluster = signal<LakeCluster | null>(null);

  protected activeLake = signal<ReturnType<LakesService['getLakeById']>>(undefined);
  protected lakePopupLeft = signal(0);
  protected lakePopupTop = signal(0);

  private panStart: { mx: number; my: number; ox: number; oy: number } | null = null;
  private didPan = false;
  private lastTouchDist: number | null = null;
  private resizeObserver!: ResizeObserver;
  private hintTimer!: ReturnType<typeof setTimeout>;
  private docMouseMove!: (e: MouseEvent) => void;
  private docMouseUp!: (e: MouseEvent) => void;

  constructor() {
    effect(() => {
      this.lakes.filteredLakes();
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
      (id, cx, cy) => { this.hideClusterPopup(); this.showLakePopup(id, cx, cy); },
      (cluster, cx, cy) => this.showClusterPopup(cluster, cx, cy),
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

  zoomIn(): void { this.engine.zoom(1.4); this.zoomLabel.set(this.engine.zoomLabel()); this.hideClusterPopup(); }
  zoomOut(): void { this.engine.zoom(1 / 1.4); this.zoomLabel.set(this.engine.zoomLabel()); this.hideClusterPopup(); }
  resetView(): void { this.engine.fitView(); this.zoomLabel.set(this.engine.zoomLabel()); this.hideClusterPopup(); }

  flyToLake(lakeId: string): void {
    const lake = this.lakes.getLakeById(lakeId);
    if (!lake) return;
    this.engine.flyToLake(lake, () => {
      const { cx, cy } = this.engine.imgToCvs(lake.px, lake.py);
      this.hideClusterPopup();
      this.showLakePopup(lake.id, cx, cy);
    });
  }

  onMouseDown(e: MouseEvent): void {
    if (e.button !== 0) return;
    this.panStart = { mx: e.clientX, my: e.clientY, ox: this.engine.ox, oy: this.engine.oy };
    this.didPan = false;
    this.hideClusterPopup();
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

  onMouseLeave(): void { this.tooltipVisible.set(false); }

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

  protected openLakePopup(id: string, e: MouseEvent): void {
    e.stopPropagation();
    const lake = this.lakes.getLakeById(id);
    if (!lake) return;
    const { cx, cy } = this.engine.imgToCvs(lake.px, lake.py);
    this.hideClusterPopup();
    this.showLakePopup(id, cx, cy);
  }

  toggleCategory(key: string): void {
    this.lakes.toggleCategory(key);
    this.engine.draw();
  }

  private updateTooltip(cx: number, cy: number): void {
    const hit = this.engine.hitTest(cx, cy);
    if (hit) {
      if (hit.items.length === 1) {
        const l = hit.items[0];
        const c = this.lakes.categories[l.category];
        this.tooltipHtml.set(
          `<strong>${l.name}</strong><br><small style="color:${c.color}">${c.emoji} ${l.species}</small>`
        );
      } else {
        this.tooltipHtml.set(
          `<strong>${hit.items.length} waters</strong><br><small style="color:#8aaa82">Click to expand</small>`
        );
      }
      this.tooltipLeft.set(cx + 14);
      this.tooltipTop.set(cy - 10);
      this.tooltipVisible.set(true);
    } else {
      this.tooltipVisible.set(false);
    }
  }

  private showLakePopup(id: string, cx: number, cy: number): void {
    const lake = this.lakes.getLakeById(id);
    if (!lake) return;
    this.activeLake.set(lake);
    requestAnimationFrame(() => {
      const popup = document.querySelector('.lake-popup') as HTMLElement;
      if (!popup) return;
      const pw = popup.offsetWidth || 260, ph = popup.offsetHeight || 220;
      const mapArea = this.canvasRef.nativeElement.parentElement!;
      let left = cx + 14, top = cy - ph / 2;
      if (left + pw > mapArea.clientWidth - 8) left = cx - pw - 14;
      if (top + ph > mapArea.clientHeight - 8) top = mapArea.clientHeight - ph - 8;
      if (top < 4) top = 4;
      this.lakePopupLeft.set(left);
      this.lakePopupTop.set(top);
    });
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocPointerDown(e: PointerEvent): void {
    if (!this.activeLake()) return;
    const popup = this.hostEl.nativeElement.querySelector('.lake-popup');
    if (popup && !popup.contains(e.target as Node)) {
      this.closeLakePopup();
    }
  }

  protected closeLakePopup(): void { this.activeLake.set(undefined); }

  protected showClusterPopup(cluster: LakeCluster, cx: number, cy: number): void {
    this.popupCluster.set(cluster);
    this.popupVisible.set(true);
    requestAnimationFrame(() => {
      const popup = document.querySelector('.cluster-popup') as HTMLElement;
      if (!popup) return;
      const pw = popup.offsetWidth || 215, ph = popup.offsetHeight || 160;
      const mapArea = this.canvasRef.nativeElement.parentElement!;
      let left = cx + 14, top = cy - 10;
      if (left + pw > mapArea.clientWidth - 8) left = cx - pw - 14;
      if (top + ph > mapArea.clientHeight - 8) top = mapArea.clientHeight - ph - 8;
      if (top < 4) top = 4;
      this.popupLeft.set(left);
      this.popupTop.set(top);
    });
  }

  protected hideClusterPopup(): void { this.popupVisible.set(false); }
}
