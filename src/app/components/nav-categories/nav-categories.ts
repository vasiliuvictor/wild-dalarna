import { Component } from '@angular/core';
import { AuroraCanvas } from '../aurora-canvas/aurora-canvas';

@Component({
  selector: 'app-nav-categories',
  imports: [AuroraCanvas],
  templateUrl: './nav-categories.html',
  styleUrl: './nav-categories.scss',
})
export class NavCategories {
  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
