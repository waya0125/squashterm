FROM python:3-slim

# ビルド時引数でGit情報を受け取る
ARG GIT_COMMIT=unknown
ARG GIT_BRANCH=unknown
ARG BUILD_DATE=unknown

# 環境変数として設定
ENV GIT_COMMIT=${GIT_COMMIT}
ENV GIT_BRANCH=${GIT_BRANCH}
ENV BUILD_DATE=${BUILD_DATE}

# システムの依存関係をインストール
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    nodejs \
    git \
    && rm -rf /var/lib/apt/lists/* \
    && git config --global --add safe.directory /app

# 作業ディレクトリを設定
WORKDIR /app

# Pythonの依存関係をコピーしてインストール
COPY requirements.txt .
RUN pip install --upgrade pip --no-cache-dir \
    && pip install --no-cache-dir -r requirements.txt

# アプリケーションのコードをコピー
COPY server/ ./server/

# データディレクトリを作成
RUN mkdir -p /app/server/data /app/server/config

# ポート8000を公開
EXPOSE 8000

# アプリケーションを実行
CMD ["python", "server/app.py"]