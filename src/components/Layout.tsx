import type { ReactNode } from 'react';

interface Props {
  liverName: string;
  topbarRight?: ReactNode;
}

export function Layout({ liverName, topbarRight }: Props) {
  const displayName = liverName.trim() || '';
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <img src="/logo.png" alt="Ink Inc." style={{ height: 26, width: 'auto', verticalAlign: 'middle' }} />
          <span className="topbar-logo">Ink Calendar Lite</span>
          <span className="topbar-sub">Ink Inc.</span>
        </div>
        <nav className="topbar-nav">{topbarRight}</nav>
      </header>

      {/* ヒーロー */}
      <div className="public-hero" style={{ padding: '28px 32px 0' }}>
        <div className="public-hero-title">
          {displayName ? `${displayName} Event Calendar` : 'Ink Calendar Lite'}
        </div>
        <div className="public-hero-tagline">
          AI CREATION, HUMAN CARE. THE FUTURE DRAWN TOGETHER.
        </div>
      </div>
    </div>
  );
}
