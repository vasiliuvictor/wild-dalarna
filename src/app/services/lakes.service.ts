import { Injectable, signal, computed } from '@angular/core';
import { Lake, LakeCategory } from '../models/lake.model';

export const LAKE_CATEGORIES: Record<string, LakeCategory> = {
  alvdalen:    { label: 'Älvdalens FVOF',   color: '#4a8a58', emoji: '🎣' },
  sarnaIdre:   { label: 'Särna-Idre FVOF',  color: '#2e8a80', emoji: '🐟' },
  fulufjallet: { label: 'Fulufjället NP',   color: '#8a6e35', emoji: '🏔' },
  osterdalv:   { label: 'River / Stream',   color: '#5a52a0', emoji: '🌊' },
};

// Pixel coords derived from percentage positions in alvdalen_lakes.png (944×1113)
const ALL_LAKES: Lake[] = [
  {
    id: 'rosjon',
    name: 'Lake Rösjön',
    category: 'fulufjallet',
    px: 422.6, py: 267.1,
    species: 'Arctic Char',
    description: "Sweden's southernmost wild Arctic Char population. Located inside Fulufjället NP — special regulations apply. A truly wild and pristine fishing destination.",
    links: [
      { label: 'Särna-Idre FVOF on iFiske', url: 'https://www.ifiske.se/en/fishing-sarna-idre.htm' },
      { label: 'Buy Fishing Permit', url: 'https://www.ifiske.se/en/fishing-permit-sarna-idre.htm' },
      { label: 'Visit Dalarna — Fulufjället', url: 'https://www.visitdalarna.se/en/do/attractions/fulufjallets-national-park' },
    ],
  },
  {
    id: 'navarsjon',
    name: 'Lake Navarsjön',
    category: 'sarnaIdre',
    px: 254.9, py: 467.5,
    species: 'Perch · Pike · Trout · Grayling',
    description: 'A beautiful mountain lake near Idre. Managed by Särna-Idre FVOF with broad access. Seasonal fishing restrictions apply Sep 22 – Dec 5.',
    links: [
      { label: 'Särna-Idre FVOF on iFiske', url: 'https://www.ifiske.se/en/fishing-sarna-idre.htm' },
      { label: 'Buy Fishing Permit', url: 'https://www.ifiske.se/en/fishing-permit-sarna-idre.htm' },
      { label: 'Visit Dalarna — Navarsjön', url: 'https://www.visitdalarna.se/en/do/activities/navarsjon' },
    ],
  },
  {
    id: 'rammasjon',
    name: 'Lake Rämmasjön',
    category: 'sarnaIdre',
    px: 406.0, py: 574.4,
    species: 'Trout · Perch · Grayling',
    description: 'Located near Särna, Rämmasjön is part of the Särna-Idre FVOF fishing area. The lake offers a scenic setting surrounded by spruce forest.',
    links: [
      { label: 'Särna-Idre FVOF on iFiske', url: 'https://www.ifiske.se/en/fishing-sarna-idre.htm' },
      { label: 'Buy Fishing Permit', url: 'https://www.ifiske.se/en/fishing-permit-sarna-idre.htm' },
      { label: 'Visit Dalarna — Rämmasjön', url: 'https://www.visitdalarna.se/en/do/activities/rammasjon' },
    ],
  },
  {
    id: 'langtjarn',
    name: 'Långtjärn (Loka)',
    category: 'alvdalen',
    px: 160.5, py: 721.4,
    species: 'Perch · Pike · Trout',
    description: 'A popular quiet forest lake, perfect for those seeking a remote wilderness experience. Managed by Älvdalens FVOF. Seasonal restrictions Sep 22 – Dec 5.',
    links: [
      { label: 'Älvdalens FVOF on iFiske', url: 'https://www.ifiske.se/en/fishing-alvdalens-fvo.htm' },
      { label: 'Buy Fishing Permit', url: 'https://www.ifiske.se/en/fishing-permit-alvdalens-fvo.htm' },
      { label: 'Visit Långtjärn', url: 'https://www.visitdalarna.se/gora/aktiviteter/langtjarn' },
    ],
  },
  {
    id: 'krakbotjarn',
    name: 'Kråkbotjärn',
    category: 'alvdalen',
    px: 566.4, py: 455.4,
    species: 'Rainbow Trout (Put-and-Take)',
    description: 'A managed put-and-take trout pond — ideal for families and beginners. Regularly stocked with Rainbow Trout. Seasonal fishing ban Sep 22 – Dec 5.',
    links: [
      { label: 'Älvdalens FVOF on iFiske', url: 'https://www.ifiske.se/en/fishing-alvdalens-fvo.htm' },
      { label: 'Buy Fishing Permit', url: 'https://www.ifiske.se/en/fishing-permit-alvdalens-fvo.htm' },
      { label: 'Visit Kråkbodtjärn', url: 'https://www.visitdalarna.se/en/do/activities/krakbodtjarn' },
    ],
  },
  {
    id: 'mickeltjarn',
    name: 'Mickeltjärn & Stortjärn',
    category: 'alvdalen',
    px: 745.8, py: 601.2,
    species: 'Perch · Pike · Trout · Char',
    description: 'Two managed lakes frequently stocked to ensure healthy game fish populations. Great for both experienced and recreational anglers. Seasonal ban applies Sep–Dec.',
    links: [
      { label: 'Älvdalens FVOF on iFiske', url: 'https://www.ifiske.se/en/fishing-alvdalens-fvo.htm' },
      { label: 'Buy Fishing Permit', url: 'https://www.ifiske.se/en/fishing-permit-alvdalens-fvo.htm' },
      { label: 'Älvdalens FVOF', url: 'http://alvdalensfvof.se/' },
    ],
  },
  {
    id: 'osterdalv',
    name: 'Österdalälven',
    category: 'osterdalv',
    px: 623.0, py: 698.2,
    species: 'Grayling · Brown Trout',
    description: "One of Sweden's premier river fishing destinations. Österdalälven flows through Älvdalen offering excellent stream fishing for Grayling and wild Brown Trout. Also includes tributary rivers Vanån and Tennån.",
    links: [
      { label: 'Älvdalens FVOF on iFiske', url: 'https://www.ifiske.se/en/fishing-alvdalens-fvo.htm' },
      { label: 'Buy Fishing Permit', url: 'https://www.ifiske.se/en/fishing-permit-alvdalens-fvo.htm' },
      { label: 'Visit — Österdalälven', url: 'https://www.alvdalen.se/uppleva-och-gora/idrott-motion-och-friluftsliv/naturomraden-naturreservat/osterdalalven.html' },
    ],
  },
  {
    id: 'nasssjon',
    name: 'Lake Nässjön',
    category: 'alvdalen',
    px: 783.5, py: 905.6,
    species: 'Perch · Pike · Trout · Char — Year-Round',
    description: 'Located right next to Älvdalen village, Nässjön is the most accessible fishing lake in the area. Highly accessible by car. Open year-round with a fantastic variety of species.',
    links: [
      { label: 'Älvdalens FVOF on iFiske', url: 'https://www.ifiske.se/en/fishing-alvdalens-fvo.htm' },
      { label: 'Buy Fishing Permit', url: 'https://www.ifiske.se/en/fishing-permit-alvdalens-fvo.htm' },
      { label: 'Visit Lake Nässjön', url: 'https://www.visitdalarna.se/gora/aktiviteter/nassjon' },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class LakesService {
  readonly categories = LAKE_CATEGORIES;

  private readonly activeCategoryFilters = signal<Set<string>>(
    new Set(Object.keys(LAKE_CATEGORIES))
  );

  readonly searchTerm = signal('');

  readonly filteredLakes = computed(() => {
    const active = this.activeCategoryFilters();
    const q = this.searchTerm().toLowerCase().trim();
    return ALL_LAKES.filter(l =>
      active.has(l.category) &&
      (!q || l.name.toLowerCase().includes(q) || l.species.toLowerCase().includes(q))
    );
  });

  readonly totalLakes = ALL_LAKES.length;

  getLakeById(id: string): Lake | undefined {
    return ALL_LAKES.find(l => l.id === id);
  }

  toggleCategory(key: string): void {
    this.activeCategoryFilters.update(set => {
      const next = new Set(set);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  isCategoryActive(key: string): boolean {
    return this.activeCategoryFilters().has(key);
  }
}
