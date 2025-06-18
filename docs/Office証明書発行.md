Windows／macOS それぞれで「Office Add-in 開発用 CA 証明書」を導入・確認する手順を整理します。

---


---

## Windows での導入・確認プロセス

1. **PowerShell を「管理者として実行」**
2. **（必要に応じ）スクリプト実行ポリシーの調整**

   * 一時的バイパス（管理者不要）

     ```powershell
     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
     ```
   * 永続的変更（CurrentUser スコープ）

     ```powershell
     Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
     ```
3. **グローバルツールのインストール**

   ```powershell
   # 実行ポリシー問題が残る場合は npm.cmd を使う
   npm.cmd install -g yo generator-office office-addin-dev-certs
   ```
4. **開発用 CA 証明書をマシン全体にインストール**

   ```powershell
   office-addin-dev-certs install --machine
   ```
5. **インストール確認**

   * **PowerShell で検索**

     ```powershell
     Get-ChildItem Cert:\LocalMachine\Root -Recurse |
       Where-Object { $_.Subject -like '*Office Add-in Dev*' } |
       Format-List Subject,Thumbprint,NotBefore,NotAfter
     ```
   * **certutil**

     ```powershell
     certutil -store root | findstr /C:"Office Add-in Dev"
     ```
   * **GUI**

     * `Win + R` → `mmc` → スナップインに「証明書 (コンピューター アカウント)」を追加
     * **信頼されたルート認証機関 > 証明書** を確認

---

## macOS での導入・確認プロセス

1. **Homebrew などで Node.js を用意**

   ```bash
   # 例：Homebrew
   brew install node
   ```
2. **グローバルツールのインストール**

   ```bash
   npm install -g yo generator-office office-addin-dev-certs
   ```
3. **開発用 CA 証明書をユーザー単位にインストール**

   ```bash
   office-addin-dev-certs install
   ```
4. **インストール確認**

   * **コマンドライン**

     ```bash
     security find-certificate -c "Office Addin Development Certificate" \
       -a -p | openssl x509 -noout -subject -dates -fingerprint
     ```
   * **Keychain Access（GUI）**

     * アプリケーション ＞ ユーティリティ ＞ Keychain Access
     * 左ペインで「システム」または「ログイン」を選択し、
       右ペインで “Office Addin Development Certificate” を探す

---

これで、Windows／macOS 両環境における開発用証明書の**インストール〜確認**手順が整理できます。どちらも自分の環境（ユーザー単位 or マシン全体）に合わせて適切なストアへ登録し、コマンド or GUI で証明書を検証してください。
