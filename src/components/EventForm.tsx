import { useState } from 'react';
import { IRIAM_EVENT_TYPES, type IriamEventType, type LiteEvent } from '../types';
import { generateId } from '../lib/id';
import { todayString } from '../lib/dates';

interface FormState {
  title: string;
  startDate: string;
  endDate: string;
  type: IriamEventType;
  description: string;
}

interface Props {
  onAdd: (event: LiteEvent) => void;
}

const DEFAULT: FormState = {
  title: '',
  startDate: todayString(),
  endDate: '',
  type: 'star',
  description: '',
};

export function EventForm({ onAdd }: Props) {
  const [form, setForm] = useState<FormState>(DEFAULT);
  const [error, setError] = useState('');

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    setError('');
  };

  const handleSubmit = () => {
    if (!form.title.trim()) { setError('イベント名を入力してください'); return; }
    if (!form.startDate)    { setError('開始日を入力してください'); return; }
    if (form.endDate && form.endDate < form.startDate) {
      setError('終了日は開始日以降を指定してください'); return;
    }
    onAdd({
      id: generateId(),
      title: form.title.trim(),
      startDate: form.startDate,
      endDate: form.endDate || null,
      type: form.type,
      description: form.description.trim(),
    });
    setForm({ ...DEFAULT, startDate: form.startDate });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

      {/* 1行目：イベント名・日付（スマホは縦積み） */}
      <div className="form-row-dates">
        <div className="form-group" style={{ marginBottom: 0, flex: 2 }}>
          <label className="form-label">イベント名 *</label>
          <input
            type="text"
            placeholder="例：5月スターイベント"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            maxLength={60}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
          <label className="form-label">開始日 *</label>
          <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
          <label className="form-label">終了日（任意）</label>
          <input type="date" value={form.endDate} min={form.startDate} onChange={(e) => set('endDate', e.target.value)} />
        </div>
      </div>

      {/* 2行目：種別（スマホは2列） */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">イベント種別</label>
        <div className="event-type-grid">
          {IRIAM_EVENT_TYPES.map((t) => {
            const active = form.type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => set('type', t.value)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  padding: '7px 6px',
                  border: `1px solid ${active ? t.color : t.color + '44'}`,
                  background: active ? t.bg : 'transparent',
                  color: active ? t.color : 'var(--text-muted)',
                  borderRadius: 7, fontSize: 11, cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', letterSpacing: '0.04em',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3行目：説明 + 追加ボタン */}
      <div className="form-row-submit">
        <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
          <label className="form-label">説明（任意）</label>
          <input
            type="text"
            placeholder="ファンへのメッセージ"
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            maxLength={200}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        <button
          className="btn-primary"
          type="button"
          onClick={handleSubmit}
          style={{ padding: '8px 20px', whiteSpace: 'nowrap', alignSelf: 'flex-end' }}
        >
          ＋ 追加
        </button>
      </div>

      {error && (
        <div style={{
          fontSize: 12, color: '#e05555', padding: '6px 10px',
          background: 'rgba(224,85,85,0.08)', border: '1px solid rgba(224,85,85,0.2)',
          borderRadius: 6,
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
