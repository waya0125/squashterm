/**
 * spotify-ui.js — Spotify 風 UI テーマ パッチ
 * body.theme-spotify クラスの付与/除去 + Spotify プレイヤーバーの状態同期
 */
(function () {
  "use strict";

  const THEME_KEY = "squashterm_ui_theme";
  const SPOTIFY = "spotify";

  // ================================================================
  // テーマ切り替え
  // ================================================================

  function applyTheme(theme) {
    if (theme === SPOTIFY) {
      document.body.classList.add("theme-spotify");
    } else {
      document.body.classList.remove("theme-spotify");
    }
    updateToggleBtn();
    syncSpBarVisibility();
  }

  function toggleTheme() {
    const next = document.body.classList.contains("theme-spotify")
      ? "default"
      : SPOTIFY;
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  function updateToggleBtn() {
    const btn = document.getElementById("sp-theme-toggle-btn");
    if (!btn) return;
    const active = document.body.classList.contains("theme-spotify");
    btn.setAttribute("aria-pressed", String(active));
    const label = btn.querySelector(".sp-toggle-label");
    if (label) {
      label.textContent = active ? "Spotify風UIをオフ" : "Spotify風UIをオン";
    }
    btn.classList.toggle("is-active", active);
  }

  // ================================================================
  // DOMContentLoaded 初期化
  // ================================================================

  function init() {
    // URL param (?ui=spotify or ?ui=default) を処理
    const params = new URLSearchParams(location.search);
    if (params.has("ui")) {
      const val = params.get("ui");
      localStorage.setItem(THEME_KEY, val);
      params.delete("ui");
      const newUrl = params.toString()
        ? `${location.pathname}?${params}`
        : location.pathname;
      history.replaceState(null, "", newUrl);
    }

    // localStorage からテーマを適用
    applyTheme(localStorage.getItem(THEME_KEY));

    // トグルボタンにイベントリスナー
    const btn = document.getElementById("sp-theme-toggle-btn");
    if (btn) btn.addEventListener("click", toggleTheme);

    // Spotify プレイヤーバー初期化
    initSpBar();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // ================================================================
  // Spotify プレイヤーバー初期化
  // ================================================================

  function initSpBar() {
    const spBar = document.getElementById("sp-player-bar");
    if (!spBar) return;

    // --- ボタンを既存 mini-player ボタンへ委譲 ---
    const btnDelegates = {
      "sp-toggle":        "mini-toggle",
      "sp-prev":          "mini-prev",
      "sp-next":          "mini-next",
      "sp-shuffle":       "mini-shuffle",
      "sp-loop":          "mini-loop",
      "sp-favorite":      "mini-favorite",
      "sp-expand":        "mini-expand",
      "sp-volume-toggle": "mini-volume-toggle",
    };

    for (const [spId, origId] of Object.entries(btnDelegates)) {
      const spBtn = document.getElementById(spId);
      const orig  = document.getElementById(origId);
      if (spBtn && orig) {
        spBtn.addEventListener("click", (e) => {
          e.preventDefault();
          orig.click();
        });
      }
    }

    // --- シークバー委譲（sp-seek → mini-seek） ---
    const spSeek   = document.getElementById("sp-seek");
    const miniSeek = document.getElementById("mini-seek");
    if (spSeek && miniSeek) {
      spSeek.addEventListener("input", () => {
        miniSeek.value = spSeek.value;
        miniSeek.dispatchEvent(new Event("input", { bubbles: true }));
        updateSeekCss(spSeek);
      });
    }

    // --- 音量スライダー相互委譲 ---
    const spVol   = document.getElementById("sp-volume-slider");
    const miniVol = document.getElementById("mini-volume-slider");
    if (spVol && miniVol) {
      spVol.addEventListener("input", () => {
        miniVol.value = spVol.value;
        miniVol.dispatchEvent(new Event("input", { bubbles: true }));
      });
      miniVol.addEventListener("input", () => {
        spVol.value = miniVol.value;
      });
    }

    // --- audio イベント（シーク・再生状態同期）---
    const audio = document.getElementById("audio-player");
    if (audio) {
      audio.addEventListener("timeupdate",     syncTimeAndSeek);
      audio.addEventListener("durationchange", syncTimeAndSeek);
      audio.addEventListener("play",           syncPlayPause);
      audio.addEventListener("pause",          syncPlayPause);
      audio.addEventListener("ended",          syncPlayPause);
    }

    // --- MutationObserver: テキスト同期 ---
    observeText("mini-title",  "sp-title");
    observeText("mini-artist", "sp-artist");

    // --- MutationObserver: カバー画像 ---
    const miniCover = document.getElementById("mini-cover");
    const spCover   = document.getElementById("sp-cover");
    if (miniCover && spCover) {
      new MutationObserver(() => {
        spCover.src = miniCover.src;
        spCover.alt = miniCover.alt;
      }).observe(miniCover, { attributes: true, attributeFilter: ["src", "alt"] });
    }

    // --- MutationObserver: mini-player の表示/非表示 ---
    const miniPlayer = document.getElementById("mini-player");
    if (miniPlayer) {
      new MutationObserver(syncSpBarVisibility)
        .observe(miniPlayer, { attributes: true, attributeFilter: ["aria-hidden"] });
    }

    // --- MutationObserver: ボタン状態 ---
    observeButtonAttrs("mini-toggle",   "sp-toggle",   ["aria-label", "class"]);
    observeButtonAttrs("mini-loop",     "sp-loop",     ["aria-label", "aria-pressed", "class"]);
    observeButtonAttrs("mini-shuffle",  "sp-shuffle",  ["aria-label", "aria-pressed", "class"]);
    observeButtonAttrs("mini-favorite", "sp-favorite", ["aria-label", "aria-pressed", "class"]);

    // --- MutationObserver: ループラベル文字 ---
    const miniLoop = document.getElementById("mini-loop");
    const spLoop   = document.getElementById("sp-loop");
    if (miniLoop && spLoop) {
      new MutationObserver(() => {
        const srcLabel = miniLoop.querySelector(".loop-label");
        const dstLabel = spLoop.querySelector(".sp-loop-label");
        if (srcLabel && dstLabel) dstLabel.textContent = srcLabel.textContent;
      }).observe(miniLoop, { childList: true, subtree: true, characterData: true });
    }

    // 初回フル同期
    setTimeout(syncAll, 120);
  }

  // ================================================================
  // MutationObserver ヘルパー: テキスト同期
  // ================================================================
  function observeText(srcId, dstId) {
    const src = document.getElementById(srcId);
    const dst = document.getElementById(dstId);
    if (!src || !dst) return;
    new MutationObserver(() => {
      dst.textContent = src.textContent;
    }).observe(src, { childList: true, characterData: true, subtree: true });
  }

  // ================================================================
  // MutationObserver ヘルパー: ボタン aria 属性・クラス同期
  // ================================================================
  function observeButtonAttrs(srcId, dstId, attrs) {
    const src = document.getElementById(srcId);
    const dst = document.getElementById(dstId);
    if (!src || !dst) return;

    const sync = () => {
      if (attrs.includes("aria-label"))
        dst.setAttribute("aria-label", src.getAttribute("aria-label") || "");
      if (attrs.includes("aria-pressed"))
        dst.setAttribute("aria-pressed", src.getAttribute("aria-pressed") || "false");
      if (attrs.includes("class")) {
        for (const cls of ["is-playing", "is-active", "is-loop"]) {
          dst.classList.toggle(cls, src.classList.contains(cls));
        }
      }
    };

    new MutationObserver(sync)
      .observe(src, { attributes: true, attributeFilter: attrs });
  }

  // ================================================================
  // 同期: シークバーと時間表示
  // ================================================================
  function syncTimeAndSeek() {
    const miniCurrent  = document.getElementById("mini-current");
    const miniDuration = document.getElementById("mini-duration");
    const spCurrent    = document.getElementById("sp-current");
    const spDuration   = document.getElementById("sp-duration");

    if (spCurrent  && miniCurrent)  spCurrent.textContent  = miniCurrent.textContent;
    if (spDuration && miniDuration) spDuration.textContent = miniDuration.textContent;

    const spSeek   = document.getElementById("sp-seek");
    const miniSeek = document.getElementById("mini-seek");
    if (spSeek && miniSeek && document.activeElement !== spSeek) {
      spSeek.max   = miniSeek.max;
      spSeek.value = miniSeek.value;
      updateSeekCss(spSeek);
    }
  }

  // ================================================================
  // 同期: 再生/一時停止状態
  // ================================================================
  function syncPlayPause() {
    const audio    = document.getElementById("audio-player");
    const spToggle = document.getElementById("sp-toggle");
    if (!audio || !spToggle) return;
    const playing = !audio.paused;
    spToggle.classList.toggle("is-playing", playing);
    spToggle.setAttribute("aria-label", playing ? "一時停止" : "再生");
  }

  // ================================================================
  // 同期: Spotify バーの表示/非表示を mini-player に合わせる
  // ================================================================
  function syncSpBarVisibility() {
    const miniPlayer = document.getElementById("mini-player");
    const spBar      = document.getElementById("sp-player-bar");
    if (!miniPlayer || !spBar) return;
    const visible = miniPlayer.getAttribute("aria-hidden") === "false";
    spBar.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  // ================================================================
  // 全項目フル同期（初回 + テーマ切り替え時）
  // ================================================================
  function syncAll() {
    // テキスト
    for (const [srcId, dstId] of [
      ["mini-title",    "sp-title"],
      ["mini-artist",   "sp-artist"],
      ["mini-current",  "sp-current"],
      ["mini-duration", "sp-duration"],
    ]) {
      const src = document.getElementById(srcId);
      const dst = document.getElementById(dstId);
      if (src && dst) dst.textContent = src.textContent;
    }

    // カバー画像
    const miniCover = document.getElementById("mini-cover");
    const spCover   = document.getElementById("sp-cover");
    if (miniCover && spCover) {
      spCover.src = miniCover.src;
      spCover.alt = miniCover.alt;
    }

    // シーク・時間
    syncTimeAndSeek();

    // 再生状態
    syncPlayPause();

    // 表示/非表示
    syncSpBarVisibility();

    // 音量
    const miniVol = document.getElementById("mini-volume-slider");
    const spVol   = document.getElementById("sp-volume-slider");
    if (miniVol && spVol) spVol.value = miniVol.value;

    // ボタン状態
    for (const [srcId, dstId] of [
      ["mini-toggle",   "sp-toggle"],
      ["mini-loop",     "sp-loop"],
      ["mini-shuffle",  "sp-shuffle"],
      ["mini-favorite", "sp-favorite"],
    ]) {
      const src = document.getElementById(srcId);
      const dst = document.getElementById(dstId);
      if (!src || !dst) continue;
      dst.setAttribute("aria-label",   src.getAttribute("aria-label")   || "");
      dst.setAttribute("aria-pressed", src.getAttribute("aria-pressed") || "false");
      for (const cls of ["is-playing", "is-active", "is-loop"]) {
        dst.classList.toggle(cls, src.classList.contains(cls));
      }
    }

    // ループラベル
    const miniLoop = document.getElementById("mini-loop");
    const spLoop   = document.getElementById("sp-loop");
    if (miniLoop && spLoop) {
      const srcLabel = miniLoop.querySelector(".loop-label");
      const dstLabel = spLoop.querySelector(".sp-loop-label");
      if (srcLabel && dstLabel) dstLabel.textContent = srcLabel.textContent;
    }
  }

  // ================================================================
  // ユーティリティ: シークバーのグラデーション CSS 変数を更新
  // ================================================================
  function updateSeekCss(input) {
    const max = parseFloat(input.max) || 100;
    const val = parseFloat(input.value) || 0;
    const pct = max > 0 ? (val / max) * 100 : 0;
    input.style.setProperty("--seek-pct", `${pct}%`);
  }
})();
