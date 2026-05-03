import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import { IRIAM_EVENT_TYPES, type LiteData, type LiteEvent } from '../types';
import { formatDisplayDate } from '../lib/dates';
import { EventForm } from './EventForm';
import { EventList } from './EventList';
import { buildShareUrl } from '../lib/encode';

interface Props {
  data: LiteData;
  isEditing: boolean;
  onToggleEdit: () => void;
  onAddEvent: (ev: LiteEvent) => void;
  onDeleteEvent: (id: string) => void;
  onUpdateLiverName: (name: string) => void;
  maxEvents: number;
}

export function PublicView({
  data, isEditing, onToggleEdit, onAddEvent, onDeleteEvent, onUpdateLiverName, maxEvents,
}: Props) {
  const [selected, setSelected] = useState<LiteEvent | null>(null);
  const [copied, setCopied] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState(data.liverName);

  const eventCount = data.events.length;
  const isAtLimit = eventCount >= maxEvents;

  // FullCalendar用イベントデータ
  const calendarEvents = data.events.map((ev) => {
    const t = IRIAM_EVENT_TYPES.find((x) => x.value === ev.type)!;
    const endDate = ev.endDate
      ? (() => {
          const d = new Date(ev.endDate + 'T00:00:00');
          d.setDate(d.getDate() + 1);
          return d.toISOString().slice(0, 10);
        })()
      : undefined;
    return {
      id: ev.id,
      title: ev.title,
      start: ev.startDate,
      end: endDate,
      backgroundColor: t.bg,
      borderColor: t.color,
      textColor: t.color,
      extendedProps: { event: ev },
    };
  });

  const handleEventClick = (arg: EventClickArg) => {
    setSelected(arg.event.extendedProps.event as LiteEvent);
  };

  const handleCopyUrl = async () => {
    const url = buildShareUrl(data);
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareX = () => {
    const url = buildShareUrl(data);
    const text = `📅 ${data.liverName || 'イベントスケジュール'}を公開しました！\n\n${url}\n\n#IRIAM #InkCalendarLite`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleNameSave = () => {
    if (nameInput.trim()) {
      onUpdateLiverName(nameInput.trim());
    }
    setShowNameModal(false);
  };

  const handleEditToggle = () => {
    if (!isEditing && !data.liverName) {
      setShowNameModal(true);
    } else {
      onToggleEdit();
    }
  };

  return (
    <>
      {/* ── トップバー ── */}
      <header className="topbar">
        <div className="topbar-brand">
          <img src="/logo.png" alt="Ink Inc." style={{ height: 26, verticalAlign: 'middle' }} />
          <span className="topbar-logo">Ink Calendar Lite</span>
          <span className="topbar-sub">Ink Inc.</span>
        </div>
        <nav className="topbar-nav">
          {isEditing ? (
            <>
              <button
                className={`tab-btn${copied ? ' active' : ''}`}
                onClick={handleCopyUrl}
              >
                {copied ? '✓ コピー済み' : '🔗 コピー'}
              </button>
              <button className="tab-btn" onClick={handleShareX}>
                𝕏
              </button>
              <button className="liver-btn" onClick={onToggleEdit}>
                完了
              </button>
            </>
          ) : (
            <button className="liver-btn" onClick={handleEditToggle}>
              編集する
            </button>
          )}
        </nav>
      </header>

      {/* ── ヒーロー ── */}
      <div className="public-hero">
        <div className="public-hero-title">
          {data.liverName ? `${data.liverName} Event Calendar` : 'Ink Calendar Lite'}
        </div>
      </div>

      {/* ── メインコンテンツ ── */}
      <div className="content">

        {/* 凡例 */}
        <div className="panel" style={{ padding: '12px 16px' }}>
          <div className="row" style={{ gap: 8 }}>
            {IRIAM_EVENT_TYPES.map((t) => (
              <span key={t.value} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 11, fontFamily: 'var(--font-mono)',
                color: t.color, padding: '3px 8px', borderRadius: 4,
                border: `1px solid ${t.color}44`, background: t.bg,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.color, display: 'inline-block' }} />
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* カレンダー */}
        <div className="panel">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="ja"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek',
            }}
            buttonText={{ today: '今日', month: '月', week: '週' }}
            events={calendarEvents}
            eventClick={handleEventClick}
            height={typeof window !== 'undefined' && window.innerWidth <= 600 ? 'auto' : 680}
            dayMaxEvents={3}
          />
        </div>

        {/* ── 編集モード ── */}
        {isEditing && (
          <>
            {/* ライバー名変更 */}
            <div className="panel" style={{ padding: '12px 16px' }}>
              <div className="row" style={{ gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-faint)', letterSpacing: '0.08em' }}>
                  表示名：
                </span>
                <span style={{ fontSize: 13, color: 'var(--text)' }}>
                  {data.liverName || '（未設定）'}
                </span>
                <button
                  style={{ fontSize: 11, padding: '4px 10px' }}
                  onClick={() => { setNameInput(data.liverName); setShowNameModal(true); }}
                >
                  変更
                </button>
              </div>
            </div>

            {/* イベント作成フォーム */}
            <div className="panel">
              <div className="panel-title">
                ➕ イベントを追加
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  marginLeft: 'auto',
                  color: isAtLimit ? '#e05555' : 'var(--text-faint)',
                }}>
                  {eventCount} / {maxEvents} 件
                  {isAtLimit && (
                    <span style={{ marginLeft: 8 }}>
                      ※ 追加すると最古の1件が自動削除されます
                    </span>
                  )}
                </span>
              </div>
              <EventForm onAdd={onAddEvent} />
            </div>

            {/* 登録済みイベント */}
            {eventCount > 0 && (
              <div className="panel">
                <EventList events={data.events} onDelete={onDeleteEvent} />
              </div>
            )}

            {/* URL共有 */}
            <div className="panel">
              <div className="panel-title">🔗 リスナーに共有する</div>
              <div
                className="share-url-box"
                onClick={handleCopyUrl}
                title="クリックしてコピー"
              >
                {buildShareUrl(data)}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
                クリックでコピー · データはURLの中だけに保存されます
              </div>
              <div className="row" style={{ marginTop: 12, gap: 10 }}>
                <button
                  className={`btn-copy${copied ? ' copied' : ''}`}
                  onClick={handleCopyUrl}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {copied ? '✓ コピーしました' : '🔗 URLをコピー'}
                </button>
                <button
                  className="btn-share-x"
                  onClick={handleShareX}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  𝕏 でシェア
                </button>
              </div>
            </div>

            {/* Ink Inc. クレジット */}
            <div style={{
              padding: '10px 14px',
              background: 'var(--gold-subtle)',
              border: '1px solid var(--gold-dim)',
              borderRadius: 8,
              fontSize: 11, lineHeight: 1.7,
            }}>
              <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', marginBottom: 2 }}>
                Ink Calendar Lite は Ink Inc. が制作しました
              </div>
              <a
                href="https://inkinc-hp.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--text-faint)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
              >
                https://inkinc-hp.vercel.app/
              </a>
            </div>
          </>
        )}

        {/* フッター（閲覧モードのみ） */}
        {!isEditing && (
          <footer className="public-footer">
            <div style={{
              marginBottom: 16, padding: '12px 20px',
              background: 'var(--bg-panel)', border: '1px solid var(--border)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text)', marginBottom: 2 }}>
                  このカレンダーは Ink Calendar Lite で作られました
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-faint)', letterSpacing: '0.08em' }}>
                  IRIAMライバー向け · 無料 · DBなし · 3クリックで公開
                </div>
              </div>
              <a
                href="https://inkinc-hp.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: 'var(--gold)', border: '1px solid var(--gold-dim)',
                  background: 'var(--gold-subtle)', borderRadius: 6,
                  padding: '6px 14px', textDecoration: 'none', whiteSpace: 'nowrap',
                }}
              >
                Ink Inc. →
              </a>
            </div>
            <a href="https://inkinc-hp.vercel.app/" target="_blank" rel="noopener noreferrer">Ink Inc.</a>
            {' '}· AI Creation, Human Care.
          </footer>
        )}
      </div>

      {/* ── イベント詳細モーダル ── */}
      {selected && (
        <div className="login-overlay" onClick={() => setSelected(null)}>
          <div className="login-card" style={{ maxWidth: 460 }} onClick={(e) => e.stopPropagation()}>
            <button className="login-close" onClick={() => setSelected(null)}>×</button>

            {(() => {
              const t = IRIAM_EVENT_TYPES.find((x) => x.value === selected.type)!;
              return (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 11, fontFamily: 'var(--font-mono)',
                  color: t.color, padding: '3px 8px', borderRadius: 4,
                  border: `1px solid ${t.color}44`, background: t.bg,
                  marginBottom: 10,
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: t.color, display: 'inline-block' }} />
                  {t.label}
                </span>
              );
            })()}

            <div className="login-title" style={{ fontSize: 22, marginBottom: 4 }}>
              {selected.title}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>
              📅 {formatDisplayDate(selected.startDate, selected.endDate)}
            </div>
            {selected.description && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 16 }}>
                {selected.description}
              </p>
            )}

            {!isEditing && (() => {
              const t = IRIAM_EVENT_TYPES.find((x) => x.value === selected.type)!;
              const text = `【${data.liverName}】${selected.title}\n📅 ${formatDisplayDate(selected.startDate, selected.endDate)}\n種別：${t.label}\n\n応援よろしくお願いします！\n`;
              const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
              return (
                <div className="row">
                  <a className="button btn-share-x" href={xUrl} target="_blank" rel="noreferrer">𝕏 でシェア</a>
                  <button onClick={() => navigator.clipboard.writeText(window.location.href)}>URLコピー</button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── ライバー名入力モーダル ── */}
      {showNameModal && (
        <div className="login-overlay" onClick={() => setShowNameModal(false)}>
          <div className="login-card" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
            <button className="login-close" onClick={() => setShowNameModal(false)}>×</button>
            <div className="login-title">あなたのライバー名</div>
            <div className="login-sub">カレンダーの表示名として使用されます</div>
            <input
              type="text"
              placeholder="例：紫紅愛鈴"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
              autoFocus
              maxLength={30}
            />
            <button
              className="btn-primary"
              onClick={handleNameSave}
              disabled={!nameInput.trim()}
              style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
            >
              設定して編集を開始
            </button>
          </div>
        </div>
      )}
    </>
  );
}
