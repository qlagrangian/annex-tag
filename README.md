
# annex-tag
[![Build Status](https://img.shields.io/github/actions/workflow/status/qlagrangian/annex-tag/ci.yml)](https://github.com/qlagrangian/annex-tag/actions)

![Repo Card](https://github-readme-stats.vercel.app/api/pin/?username=qlagrangian&repo=annex-tag)

Word Office.js アドインで「別紙」タグを文書に挿入・管理し、紐づいた別紙をまとめて PDF に結合・出力する MVP 実装のリポジトリです。

---

## 🎯 ゴール

1. **タグ付きで別紙ファイルを保管**し、Word 文書内では「別紙1」「別紙A」などの文字列ではなく “タグ” を挿入  
2. タグ番号・見出しが後で変わっても、一括更新で Word 文書側に即時反映  
3. ボタン一つで、紐づいた別紙ファイルを **まとめて PDF に結合**して出力  

---

## 📂 ディレクトリ構造

```

qlagrangian-annex-tag/
├ annex.db               ← SQLite データベース（初期データ含む）
├ init-db.sql            ← DB 初期化スクリプト
├ manifest.xml           ← Office Add-in マニフェスト
├ package.json           ← npm スクリプト & 依存定義
├ tsconfig.json          ← TypeScript 設定
├ webpack.config.js      ← ビルド／Dev Server 設定
├ .eslintrc.json         ← ESLint 設定
├ docs/
│  └ Office証明書発行.md  ← 開発用 CA 証明書の導入手順
└ src/
├ commands/           ← Add-in コマンド UI
├ server/             ← Express + SQLite バックエンド
└ taskpane/           ← React Task Pane UI

````

---

## 🔧 必要要件

- Node.js ≥ 20.x, npm ≥ 10.x  
- Office 365 デスクトップ版 Word  
- SQLite3 CLI (`sqlite3`)  
- PowerShell（Windows）またはターミナル（macOS）  

---

## ⚙️ 環境構築手順

以下、**Windows/macOS 共通部分**→**OS ごとの証明書発行手順**→**起動** の順にご案内します。

### 1. リポジトリのクローン・依存インストール（共通）

```bash
git clone https://github.com/qlagrangian/annex-tag.git
cd annex-tag
npm install
````

### 2. 開発用証明書のインストール

開発用 HTTPS 証明書は Office.js Add-in のサイドロード時に必須です。
詳細は [📁 Office証明書発行手順](./docs/Office証明書発行.md) をご参照ください。

#### Windows

1. **PowerShell を管理者として起動**
2. **実行ポリシー設定（必要に応じて）**

   ```powershell
   # 一時的バイパス
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
   # 永続的変更（CurrentUser）
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
   ```
3. **グローバルツールをインストール**

   ```powershell
   npm install -g yo generator-office office-addin-dev-certs
   ```
4. **証明書をマシン全体にインストール**

   ```powershell
   office-addin-dev-certs install --machine
   ```
5. **証明書の確認**

   * `certutil -store root | findstr /C:"Office Add-in Dev"`
   * または MMC で「証明書 (コンピューター アカウント) > 信頼されたルート証明機関」を確認

#### macOS

1. **Homebrew で Node.js を用意**

   ```bash
   brew install node
   ```
2. **グローバルツールをインストール**

   ```bash
   npm install -g yo generator-office office-addin-dev-certs
   ```
3. **証明書をユーザー単位にインストール**

   ```bash
   office-addin-dev-certs install
   ```
4. **証明書の確認**

   ```bash
   security find-certificate -c "Office Addin Development Certificate" \
     -a -p | openssl x509 -noout -subject -dates -fingerprint
   ```

   * または Keychain Access で “Office Addin Development Certificate” を探す

### 3. DB 初期化（必要に応じて）

```bash
# annex.db がない場合、init-db.sql を流し込む
sqlite3 annex.db < init-db.sql
```

### 4. 開発サーバー起動

```bash
npm start
```

* **start\:server** → Express API サーバー（`http://localhost:3002`）
* **start\:dev-server** → webpack-dev-server（[HTTPS://localhost:3000](HTTPS://localhost:3000) Task Pane UI）

Word 側は manifest.xml をサイドロードし、Ribbon の「Show Task Pane」から Task Pane を開いて動作確認します。

---

## ⚙️ 主な npm スクリプト

| コマンド                       | 説明                                       |
| -------------------------- | ---------------------------------------- |
| `npm run prestart`         | 開発用証明書のインストール                            |
| `npm start`                | `start:server` + `start:dev-server` 並列起動 |
| `npm run start:server`     | Express API サーバー起動（3002）                 |
| `npm run start:dev-server` | Task Pane UI 起動（3000）                    |
| `npm run build:dev`        | 開発ビルド（デバッグ用最適化なし）                        |
| `npm run build`            | 本番ビルド（最適化＋minify）                        |
| `npm run lint`             | ESLint チェック                              |
| `npm run lint:fix`         | ESLint 自動修正                              |
| `npm run prettier`         | Prettier フォーマット                          |
| `npm run validate`         | Add-in マニフェスト検証                          |
| `npm run stop`             | サイドロード停止                                 |

---

## 📚 ドキュメント

* `docs/Office証明書発行.md` — Windows／macOS 両環境での証明書発行手順
* `init-db.sql`            — SQLite DB 初期化スクリプト
* `manifest.xml`           — Office Add-in マニフェスト設定

---

以上で、「git clone → 環境構築 → 開発サーバー起動 → Word で動作確認」まで一通りカバーしています。
新しく参加する方はこの README に従ってセットアップし、Task Pane UI や API を触ってみてください！


