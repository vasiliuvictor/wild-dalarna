export interface Category {
  label: string;
  icon: string;
  color: string;
  emoji: string;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  px?: number;
  py?: number;
  rating?: number;
  ratingCount?: number;
  address?: string;
  phone?: string;
  hours?: string[];
  description?: string;
  reviews?: string[];
  tip?: string;
}

export interface GCP {
  lat: number;
  lon: number;
  px: number;
  py: number;
}

export interface Cluster {
  cx: number;
  cy: number;
  items: Place[];
}
