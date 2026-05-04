import { Component, inject, output, signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { LakesService } from '../../services/lakes.service';
import { Lake } from '../../models/lake.model';

@Component({
  selector: 'app-lakes-sidebar',
  imports: [KeyValuePipe],
  templateUrl: './lakes-sidebar.html',
  styleUrl: './lakes-sidebar.scss',
})
export class LakesSidebar {
  protected lakes = inject(LakesService);
  readonly selectLake = output<Lake>();

  protected openCats = signal(new Set<string>());

  get filteredGrouped(): Record<string, Lake[]> {
    const grouped: Record<string, Lake[]> = {};
    for (const l of this.lakes.filteredLakes()) {
      if (!grouped[l.category]) grouped[l.category] = [];
      grouped[l.category].push(l);
    }
    return grouped;
  }

  get sidebarCount(): string {
    const fl = this.lakes.filteredLakes();
    const catCount = new Set(fl.map(l => l.category)).size;
    return `${fl.length} waters · ${catCount} areas`;
  }

  onSearch(value: string): void {
    this.lakes.searchTerm.set(value);
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

  onLakeClick(lake: Lake): void {
    this.selectLake.emit(lake);
  }

  readonly categoryOrder = (): number => 0;
}