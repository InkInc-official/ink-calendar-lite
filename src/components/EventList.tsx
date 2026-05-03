import { IRIAM_EVENT_TYPES, type LiteEvent } from '../types';
import { formatDisplayDate } from '../lib/dates';

interface Props {
  events: LiteEvent[];
  onDelete: (id: string) => void;
}

export function EventList({ events, onDelete }: Props) {
  if (events.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'var(--text-faint)', letterSpacing: '0.1em',
        textTransform: 'uppercase', marginBottom: 4,
      }}>
        登録済みイベント — {events.length}件
      </div>
      {events.map((ev) => {
        const t = IRIAM_EVENT_TYPES.find((x) => x.value === ev.type)!;
        return (
          <div key={ev.id} className="event-card-creator">
            <div className="event-card-type-bar" style={{ background: t.color }} />
            <div className="event-card-body">
              <div className="event-card-title">{ev.title}</div>
              <div className="event-card-meta">
                {formatDisplayDate(ev.startDate, ev.endDate)}
                <span style={{ margin: '0 5px', opacity: 0.4 }}>·</span>
                <span style={{ color: t.color }}>{t.label}</span>
              </div>
            </div>
            <button
              className="btn-danger btn-icon"
              type="button"
              onClick={() => onDelete(ev.id)}
              title="削除"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
