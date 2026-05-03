export interface LakeCategory {
  label: string;
  color: string;
  emoji: string;
}

export interface LakeLink {
  label: string;
  url: string;
}

export interface Lake {
  id: string;
  name: string;
  category: string;
  px: number;
  py: number;
  species: string;
  description: string;
  links: LakeLink[];
}

export interface LakeCluster {
  cx: number;
  cy: number;
  items: Lake[];
}
