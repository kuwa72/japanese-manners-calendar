# 開発者向けガイド

このドキュメントでは、「日本のマナー日めくりカレンダー」の開発に関する情報を提供します。

## 開発環境のセットアップ

1. リポジトリをクローン：
   ```
   git clone https://github.com/kuwa72/jmanners.git
   cd jmanners
   ```

2. 依存関係をインストール：
   ```
   npm install
   ```

## 利用可能なスクリプト

このプロジェクトでは、以下のnpmスクリプトが利用可能です：

- `npm start` - ローカル開発サーバーを起動し、ブラウザで開く
- `npm run process-data` - マナーデータを解析して多言語対応のJSONに変換
- `npm run build` - 配布用のファイルを生成
- `npm run deploy` - GitHub Pagesにデプロイ
- `npm run lint` - JavaScriptファイルの検証
- `npm run format` - コードのフォーマット（Prettierを使用）
- `npm test` - テスト実行（現在は未実装）

## 開発ワークフロー

### 1. データの処理

マナーデータの処理を行う場合：

```
npm run process-data
```

このコマンドは `365-fake-manners.md` ファイルを解析し、多言語対応のJSON形式に変換します。変換結果は `manners-data.json` と `manners-data.js` に保存されます。

### 2. ローカルでの開発

ローカル開発サーバーを起動：

```
npm start
```

このコマンドは自動的にブラウザでアプリケーションを開きます。ファイルを変更すると、ブラウザは自動的に更新されます。

### 3. ビルドとデプロイ

プロジェクトのビルド：

```
npm run build
```

GitHub Pagesへのデプロイ：

```
npm run deploy
```

## プロジェクト構造

```
jmanners/
├── index.html            # メインHTMLファイル
├── style.css             # スタイルシート
├── calendar.js           # カレンダー機能
├── manners-data.js       # マナーデータ管理
├── 365-fake-manners.md   # 元のマナーデータ
├── preprocess-manners.js # データ前処理スクリプト
├── manners-data.json     # 生成されたJSONデータ
├── package.json          # プロジェクト設定
├── README.md             # プロジェクト説明
└── DEVELOPMENT.md        # 開発者向けガイド
```

## 多言語対応

このプロジェクトは日本語、英語、中国語に対応しています。新しい言語を追加する場合は、以下のファイルを修正します：

1. `calendar.js` の `translations` オブジェクト
2. `preprocess-manners.js` に新しい翻訳関数を追加
3. `index.html` の言語選択部分

## GitHub Pagesへのデプロイ

GitHub Pagesにデプロイするには、以下の手順に従います：

1. すべての変更をコミットしてプッシュ
2. デプロイコマンドを実行：
   ```
   npm run deploy
   ```

このコマンドは自動的にプロジェクトをビルドし、`gh-pages` ブランチにデプロイします。
