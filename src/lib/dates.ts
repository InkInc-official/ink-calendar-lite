export function formatDisplayDate(start: string, end?: string | null): string {
  const fmt = (d: string) => d.replace(/-/g, '/');
  if (!end || end === start) return fmt(start);
  return `${fmt(start)} 〜 ${fmt(end)}`;
}

export function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}
