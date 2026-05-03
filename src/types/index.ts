// ─────────────────────────────────────────────
//  Ink Calendar Lite — 型定義
// ─────────────────────────────────────────────

export type IriamEventType =
  | 'star'
  | 'point'
  | 'ranking'
  | 'combined'
  | 'skip_pass'
  | 'personal';

export interface EventTypeMeta {
  value: IriamEventType;
  label: string;
  color: string;
  bg: string;
}

export const IRIAM_EVENT_TYPES: EventTypeMeta[] = [
  { value: 'star',     label: 'スター達成型',      color: '#c9a84c', bg: 'rgba(201,168,76,0.15)'  },
  { value: 'point',    label: 'ポイント達成型',     color: '#4a9eda', bg: 'rgba(74,158,218,0.15)'  },
  { value: 'ranking',  label: 'ランキング型',       color: '#da4a4a', bg: 'rgba(218,74,74,0.15)'   },
  { value: 'combined', label: '達成＆ランキング型', color: '#a04ada', bg: 'rgba(160,74,218,0.15)'  },
  { value: 'skip_pass',label: 'スキップパス利用',   color: '#4ada8a', bg: 'rgba(74,218,138,0.15)'  },
  { value: 'personal', label: '個人的イベント',     color: '#e8eaf0', bg: 'rgba(232,234,240,0.12)' },
];

export interface LiteEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string | null;
  type: IriamEventType;
  description: string;
}

export interface LiteData {
  liverName: string;
  events: LiteEvent[];
  generatedAt: string;
}
