# Caravan-3

ブラウザのスタートアップページの作成

# Development

## 環境構築

amplify_outputs.jsonをダウンロードし、`caravan-3`直下に配置してください。

クラウドサンドボックスを起動することで本番ブランチに影響を与えずにバックエンドを更新することができます。

`$npx ampx sandbox`

profileを設定している場合は`--profile`オプションを指定することができます。

初回は5分ほど展開にかかります。
多くの場合、`$npm run dev`と一緒に利用する想定です。

## package

npmで管理しています。

node: 20.15.1
npm: 10.7.0

### 個別のパッケージ

初期に`$npx create-next-app`で生成されるパッケージについては説明を省略しています。

- aws-amplify
  - Amplifyをローカルで動作させるために利用
- @aws-amplify/backend @aws-amplify/backend-cli
  - Amplifyの開発のために利用
- @aws-amplify/ui-react
  - Amplifyを利用したUIパッケージとして利用

## 起動方法

`$npm run install`後、`$npm run dev`で起動できます。

# Design

## カラー配色

- ベース（70%）
  - `slate-50`(#f8fafc)
- メイン（25%）
  - `Emerald-800`(#065f46)
- アクセント（5%）
  - `orange-500`(#f97316)
