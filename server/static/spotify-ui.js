/**
 * spotify-ui.js — Spotify 風 UI テーマ パッチ v2
 * body.theme-spotify クラスの付与/除去 + Spotify プレイヤーバーの状態同期
 */
(function () {
  "use strict";

  const THEME_KEY = "squashterm_ui_theme";

  /** テーマ名 → body に付与するクラスリスト */
  const THEME_CLASSES = {
    "default":       [],
    "spotify-dark":  ["theme-spotify"],
    "spotify-light": ["theme-spotify", "theme-light"],
  };

  // ================================================================
  // テーマ適用
  // ================================================================

  function applyTheme(theme) {
    // 全テーマクラスを一旦除去
    document.body.classList.remove("theme-spotify", "theme-light");
    // 新テーマのクラスを付与
    const classes = THEME_CLASSES[theme] || [];
    classes.forEach(function (cls) { document.body.classList.add(cls); });
    updateThemeSelect();
    syncSpBarVisibility();
  }

  function updateThemeSelect() {
    const sel = document.getElementById("sp-theme-select");
    if (!sel) return;
    sel.value = localStorage.getItem(THEME_KEY) || "default";
  }

  // ================================================================
  // DOMContentLoaded 初期化
  // ================================================================

  function init() {
    // URL param (?ui=spotify-dark / ?ui=spotify-light / ?ui=default) を処理
    // 旧 ?ui=spotify も spotify-dark として受け入れる
    const params = new URLSearchParams(location.search);
    if (params.has("ui")) {
      let val = params.get("ui");
      if (val === "spotify") val = "spotify-dark";
      localStorage.setItem(THEME_KEY, val);
      params.delete("ui");
      const newUrl = params.toString()
        ? location.pathname + "?" + params.toString()
        : location.pathname;
      history.replaceState(null, "", newUrl);
    }

    // localStorage からテーマを適用
    applyTheme(localStorage.getItem(THEME_KEY) || "default");

    // セレクトボックスにイベントリスナー
    const sel = document.getElementById("sp-theme-select");
    if (sel) {
      sel.addEventListener("change", function () {
        localStorage.setItem(THEME_KEY, sel.value);
        applyTheme(sel.value);
      });
    }

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

    Object.keys(btnDelegates).forEach(function (spId) {
      const origId = btnDelegates[spId];
      const spBtn = document.getElementById(spId);
      const orig  = document.getElementById(origId);
      if (spBtn && orig) {
        spBtn.addEventListener("click", function (e) {
          e.preventDefault();
          orig.click();
        });
      }
    });

    // --- シークバー委譲（sp-seek → mini-seek） ---
    const spSeek   = document.getElementById("sp-seek");
    const miniSeek = document.getElementById("mini-seek");
    if (spSeek && miniSeek) {
      spSeek.addEventListener("input", function () {
        miniSeek.value = spSeek.value;
        miniSeek.dispatchEvent(new Event("input", { bubbles: true }));
        updateSeekCss(spSeek);
      });
    }

    // --- 音量スライダー相互委譲 ---
    const spVol   = document.getElementById("sp-volume-slider");
    const miniVol = document.getElementById("mini-volume-slider");
    if (spVol && miniVol) {
      spVol.addEventListener("input", function () {
        miniVol.value = spVol.value;
        miniVol.dispatchEvent(new Event("input", { bubbles: true }));
      });
      miniVol.addEventListener("input", function () {
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
    observeText("mini-title",    "sp-title");
    observeText("mini-artist",   "sp-artist");
    observeText("player-format", "sp-format-label");

    // --- MutationObserver: カバー画像 ---
    const miniCover = document.getElementById("mini-cover");
    const spCover   = document.getElementById("sp-cover");
    if (miniCover && spCover) {
      new MutationObserver(function () {
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
      new MutationObserver(function () {
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
    new MutationObserver(function () {
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

    function sync() {
      if (attrs.indexOf("aria-label") !== -1)
        dst.setAttribute("aria-label", src.getAttribute("aria-label") || "");
      if (attrs.indexOf("aria-pressed") !== -1)
        dst.setAttribute("aria-pressed", src.getAttribute("aria-pressed") || "false");
      if (attrs.indexOf("class") !== -1) {
        ["is-playing", "is-active", "is-loop"].forEach(function (cls) {
          dst.classList.toggle(cls, src.classList.contains(cls));
        });
      }
    }

    new MutationObserver(sync)
      .observe(src, { attributes: true, attributeFilter: attrs });
  }

  // ================================================================
  // 同期: シークバーと時間表示
  // ================================================================
  function syncTimeAndSeek() {
    var miniCurrent  = document.getElementById("mini-current");
    var miniDuration = document.getElementById("mini-duration");
    var spCurrent    = document.getElementById("sp-current");
    var spDuration   = document.getElementById("sp-duration");

    if (spCurrent  && miniCurrent)  spCurrent.textContent  = miniCurrent.textContent;
    if (spDuration && miniDuration) spDuration.textContent = miniDuration.textContent;

    var spSeek   = document.getElementById("sp-seek");
    var miniSeek = document.getElementById("mini-seek");
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
    var audio    = document.getElementById("audio-player");
    var spToggle = document.getElementById("sp-toggle");
    if (!audio || !spToggle) return;
    var playing = !audio.paused;
    spToggle.classList.toggle("is-playing", playing);
    spToggle.setAttribute("aria-label", playing ? "一時停止" : "再生");
  }

  // ================================================================
  // 同期: Spotify バーの表示/非表示
  // ================================================================
  function syncSpBarVisibility() {
    var miniPlayer = document.getElementById("mini-player");
    var spBar      = document.getElementById("sp-player-bar");
    if (!miniPlayer || !spBar) return;
    var visible = miniPlayer.getAttribute("aria-hidden") === "false";
    spBar.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  // ================================================================
  // 全項目フル同期（初回 + テーマ切り替え時）
  // ================================================================
  function syncAll() {
    // テキスト
    [
      ["mini-title",    "sp-title"],
      ["mini-artist",   "sp-artist"],
      ["mini-current",  "sp-current"],
      ["mini-duration", "sp-duration"],
      ["player-format", "sp-format-label"],
    ].forEach(function (pair) {
      var src = document.getElementById(pair[0]);
      var dst = document.getElementById(pair[1]);
      if (src && dst) dst.textContent = src.textContent;
    });

    // カバー画像
    var miniCover = document.getElementById("mini-cover");
    var spCover   = document.getElementById("sp-cover");
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
    var miniVol = document.getElementById("mini-volume-slider");
    var spVol   = document.getElementById("sp-volume-slider");
    if (miniVol && spVol) spVol.value = miniVol.value;

    // ボタン状態
    [
      ["mini-toggle",   "sp-toggle"],
      ["mini-loop",     "sp-loop"],
      ["mini-shuffle",  "sp-shuffle"],
      ["mini-favorite", "sp-favorite"],
    ].forEach(function (pair) {
      var src = document.getElementById(pair[0]);
      var dst = document.getElementById(pair[1]);
      if (!src || !dst) return;
      dst.setAttribute("aria-label",   src.getAttribute("aria-label")   || "");
      dst.setAttribute("aria-pressed", src.getAttribute("aria-pressed") || "false");
      ["is-playing", "is-active", "is-loop"].forEach(function (cls) {
        dst.classList.toggle(cls, src.classList.contains(cls));
      });
    });

    // ループラベル
    var miniLoop = document.getElementById("mini-loop");
    var spLoop   = document.getElementById("sp-loop");
    if (miniLoop && spLoop) {
      var srcLabel = miniLoop.querySelector(".loop-label");
      var dstLabel = spLoop.querySelector(".sp-loop-label");
      if (srcLabel && dstLabel) dstLabel.textContent = srcLabel.textContent;
    }

    // テーマセレクト表示
    updateThemeSelect();
  }

  // ================================================================
  // ユーティリティ: シークバーのグラデーション CSS 変数を更新
  // ================================================================
  function updateSeekCss(input) {
    var max = parseFloat(input.max) || 100;
    var val = parseFloat(input.value) || 0;
    var pct = max > 0 ? (val / max) * 100 : 0;
    input.style.setProperty("--seek-pct", pct + "%");
  }
})();
