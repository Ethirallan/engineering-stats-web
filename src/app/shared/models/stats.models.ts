export type Team = {
  id: string;
  name: string;
  engineers: Engineer[];
};

export type Engineer = {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  profileUrl: string;
  profilePictureUrl: string | null;
};

export type Stat = {
  label: string;
  prReviewed: number;
  prMerged: number;
  locAdded: number;
  locDeleted: number;
  locTotal: number;
};

export type Period = 'year' | 'quarter' | 'month' | 'week';

export enum PRState {
  OPEN = 'open',
  DRAFT = 'draft',
  CLOSED = 'closed',
  MERGED = 'merged',
}

export type Pr = {
  id: string;
  title: string | null;
  url: string;
  openedAt: string;
  updatedAt: string;
  mergedAt: string | null;
  closedAt: string | null;
  state: PRState;
  locTotal: number;
  locAdded: number;
  locDeleted: number;
  countInStats: boolean;
};
