import { AfterViewInit, Component, ElementRef, inject, NgZone, OnDestroy, ViewChild } from '@angular/core';

interface Band { y: number; amp: number; freq: number; speed: number; hue: number; width: number; alpha: number; }
interface Star  { x: number; y: number; r: number; a: number; tw: number; }

@Component({
  selector: 'app-aurora-canvas',
  imports: [],
  templateUrl: './aurora-canvas.html',
  styles: `:host { display: block; position: absolute; inset: 0; }`,
})
export class AuroraCanvas implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private zone = inject(NgZone);
  private ctx!: CanvasRenderingContext2D;
  private rafId = 0;
  private t = 0;
  private stars: Star[] = [];
  private visible = false;
  private io!: IntersectionObserver;
  private sizeObserver!: ResizeObserver;
  private scrollScheduled = false;

  private readonly bands: Band[] = [
    { y: 0.30, amp: 0.09, freq: 0.9,  speed: 0.35, hue: 150, width: 120, alpha: 0.55 },
    { y: 0.45, amp: 0.07, freq: 1.2,  speed: 0.55, hue: 168, width:  90, alpha: 0.45 },
    { y: 0.20, amp: 0.06, freq: 0.7,  speed: 0.22, hue: 132, width:  75, alpha: 0.38 },
    { y: 0.58, amp: 0.05, freq: 1.6,  speed: 0.75, hue: 188, width:  65, alpha: 0.30 },
    { y: 0.14, amp: 0.04, freq: 2.1,  speed: 1.00, hue: 262, width:  55, alpha: 0.22 },
  ];

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const canvas = this.canvasRef.nativeElement;
      const banner = (canvas.closest('.parallax-banner') ?? canvas.parentElement) as HTMLElement;
      this.ctx = canvas.getContext('2d')!;
      this.genStars();
      this.updateFade();
      window.addEventListener('scroll', this.onScroll, { passive: true });

      this.sizeObserver = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;
        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        this.genStars();
      });
      if (banner) this.sizeObserver.observe(banner);

      this.io = new IntersectionObserver(([entry]) => {
        this.visible = entry.isIntersecting;
        if (this.visible && !this.rafId) this.draw();
      });
      this.io.observe(canvas);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('scroll', this.onScroll);
    this.io?.disconnect();
    this.sizeObserver?.disconnect();
  }

  private onScroll = () => {
    if (this.scrollScheduled) return;
    this.scrollScheduled = true;
    requestAnimationFrame(() => {
      this.updateFade();
      this.scrollScheduled = false;
    });
  };

  private genStars(): void {
    this.stars = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random() * 0.65,
      r: Math.random() * 1.0 + 0.3,
      a: Math.random() * 0.5 + 0.3,
      tw: Math.random() * Math.PI * 2,
    }));
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.width, h = canvas.height;
    const sky = this.ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#020c06');
    sky.addColorStop(1, '#0a1a0e');
    this.ctx.fillStyle = sky;
    this.ctx.fillRect(0, 0, w, h);

    this.stars.forEach(s => {
      this.ctx.beginPath();
      this.ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(220,240,255,${s.a * (0.6 + 0.4 * Math.sin(this.t * 1.1 + s.tw))})`;
      this.ctx.fill();
    });

    this.bands.forEach(b => this.drawBand(b));
    this.t += 0.008;
    this.rafId = this.visible ? requestAnimationFrame(() => this.draw()) : 0;
  }

  private drawBand(b: Band): void {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.width, h = canvas.height;
    const hw = b.width / 2;
    const steps = 120;
    const getY = (x: number) => {
      const nx = x / w;
      return b.y * h
        + Math.sin(nx * b.freq * Math.PI * 2 + this.t * b.speed) * b.amp * h
        + Math.sin(nx * b.freq * 0.6 * Math.PI * 2 + this.t * b.speed * 1.4 + 2) * b.amp * h * 0.25;
    };
    this.ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * w;
      i === 0 ? this.ctx.moveTo(x, getY(x) - hw) : this.ctx.lineTo(x, getY(x) - hw);
    }
    for (let i = steps; i >= 0; i--) this.ctx.lineTo((i / steps) * w, getY((i / steps) * w) + hw);
    this.ctx.closePath();
    const midY = b.y * h;
    const g = this.ctx.createLinearGradient(0, midY - hw, 0, midY + hw);
    g.addColorStop(0,    `hsla(${b.hue},100%,60%,0)`);
    g.addColorStop(0.25, `hsla(${b.hue},100%,65%,${b.alpha * 0.55})`);
    g.addColorStop(0.5,  `hsla(${b.hue},100%,70%,${b.alpha})`);
    g.addColorStop(0.75, `hsla(${b.hue},100%,65%,${b.alpha * 0.55})`);
    g.addColorStop(1,    `hsla(${b.hue},100%,60%,0)`);
    this.ctx.fillStyle = g;
    this.ctx.fill();
  }

  private updateFade(): void {
    const canvas = this.canvasRef.nativeElement;
    const banner = canvas.closest('.parallax-banner') as HTMLElement | null;
    if (!banner) return;
    const rect = banner.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.75)));
    canvas.style.opacity = String(1 - progress);
  }
}