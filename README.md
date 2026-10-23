# Ink Calendar Lite

> **Ink Inc.** — AI Creation, Human Care. The Future Drawn Together.

ライバーのイベント予定をファンと共有できる、**DBなし・認証なし・3クリックで公開URL生成**できる予定表ジェネレーター。

---

## 特徴

- 🗓 IRIAMイベント種別に対応した6種カラーバッジ
- 🔗 データをURLにエンコードして共有（サーバー不要）
- 🎨 3種のテーマ（Ink Dark / Midnight / Parchment）
- 📱 スマホ完結型UI（IRIAM配信者向け）
- 𝕏 ワンタップでX（Twitter）にシェア

---

## セットアップ

```bash
git clone https://github.com/BlackHeart0731/ink-calendar-lite.git
cd ink-calendar-lite
npm install
npm run dev
```

---

## デプロイ（Vercel）

```bash
git add . && git commit -m "init" && git push
```

GitHubにプッシュするとVercelが自動ビルド・デプロイします。

---

## 技術構成

| レイヤー | 技術 |
|---|---|
| フロントエンド | React 18 + Vite（TypeScript） |
| スタイリング | カスタムCSS（Ink Inc. デザインシステム） |
| データ | URLパラメータ（Base64エンコード） |
| ホスティング | Vercel |
| DB・認証 | **不要** |

---

## ライセンス

MIT — © 2026 黒井葉跡 (Ink Inc.)

---

*Ink Inc. | AI Creation, Human Care. The Future Drawn Together.*

---

Created by **Ink Inc.** / 黒井葉跡 (Kuroi Haato) — https://inkinc-hp.pages.dev/
