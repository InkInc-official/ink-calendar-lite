import { useEffect, useState } from 'react';
import { getDataFromUrl } from './lib/encode';
import type { LiteData, LiteEvent } from './types';
import { PublicView } from './components/PublicView';

const MAX_EVENTS = 10;

const DEFAULT_DATA: LiteData = {
  liverName: '',
  events: [],
  generatedAt: new Date().toISOString(),
};

function App() {
  const [data, setData] = useState<LiteData>(DEFAULT_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fromUrl = getDataFromUrl();
    if (fromUrl) {
      setData(fromUrl);
    }
    setLoading(false);
  }, []);

  const handleAddEvent = (ev: LiteEvent) => {
    setData((prev) => {
      const updated = [...prev.events, ev];
      // 10件上限：超えたら最古の1件を自動削除
      const trimmed = updated.length > MAX_EVENTS
        ? updated.slice(updated.length - MAX_EVENTS)
        : updated;
      return { ...prev, events: trimmed, generatedAt: new Date().toISOString() };
    });
  };

  const handleDeleteEvent = (id: string) => {
    setData((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
      generatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateLiverName = (name: string) => {
    setData((prev) => ({ ...prev, liverName: name }));
    setIsEditing(true);
  };

  if (loading) {
    return <div className="loading">読み込み中…</div>;
  }

  return (
    <div className="app-shell">
      <PublicView
        data={data}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing((v) => !v)}
        onAddEvent={handleAddEvent}
        onDeleteEvent={handleDeleteEvent}
        onUpdateLiverName={handleUpdateLiverName}
        maxEvents={MAX_EVENTS}
      />
    </div>
  );
}

export default App;
