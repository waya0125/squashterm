/**
 * spotify-ui.js — Spotify 風 UI テーマ パッチ v3
 */
(function () {
  "use strict";

  var THEME_KEY = "squashterm_ui_theme";

  var THEME_CLASSES = {
    "default":       [],
    "spotify-dark":  ["theme-spotify"],
    "spotify-light": ["theme-spotify", "theme-light"],
  };

  // ================================================================
  // テーマ適用
  // ================================================================

  function applyTheme(theme) {
    document.body.classList.remove("theme-spotify", "theme-light");
    var classes = THEME_CLASSES[theme] || [];
    classes.forEach(function (cls) { document.body.classList.add(cls); });
    updateThemeSelect();
    syncSpBarVisibility();
    if (document.body.classList.contains("theme-spotify")) {
      setTimeout(syncAll, 80);
    }
  }

  function updateThemeSelect() {
    var sel = document.getElementById("sp-theme-select");
    if (!sel) return;
    sel.value = localStorage.getItem(THEME_KEY) || "default";
  }

  // ================================================================
  // DOMContentLoaded 初期化
  // ================================================================

  function init() {
    var params = new URLSearchParams(location.search);
    if (params.has("ui")) {
      var val = params.get("ui");
      if (val === "spotify") val = "spotify-dark";
      localStorage.setItem(THEME_KEY, val);
      params.delete("ui");
      var newUrl = params.toString()
        ? location.pathname + "?" + params.toString()
        : location.pathname;
      history.replaceState(null, "", newUrl);
    }

    applyTheme(localStorage.getItem(THEME_KEY) || "default");

    var sel = document.getElementById("sp-theme-select");
    if (sel) {
      sel.addEventListener("change", function () {
        localStorage.setItem(THEME_KEY, sel.value);
        applyTheme(sel.value);
      });
    }

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
    var spBar = document.getElementById("sp-player-bar");
    if (!spBar) return;

    // --- ボタン委譲 ---
    var delegates = {
      "sp-toggle":        "mini-toggle",
      "sp-prev":          "mini-prev",
      "sp-next":          "mini-next",
      "sp-shuffle":       "mini-shuffle",
      "sp-loop":          "mini-loop",
      "sp-favorite":      "mini-favorite",
      "sp-expand":        "mini-expand",
      "sp-volume-toggle": "mini-volume-toggle",
    };

    Object.keys(delegates).forEach(function (spId) {
      var spBtn = document.getElementById(spId);
      var orig  = document.getElementById(delegates[spId]);
      if (spBtn && orig) {
        spBtn.addEventListener("click", function (e) {
          e.preventDefault();
          orig.click();
        });
      }
    });

    // --- シークバー委譲 ---
    var spSeek   = document.getElementById("sp-seek");
    var miniSeek = document.getElementById("mini-seek");
    if (spSeek && miniSeek) {
      spSeek.addEventListener("input", function () {
        miniSeek.value = spSeek.value;
        miniSeek.dispatchEvent(new Event("input", { bubbles: true }));
        updateSeekCss(spSeek);
      });
    }

    // --- 音量スライダー双方向同期 ---
    var spVol   = document.getElementById("sp-volume-slider");
    var miniVol = document.getElementById("mini-volume-slider");
    if (spVol && miniVol) {
      spVol.addEventListener("input", function () {
        miniVol.value = spVol.value;
        miniVol.dispatchEvent(new Event("input", { bubbles: true }));
      });
      miniVol.addEventListener("input", function () {
        spVol.value = miniVol.value;
      });
    }

    // --- audio イベント ---
    var audio = document.getElementById("audio-player");
    if (audio) {
      audio.addEventListener("timeupdate",     syncTimeAndSeek);
      audio.addEventListener("durationchange", syncTimeAndSeek);
      audio.addEventListener("play",           syncPlayPause);
      audio.addEventListener("pause",          syncPlayPause);
      audio.addEventListener("ended",          syncPlayPause);
    }

    // --- テキスト同期（MutationObserver）---
    observeText("mini-title",    "sp-title",  true);   // marquee 対応
    observeText("mini-artist",   "sp-artist", true);   // marquee 対応
    observeText("mini-current",  "sp-current",  false);
    observeText("mini-duration", "sp-duration", false);
    observeText("player-format", "sp-format-label", false);

    // --- カバー画像同期 ---
    var miniCover = document.getElementById("mini-cover");
    var spCover   = document.getElementById("sp-cover");
    if (miniCover && spCover) {
      new MutationObserver(function () {
        spCover.src = miniCover.src;
        spCover.alt = miniCover.alt;
      }).observe(miniCover, { attributes: true, attributeFilter: ["src", "alt"] });
    }

    // --- mini-player 表示/非表示監視 ---
    var miniPlayer = document.getElementById("mini-player");
    if (miniPlayer) {
      new MutationObserver(syncSpBarVisibility)
        .observe(miniPlayer, { attributes: true, attributeFilter: ["aria-hidden"] });
    }

    // --- ボタン属性同期 ---
    observeButtonAttrs("mini-toggle",   "sp-toggle",   ["aria-label", "class"]);
    observeButtonAttrs("mini-loop",     "sp-loop",     ["aria-label", "aria-pressed", "class"]);
    observeButtonAttrs("mini-shuffle",  "sp-shuffle",  ["aria-label", "aria-pressed", "class"]);
    observeButtonAttrs("mini-favorite", "sp-favorite", ["aria-label", "aria-pressed", "class"]);

    // --- ループラベル ---
    var miniLoop = document.getElementById("mini-loop");
    var spLoop   = document.getElementById("sp-loop");
    if (miniLoop && spLoop) {
      new MutationObserver(function () {
        var srcLabel = miniLoop.querySelector(".loop-label");
        var dstLabel = spLoop.querySelector(".sp-loop-label");
        if (srcLabel && dstLabel) dstLabel.textContent = srcLabel.textContent;
      }).observe(miniLoop, { childList: true, subtree: true, characterData: true });
    }

    setTimeout(syncAll, 120);
  }

  // ================================================================
  // テキスト同期 + オプションで marquee セットアップ
  // ================================================================

  function observeText(srcId, dstId, withMarquee) {
    var src = document.getElementById(srcId);
    var dst = document.getElementById(dstId);
    if (!src || !dst) return;
    new MutationObserver(function () {
      var text = src.textContent;
      dst.dataset.rawText = text;
      if (withMarquee) {
        setupMarquee(dst, text);
      } else {
        dst.textContent = text;
      }
    }).observe(src, { childList: true, characterData: true, subtree: true });
  }

  // ================================================================
  // marquee スクロールセットアップ
  // ================================================================

  function setupMarquee(el, text) {
    if (!el) return;

    // リセット
    el.classList.remove("sp-scrolling");
    el.innerHTML = "";
    el.textContent = text;

    // 遅延して幅を測定（レイアウト安定後）
    setTimeout(function () {
      var scrollW = el.scrollWidth;
      var clientW = el.offsetWidth;
      if (scrollW <= clientW + 2) return; // 収まる場合はそのまま

      var gap   = 48;
      var speed = 50; // px/s
      var dist  = scrollW + gap;
      var dur   = dist / speed;

      // 2つのコピーを並べた内部ラッパーを作成
      var inner = document.createElement("span");
      inner.className = "sp-marquee-inner";
      inner.style.setProperty("--sp-scroll-dist", "-" + dist + "px");
      inner.style.setProperty("--sp-scroll-dur",  dur + "s");

      var copy1 = document.createElement("span");
      copy1.textContent = text;
      var copy2 = document.createElement("span");
      copy2.textContent = text;
      copy2.style.paddingLeft = gap + "px";

      inner.appendChild(copy1);
      inner.appendChild(copy2);

      el.innerHTML = "";
      el.appendChild(inner);
      el.classList.add("sp-scrolling");
    }, 50);
  }

  // ================================================================
  // ボタン属性同期
  // ================================================================

  function observeButtonAttrs(srcId, dstId, attrs) {
    var src = document.getElementById(srcId);
    var dst = document.getElementById(dstId);
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
  // シーク・時間同期
  // ================================================================

  function syncTimeAndSeek() {
    syncText("mini-current",  "sp-current");
    syncText("mini-duration", "sp-duration");

    var spSeek   = document.getElementById("sp-seek");
    var miniSeek = document.getElementById("mini-seek");
    if (spSeek && miniSeek && document.activeElement !== spSeek) {
      spSeek.max   = miniSeek.max;
      spSeek.value = miniSeek.value;
      updateSeekCss(spSeek);
    }
  }

  function syncText(srcId, dstId) {
    var src = document.getElementById(srcId);
    var dst = document.getElementById(dstId);
    if (src && dst) dst.textContent = src.textContent;
  }

  // ================================================================
  // 再生/停止状態同期
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
  // Spotify バー表示/非表示を mini-player に合わせる
  // ================================================================

  function syncSpBarVisibility() {
    var miniPlayer = document.getElementById("mini-player");
    var spBar      = document.getElementById("sp-player-bar");
    if (!miniPlayer || !spBar) return;
    var visible = miniPlayer.getAttribute("aria-hidden") === "false";
    spBar.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  // ================================================================
  // 全項目フル同期
  // ================================================================

  function syncAll() {
    // プレーンテキスト
    [
      ["mini-current",  "sp-current"],
      ["mini-duration", "sp-duration"],
      ["player-format", "sp-format-label"],
    ].forEach(function (p) { syncText(p[0], p[1]); });

    // marquee 対応テキスト
    [
      ["mini-title",  "sp-title"],
      ["mini-artist", "sp-artist"],
    ].forEach(function (p) {
      var src = document.getElementById(p[0]);
      var dst = document.getElementById(p[1]);
      if (src && dst) {
        var text = src.textContent;
        dst.dataset.rawText = text;
        setupMarquee(dst, text);
      }
    });

    // カバー
    var miniCover = document.getElementById("mini-cover");
    var spCover   = document.getElementById("sp-cover");
    if (miniCover && spCover) {
      spCover.src = miniCover.src;
      spCover.alt = miniCover.alt;
    }

    // シーク・時間
    syncTimeAndSeek();
    syncPlayPause();
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
    ].forEach(function (p) {
      var src = document.getElementById(p[0]);
      var dst = document.getElementById(p[1]);
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

    updateThemeSelect();
  }

  // ================================================================
  // シークバーのグラデーション CSS 変数を更新
  // ================================================================

  function updateSeekCss(input) {
    var max = parseFloat(input.max) || 100;
    var val = parseFloat(input.value) || 0;
    var pct = max > 0 ? (val / max) * 100 : 0;
    input.style.setProperty("--seek-pct", pct + "%");
  }
})();
