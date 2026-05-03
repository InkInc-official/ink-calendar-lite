import type { LiteData } from '../types';

export function encodeData(data: LiteData): string {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeData(encoded: string): LiteData | null {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes)) as LiteData;
  } catch {
    return null;
  }
}

export function getDataFromUrl(): LiteData | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('data');
  if (!encoded) return null;
  return decodeData(encoded);
}

export function buildShareUrl(data: LiteData): string {
  const encoded = encodeData(data);
  const base = window.location.origin + window.location.pathname;
  return `${base}?data=${encoded}`;
}
