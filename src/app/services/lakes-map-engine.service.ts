import { Injectable } from '@angular/core';
import { Lake, LakeCluster } from '../models/lake.model';
import { LAKE_CATEGORIES, LakesService } from './lakes.service';

const CLUSTER_R = 30;
const MAX_ZOOM = 3;
const HIT_RADIUS = 22;

export const LAKES_IMG_W = 944;
export const LAKES_IMG_H = 1113;

@Injectable({ providedIn: 'root' })
export class LakesMapEngineService {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private mapImg = new Image();
  private imgLoaded = false;

  ox = 0;
  oy = 0;
  scale = 1;

  currentClusters: LakeCluster[] = [];

  private onLakeClick?: (id: string, cx: number, cy: number) => void;
  private onClusterClick?: (cluster: LakeCluster, cx: number, cy: number) => void;

  constructor(private lakes: LakesService) {}

  init(
    canvas: HTMLCanvasElement,
    onLakeClick: (id: string, cx: number, cy: number) => void,
    onClusterClick: (cluster: LakeCluster, cx: number, cy: number) => void,
  ): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.onLakeClick = onLakeClick;
    this.onClusterClick = onClusterClick;

    this.mapImg.onload = () => {
      this.imgLoaded = true;
      this.resize();
    };
    this.mapImg.src = 'alvdalen_lakes_v2.png';
  }

  resize(): void {
    const area = this.canvas.parentElement!;
    this.canvas.width = area.clientWidth;
    this.canvas.height = area.clientHeight;
    if (this.imgLoaded) this.fitView();
  }

  fitView(): void {
    const W = this.canvas.width, H = this.canvas.height;
    this.scale = Math.max(W / LAKES_IMG_W, H / LAKES_IMG_H);
    this.ox = this.clampOx(W / (2 * this.scale) - LAKES_IMG_W / 2);
    this.oy = this.clampOy(H / (2 * this.scale) - LAKES_IMG_H / 2);
    this.draw();
  }

  draw(): void {
    if (!this.imgLoaded) return;
    const W = this.canvas.width, H = this.canvas.height;
    this.ctx.clearRect(0, 0, W, H);
    this.ctx.fillStyle = '#1a2a1a';
    this.ctx.fillRect(0, 0, W, H);
    this.ctx.drawImage(this.mapImg, this.ox * this.scale, this.oy * this.scale, LAKES_IMG_W * this.scale, LAKES_IMG_H * this.scale);

    const filtered = this.lakes.filteredLakes();
    this.currentClusters = this.buildClusters(filtered);
    this.currentClusters.forEach(cl => {
      if (cl.items.length === 1) this.drawSingle(cl.cx, cl.cy, cl.items[0]);
      else this.drawCluster(cl.cx, cl.cy, cl.items);
    });
  }

  zoom(factor: number, pivotCx?: number, pivotCy?: number): void {
    const W = this.canvas.width, H = this.canvas.height;
    if (pivotCx == null) { pivotCx = W / 2; pivotCy = H / 2; }
    const ns = Math.max(this.minScale(), Math.min(this.minScale() * MAX_ZOOM, this.scale * factor));
    if (ns === this.scale) return;
    const imgPt = this.cvsToImg(pivotCx, pivotCy!);
    this.scale = ns;
    this.ox = this.clampOx(pivotCx / this.scale - imgPt.px);
    this.oy = this.clampOy(pivotCy! / this.scale - imgPt.py);
    this.draw();
  }

  zoomLabel(): string {
    return (this.scale / this.minScale()).toFixed(1) + '×';
  }

  animateTo(tox: number, toy: number, ts: number, cb?: () => void): void {
    const s0 = this.scale, ox0 = this.ox, oy0 = this.oy, t0 = performance.now(), DUR = 380;
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / DUR);
      const e = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      this.scale = s0 + (ts - s0) * e;
      this.ox = ox0 + (tox - ox0) * e;
      this.oy = oy0 + (toy - oy0) * e;
      this.draw();
      if (t < 1) requestAnimationFrame(step); else if (cb) cb();
    };
    requestAnimationFrame(step);
  }

  handleClickAt(cx: number, cy: number): void {
    let best: LakeCluster | null = null, bestD = HIT_RADIUS;
    this.currentClusters.forEach(cl => {
      const d = Math.hypot(cl.cx - cx, cl.cy - cy);
      if (d < bestD) { bestD = d; best = cl; }
    });
    if (!best) return;
    const cluster = best as LakeCluster;

    if (cluster.items.length === 1) {
      this.onLakeClick?.(cluster.items[0].id, cluster.cx, cluster.cy);
      return;
    }
    const base = this.minScale();
    if (this.scale / base < 2.5) {
      const avgPx = cluster.items.reduce((s, l) => s + l.px, 0) / cluster.items.length;
      const avgPy = cluster.items.reduce((s, l) => s + l.py, 0) / cluster.items.length;
      const ns = Math.min(this.minScale() * MAX_ZOOM, this.scale * 2.8);
      this.animateTo(this.canvas.width / 2 / ns - avgPx, this.canvas.height / 2 / ns - avgPy, ns,
        () => { this.draw(); this.onClusterClick?.(cluster, cx, cy); });
    } else {
      this.onClusterClick?.(cluster, cx, cy);
    }
  }

  hitTest(cx: number, cy: number): LakeCluster | null {
    let best: LakeCluster | null = null, bestD = HIT_RADIUS;
    this.currentClusters.forEach(cl => {
      const d = Math.hypot(cl.cx - cx, cl.cy - cy);
      if (d < bestD) { bestD = d; best = cl; }
    });
    return best;
  }

  flyToLake(lake: Lake): void {
    const base = this.minScale();
    const ns = Math.min(this.minScale() * MAX_ZOOM, Math.max(this.scale, base * 2.5));
    this.animateTo(this.canvas.width / 2 / ns - lake.px, this.canvas.height / 2 / ns - lake.py, ns, () => this.draw());
  }

  imgToCvs(px: number, py: number): { cx: number; cy: number } {
    return { cx: (px + this.ox) * this.scale, cy: (py + this.oy) * this.scale };
  }

  cvsToImg(cx: number, cy: number): { px: number; py: number } {
    return { px: cx / this.scale - this.ox, py: cy / this.scale - this.oy };
  }

  private minScale(): number {
    return Math.max(this.canvas.width / LAKES_IMG_W, this.canvas.height / LAKES_IMG_H);
  }

  private clampOx(v: number): number {
    const excess = this.canvas.width / this.scale - LAKES_IMG_W;
    if (excess >= 0) return excess / 2;
    return Math.min(0, Math.max(excess, v));
  }

  private clampOy(v: number): number {
    const excess = this.canvas.height / this.scale - LAKES_IMG_H;
    if (excess >= 0) return excess / 2;
    return Math.min(0, Math.max(excess, v));
  }

  private buildClusters(filtered: Lake[]): LakeCluster[] {
    const pts = filtered.map(l => {
      const { cx, cy } = this.imgToCvs(l.px, l.py);
      return { lake: l, cx, cy, used: false };
    });
    const clusters: LakeCluster[] = [];
    for (let i = 0; i < pts.length; i++) {
      if (pts[i].used) continue;
      const g = [pts[i]]; pts[i].used = true;
      for (let j = i + 1; j < pts.length; j++) {
        if (pts[j].used) continue;
        if (Math.hypot(pts[j].cx - pts[i].cx, pts[j].cy - pts[i].cy) < CLUSTER_R) {
          g.push(pts[j]); pts[j].used = true;
        }
      }
      const cx = g.reduce((s, p) => s + p.cx, 0) / g.length;
      const cy = g.reduce((s, p) => s + p.cy, 0) / g.length;
      clusters.push({ cx, cy, items: g.map(x => x.lake) });
    }
    return clusters;
  }

  private drawSingle(cx: number, cy: number, lake: Lake): void {
    const cat = LAKE_CATEGORIES[lake.category];
    const r = Math.max(6, Math.min(12, 10 * this.scale));
    this.ctx.save();
    this.ctx.shadowColor = 'rgba(0,0,0,0.7)';
    this.ctx.shadowBlur = 8;
    this.ctx.shadowOffsetY = 2;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fillStyle = cat.color;
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(255,255,255,0.90)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.font = `${Math.max(7, Math.min(11, r))}px sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(cat.emoji, cx, cy);
    this.ctx.restore();
  }

  private drawCluster(cx: number, cy: number, items: Lake[]): void {
    const n = items.length;
    const catCounts: Record<string, number> = {};
    items.forEach(l => { catCounts[l.category] = (catCounts[l.category] || 0) + 1; });
    const domCat = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0][0];
    const col = LAKE_CATEGORIES[domCat].color;
    const r = Math.max(12, Math.min(22, 13 + n * 1.5));
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
    this.ctx.fillStyle = col + '30';
    this.ctx.fill();
    this.ctx.shadowColor = 'rgba(0,0,0,0.6)';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowOffsetY = 3;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fillStyle = col;
    this.ctx.fill();
    this.ctx.strokeStyle = 'rgba(255,255,255,0.90)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.shadowColor = 'transparent';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.font = `bold ${n < 10 ? 13 : 11}px 'DM Sans',sans-serif`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(String(n), cx, cy);
    this.ctx.restore();
  }
}
