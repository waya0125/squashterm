const tabs = document.querySelectorAll(".nav-button");
const panels = document.querySelectorAll(".panel");
const navPlayerButton = document.getElementById("nav-player-button");
const sidebar = document.getElementById("sidebar");
const mobileNavToggle = document.getElementById("mobile-nav-toggle");

// プレイヤーオーバーレイを閉じた時に戻るタブを記録する
let previousActiveTab = null;

const mediaGrid = document.getElementById("media-grid");
const mediaViewToggle = document.getElementById("media-view-toggle");
const mediaSelectToggle = document.getElementById("media-select-toggle");
const bulkActionBar = document.getElementById("bulk-action-bar");
const bulkSelectedCount = document.getElementById("bulk-selected-count");
const bulkAddFavorite = document.getElementById("bulk-add-favorite");
const bulkAddPlaylist = document.getElementById("bulk-add-playlist");
const bulkDeleteBtn = document.getElementById("bulk-delete");
const bulkSelectCancel = document.getElementById("bulk-select-cancel");
const mediaSearchInput = document.getElementById("media-search");
const playlistList = document.getElementById("playlist-list");
const favorites = document.getElementById("favorites");
const playlistCreateToggle = document.getElementById("playlist-create-toggle");
const playlistCreateForm = document.getElementById("playlist-create-form");
const playlistNameInput = document.getElementById("playlist-name");
const playlistSearchInput = document.getElementById("playlist-search");
const playlistDetailTitle = document.getElementById("playlist-detail-title");
const playlistDetailDesc = document.getElementById("playlist-detail-desc");
const playlistDetailBody = document.getElementById("playlist-detail-body");
const playlistTrackSearchInput = document.getElementById("playlist-track-search");
const tagSelect = document.getElementById("tag-track-select");
const tagTitleInput = document.getElementById("tag-title");
const tagArtistInput = document.getElementById("tag-artist");
const tagAlbumInput = document.getElementById("tag-album");
const tagSourceUrlInput = document.getElementById("tag-source-url");
const tagSave = document.getElementById("tag-save");
const importForm = document.getElementById("import-form");
const importUrl = document.getElementById("import-url");
const importAutoTag = document.getElementById("import-auto-tag");
const importPlaylistSelect = document.getElementById("import-playlist-select");
const playlistConcurrencyInput = document.getElementById("playlist-concurrency");
const importSubmit = document.getElementById("import-submit");
const importLog = document.getElementById("import-log");
const importProgressBar = document.getElementById("import-progress-bar");
const importProgressText = document.getElementById("import-progress-text");
const uploadForm = document.getElementById("upload-form");
const uploadAudioInput = document.getElementById("upload-audio");
const uploadCoverInput = document.getElementById("upload-cover");
const uploadAutoTag = document.getElementById("upload-auto-tag");
const uploadTitleInput = document.getElementById("upload-title");
const uploadArtistInput = document.getElementById("upload-artist");
const uploadAlbumInput = document.getElementById("upload-album");
const uploadGenreInput = document.getElementById("upload-genre");
const uploadYearInput = document.getElementById("upload-year");
const uploadSourceUrlInput = document.getElementById("upload-source-url");
const uploadPlaylistSelect = document.getElementById("upload-playlist-select");
const uploadLog = document.getElementById("upload-log");
const localFolderForm = document.getElementById("local-folder-form");
const localFolderPathInput = document.getElementById("local-folder-path");
const localFolderAutoTag = document.getElementById("local-folder-auto-tag");
const localFolderPlaylistSelect = document.getElementById(
  "local-folder-playlist-select"
);
const localFolderLog = document.getElementById("local-folder-log");

const statusVersion = document.getElementById("status-version");
const statusDevice = document.getElementById("status-device");
const statusTime = document.getElementById("status-time");
const settingsVersionList = document.getElementById("settings-version-list");
const settingsStorageBar = document.getElementById("settings-storage-bar");
const settingsStorageText = document.getElementById("settings-storage-text");
const settingsPlaybackOptions = document.getElementById("settings-playback-options");
const systemInfoList = document.getElementById("system-info-list");
const settingsBaseUrlInput = document.getElementById("settings-base-url");
const settingsBaseUrlSave = document.getElementById("settings-base-url-save");

const audioPlayer = document.getElementById("audio-player");
const playerOverlay = document.getElementById("player-overlay");
const playerClose = document.getElementById("player-close");
const playerCover = document.getElementById("player-cover");
const playerTitle = document.getElementById("player-title");
const playerArtist = document.getElementById("player-artist");
const playerAlbum = document.getElementById("player-album");
const playerFormat = document.getElementById("player-format");
const playerToggle = document.getElementById("player-toggle");
const playerPrev = document.getElementById("player-prev");
const playerSkipBack = document.getElementById("player-skip-back");
const playerNext = document.getElementById("player-next");
const playerSkipForward = document.getElementById("player-skip-forward");
const playerStop = document.getElementById("player-stop");
const playerLoop = document.getElementById("player-loop");
const playerShuffle = document.getElementById("player-shuffle");
const playerFavorite = document.getElementById("player-favorite");
const playerMenuToggle = document.getElementById("player-menu-toggle");
const playerMenuPanel = document.getElementById("player-menu-panel");
const playerDownload = document.getElementById("player-download");
const playerAddPlaylist = document.getElementById("player-add-playlist");
const playerOpenSource = document.getElementById("player-open-source");
const playerShareTrack = document.getElementById("player-share-track");
const playerEditInfo = document.getElementById("player-edit-info");
const playerDeleteTrack = document.getElementById("player-delete-track");
const playerSeek = document.getElementById("player-seek");
const playerCurrent = document.getElementById("player-current");
const playerDuration = document.getElementById("player-duration");
const playerVolumeToggle = document.getElementById("player-volume-toggle");
const playerVolumeSlider = document.getElementById("player-volume-slider");
const spVolumeToggle = document.getElementById("sp-volume-toggle");
const spVolumeSlider = document.getElementById("sp-volume-slider");

const miniPlayer = document.getElementById("mini-player");
const miniCover = document.getElementById("mini-cover");
const miniTitle = document.getElementById("mini-title");
const miniArtist = document.getElementById("mini-artist");
const miniToggle = document.getElementById("mini-toggle");
const miniPrev = document.getElementById("mini-prev");
const miniSkipBack = document.getElementById("mini-skip-back");
const miniNext = document.getElementById("mini-next");
const miniSkipForward = document.getElementById("mini-skip-forward");
const miniStop = document.getElementById("mini-stop");
const miniLoop = document.getElementById("mini-loop");
const miniShuffle = document.getElementById("mini-shuffle");
const miniFavorite = document.getElementById("mini-favorite");
const miniExpand = document.getElementById("mini-expand");
const miniSeek = document.getElementById("mini-seek");
const miniCurrent = document.getElementById("mini-current");
const miniDuration = document.getElementById("mini-duration");

const playlistModal = document.getElementById("playlist-modal");
const playlistModalList = document.getElementById("playlist-modal-list");
const playlistModalClose = document.getElementById("playlist-modal-close");
const trackEditModal = document.getElementById("track-edit-modal");
const trackEditClose = document.getElementById("track-edit-close");
const trackEditCancel = document.getElementById("track-edit-cancel");
const trackEditForm = document.getElementById("track-edit-form");
const trackEditTitle = document.getElementById("track-edit-title");
const trackEditArtist = document.getElementById("track-edit-artist");
const trackEditAlbum = document.getElementById("track-edit-album");
const trackEditSourceUrl = document.getElementById("track-edit-source-url");
const shareDialog = document.getElementById("share-dialog");
const shareDialogUrl = document.getElementById("share-dialog-url");
const shareDialogCopy = document.getElementById("share-dialog-copy");
const shareDialogClose = document.getElementById("share-dialog-close");

const state = {
  tracks: [],
  playlists: [],
  favorites: [],
  selectedPlaylist: null,
};

const selectionState = {
  active: false,
  selectedIds: new Set(),
};

const playerState = {
  currentIndex: -1,
  isPlaying: false,
  loopMode: "off",
  shuffleMode: false,
  shuffleIndices: [],
  shufflePosition: 0,
};

const mediaViewState = {
  mode: "grid",
};

const searchState = {
  mediaQuery: "",
  playlistQuery: "",
  playlistTrackQuery: "",
};

const supportsMediaSession = "mediaSession" in navigator;

const closeMobileSidebar = () => {
  if (!sidebar) {
    return;
  }
  sidebar.classList.remove("is-open");
  mobileNavToggle?.setAttribute("aria-expanded", "false");
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (!tab.dataset.tab) return;
    // モバイルプレイヤーが開いている場合は閉じる
    if (mobilePlayerOverlay && mobilePlayerOverlay.getAttribute("aria-hidden") === "false") {
      mobilePlayerOverlay.setAttribute("aria-hidden", "true");
      previousActiveTab = null; // タブクリックで直接遷移するので以前のタブをクリア
    }
    tabs.forEach((button) => button.classList.remove("is-active"));
    panels.forEach((panel) => panel.classList.remove("is-active"));
    tab.classList.add("is-active");
    const target = document.getElementById(`panel-${tab.dataset.tab}`);
    if (target) {
      target.classList.add("is-active");
    }
    closeMobileSidebar();
  });
});

if (mobileNavToggle && sidebar) {
  mobileNavToggle.addEventListener("click", () => {
    const willOpen = !sidebar.classList.contains("is-open");
    sidebar.classList.toggle("is-open", willOpen);
    mobileNavToggle.setAttribute("aria-expanded", String(willOpen));
  });

  document.addEventListener("click", (event) => {
    if (!sidebar.classList.contains("is-open")) {
      return;
    }
    if (sidebar.contains(event.target) || mobileNavToggle.contains(event.target)) {
      return;
    }
    closeMobileSidebar();
  });
}

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
};

const showConfirmDialog = ({ title, message, showFileOption = false, buttons }) => {
  return new Promise((resolve) => {
    const dialog = document.getElementById("confirm-dialog");
    const titleEl = document.getElementById("confirm-dialog-title");
    const messageEl = document.getElementById("confirm-dialog-message");
    const fileOption = document.getElementById("confirm-dialog-file-option");
    const deleteFileCheckbox = document.getElementById("confirm-dialog-delete-file");
    const actionsEl = document.getElementById("confirm-dialog-actions");
    if (!dialog || !titleEl || !messageEl || !actionsEl) {
      resolve({ action: buttons[buttons.length - 1]?.value ?? "cancel", deleteFile: true });
      return;
    }
    titleEl.textContent = title;
    messageEl.textContent = message;
    if (fileOption) {
      fileOption.style.display = showFileOption ? "" : "none";
    }
    if (showFileOption && deleteFileCheckbox) {
      deleteFileCheckbox.checked = true;
    }
    actionsEl.innerHTML = "";
    const close = (value) => {
      dialog.classList.remove("is-open");
      dialog.setAttribute("aria-hidden", "true");
      resolve({ action: value, deleteFile: deleteFileCheckbox?.checked ?? true });
    };
    buttons.forEach(({ label, className, value }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = className;
      btn.textContent = label;
      btn.addEventListener("click", () => close(value));
      actionsEl.appendChild(btn);
    });
    dialog.classList.add("is-open");
    dialog.setAttribute("aria-hidden", "false");
  });
};

const closeShareDialog = () => {
  if (!shareDialog) {
    return;
  }
  shareDialog.classList.remove("is-open");
  shareDialog.setAttribute("aria-hidden", "true");
};

const showShareDialog = (shareUrl) => {
  if (!shareDialog || !shareDialogUrl) {
    window.prompt("共有リンクをコピーしてください", shareUrl);
    return;
  }
  shareDialogUrl.value = shareUrl;
  shareDialog.classList.add("is-open");
  shareDialog.setAttribute("aria-hidden", "false");
};

const copyShareUrl = async () => {
  const shareUrl = shareDialogUrl?.value?.trim();
  if (!shareUrl) {
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      appendImportLog("共有リンクをコピーしました。", { append: true });
      closeShareDialog();
      return;
    }
  } catch (error) {
    console.error(error);
  }
  window.prompt("共有リンクをコピーしてください", shareUrl);
};

const formatFileDetails = (track) => {
  if (!track) {
    return "--";
  }
  const formatLabel = track.file_format
    ? track.file_format.toString().toUpperCase()
    : "不明";
  const bitrateLabel = track.bitrate_kbps ? `${track.bitrate_kbps}kbps` : "不明";
  return `形式: ${formatLabel} ・ ${bitrateLabel}`;
};

const updatePlayerButtons = () => {
  const label = playerState.isPlaying ? "一時停止" : "再生";
  [playerToggle, miniToggle].forEach((button) => {
    if (!button) {
      return;
    }
    button.classList.toggle("is-playing", playerState.isPlaying);
    button.setAttribute("aria-label", label);
    const labelSpan = button.querySelector(".sr-only");
    if (labelSpan) {
      labelSpan.textContent = label;
    }
  });
  updateMediaPlayingIndicator();
};

const loopModeLabels = {
  off: { label: "オフ", short: "OFF" },
  playlist: { label: "プレイリスト内ループ", short: "PL" },
  track: { label: "1曲ループ", short: "1" },
};

const updateLoopButtons = () => {
  const mode = playerState.loopMode;
  const loopLabel = loopModeLabels[mode] || loopModeLabels.off;
  [playerLoop, miniLoop].forEach((button) => {
    if (!button) {
      return;
    }
    button.setAttribute("aria-label", `ループ: ${loopLabel.label}`);
    button.setAttribute("aria-pressed", mode === "off" ? "false" : "true");
    button.classList.toggle("is-loop", mode !== "off");
    const labelSpan = button.querySelector(".loop-label");
    if (labelSpan) {
      labelSpan.textContent = loopLabel.short;
    }
  });
};

const updateShuffleButtons = () => {
  const isOn = playerState.shuffleMode;
  const ariaLabel = `シャッフル: ${isOn ? "オン" : "オフ"}`;
  
  [playerShuffle, miniShuffle].forEach((btn) => {
    if (!btn) return;
    btn.setAttribute("aria-label", ariaLabel);
    btn.setAttribute("aria-pressed", isOn);
    if (isOn) {
      btn.classList.add("is-active");
    } else {
      btn.classList.remove("is-active");
    }
  });
};

const updateFavoriteButtons = () => {
  const track = state.tracks[playerState.currentIndex];
  const isFavorite = track ? state.favorites.includes(track.id) : false;
  const label = isFavorite ? "お気に入りから削除" : "お気に入りに追加";
  [playerFavorite, miniFavorite].forEach((button) => {
    if (!button) {
      return;
    }
    button.classList.toggle("is-active", isFavorite);
    button.setAttribute("aria-pressed", isFavorite ? "true" : "false");
    button.setAttribute("aria-label", label);
    const labelSpan = button.querySelector(".sr-only");
    if (labelSpan) {
      labelSpan.textContent = label;
    }
  });
};

const toggleFavorite = () => {
  const track = state.tracks[playerState.currentIndex];
  if (!track) {
    return;
  }
  const currentIndex = state.favorites.indexOf(track.id);
  if (currentIndex >= 0) {
    state.favorites.splice(currentIndex, 1);
  } else {
    state.favorites.push(track.id);
  }
  renderFavorites();
  updateFavoriteButtons();
  updateFavoritesTracks(state.favorites).catch((error) => {
    console.error(error);
  });
};

const closePlayerMenu = () => {
  if (!playerMenuPanel || !playerMenuToggle) {
    return;
  }
  playerMenuPanel.classList.remove("is-open");
  playerMenuPanel.setAttribute("aria-hidden", "true");
  playerMenuToggle.setAttribute("aria-expanded", "false");
};

const togglePlayerMenu = () => {
  if (!playerMenuPanel || !playerMenuToggle) {
    return;
  }
  const isOpen = playerMenuPanel.classList.toggle("is-open");
  playerMenuPanel.setAttribute("aria-hidden", isOpen ? "false" : "true");
  playerMenuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
};

const setTagFields = (track) => {
  if (!track) {
    if (tagTitleInput) {
      tagTitleInput.value = "";
    }
    if (tagArtistInput) {
      tagArtistInput.value = "";
    }
    if (tagAlbumInput) {
      tagAlbumInput.value = "";
    }
    if (tagSourceUrlInput) {
      tagSourceUrlInput.value = "";
    }
    return;
  }
  if (tagTitleInput) {
    tagTitleInput.value = track.title;
  }
  if (tagArtistInput) {
    tagArtistInput.value = track.artist;
  }
  if (tagAlbumInput) {
    tagAlbumInput.value = track.album;
  }
  if (tagSourceUrlInput) {
    tagSourceUrlInput.value = track.source_url || "";
  }
};

const updateMediaViewToggle = () => {
  if (!mediaViewToggle) {
    return;
  }
  const isList = mediaViewState.mode === "list";
  mediaViewToggle.textContent = isList ? "アルバム表示" : "リスト表示";
  mediaViewToggle.setAttribute("aria-pressed", isList ? "true" : "false");
};

const normalizeQuery = (value) => value.trim().toLowerCase();

const filterTracks = (tracks, query) => {
  const normalized = normalizeQuery(query);
  if (!normalized) {
    return tracks;
  }
  return tracks.filter((track) => {
    const target = `${track.title} ${track.artist} ${track.album} ${track.genre}`.toLowerCase();
    return target.includes(normalized);
  });
};

const filterPlaylists = (playlists, query) => {
  const normalized = normalizeQuery(query);
  if (!normalized) {
    return playlists;
  }
  return playlists.filter((playlist) =>
    String(playlist.name || "").toLowerCase().includes(normalized)
  );
};

const updateMediaPlayingIndicator = () => {
  const rows = document.querySelectorAll(".media-list-row, .playlist-track-row");
  if (!rows.length) {
    return;
  }
  const currentTrack = state.tracks[playerState.currentIndex];
  rows.forEach((row) => {
    const isCurrent =
      currentTrack && String(row.dataset.trackId) === String(currentTrack.id);
    row.classList.toggle("is-playing", Boolean(isCurrent && playerState.isPlaying));
  });
};

const updatePlayerUI = () => {
  if (playerState.currentIndex >= state.tracks.length) {
    playerState.currentIndex = -1;
  }
  const track = state.tracks[playerState.currentIndex];
  if (!track) {
    if (playerCover) {
      playerCover.src = "";
      playerCover.alt = "";
    }
    if (playerTitle) {
      playerTitle.textContent = "--";
    }
    if (playerArtist) {
      playerArtist.textContent = "--";
    }
    if (playerAlbum) {
      playerAlbum.textContent = "--";
    }
    if (playerFormat) {
      playerFormat.textContent = "--";
    }
    if (miniCover) {
      miniCover.src = "";
      miniCover.alt = "";
    }
    if (miniTitle) {
      miniTitle.textContent = "--";
    }
    if (miniArtist) {
      miniArtist.textContent = "--";
    }
    if (miniPlayer) {
      miniPlayer.classList.remove("is-active");
      miniPlayer.setAttribute("aria-hidden", "true");
    }
    if (navPlayerButton) {
      navPlayerButton.classList.add("is-hidden");
    }
    document.body?.classList.remove("has-mini-player");
    if (playerSeek) {
      playerSeek.value = 0;
    }
    if (miniSeek) {
      miniSeek.value = 0;
    }
    if (playerCurrent) {
      playerCurrent.textContent = "0:00";
    }
    if (playerDuration) {
      playerDuration.textContent = "0:00";
    }
    if (miniCurrent) {
      miniCurrent.textContent = "0:00";
    }
    if (miniDuration) {
      miniDuration.textContent = "0:00";
    }
    if (supportsMediaSession) {
      navigator.mediaSession.metadata = null;
      navigator.mediaSession.playbackState = "none";
    }
    updateMediaPlayingIndicator();
    updateLoopButtons();
    renderPlaylistModalList();
    updatePlayerMenuButtons();
    return;
  }
  if (playerCover) {
    playerCover.src = track.cover || "";
    playerCover.alt = track.album || track.title;
    // Spotify theme: set CSS custom property for centered square art
    if (playerOverlay) {
      const artUrl = track.cover ? `url("${track.cover.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}")` : "none";
      playerOverlay.style.setProperty("--player-art", artUrl);
    }
  }
  if (playerTitle) {
    playerTitle.textContent = track.title;
  }
  if (playerArtist) {
    playerArtist.textContent = track.artist;
  }
  if (playerAlbum) {
    playerAlbum.textContent = track.album;
  }
  if (playerFormat) {
    playerFormat.textContent = formatFileDetails(track);
  }
  if (miniCover) {
    miniCover.src = track.cover || "";
    miniCover.alt = track.album || track.title;
  }
  if (miniTitle) {
    miniTitle.textContent = track.title;
  }
  if (miniArtist) {
    miniArtist.textContent = track.artist;
  }
  if (miniPlayer) {
    miniPlayer.classList.add("is-active");
    miniPlayer.setAttribute("aria-hidden", "false");
  }
  if (navPlayerButton) {
    navPlayerButton.classList.remove("is-hidden");
  }
  document.body?.classList.add("has-mini-player");
  updatePlayerButtons();
  updateMediaSessionMetadata(track);
  updateMediaPlayingIndicator();
  updateFavoriteButtons();
  updateLoopButtons();
  renderPlaylistModalList();
  updatePlayerMenuButtons();
  
  // モバイルプレイヤーが開いている場合は更新
  if (mobilePlayerOverlay && mobilePlayerOverlay.getAttribute("aria-hidden") === "false") {
    updateMobilePlayerUI();
  }
};

const closePlayerOverlay = () => {
  if (playerOverlay) {
    playerOverlay.classList.remove("is-active");
    playerOverlay.setAttribute("aria-hidden", "true");
  }
  document.body?.classList.remove("player-overlay-open");
  closePlayerMenu();
  // 直前のタブに戻す
  if (previousActiveTab) {
    activateTab(previousActiveTab);
    previousActiveTab = null;
  }
};

const isPlayerOverlayActive = () => playerOverlay?.classList.contains("is-active");

const openPlayerOverlay = () => {
  // 現在のアクティブタブを記録（閉じた時に戻すため）
  previousActiveTab = null;
  tabs.forEach((t) => {
    if (t.classList.contains("is-active") && t.dataset.tab) {
      previousActiveTab = t.dataset.tab;
    }
  });
  if (!previousActiveTab) previousActiveTab = "media";
  if (playerOverlay) {
    playerOverlay.classList.add("is-active");
    playerOverlay.setAttribute("aria-hidden", "false");
  }
  document.body?.classList.add("player-overlay-open");
  updatePlayerUI();
  updatePlayerButtons();
  updateFavoriteButtons();
};

const setTrackByIndex = (index, reshuffle = true) => {
  const track = state.tracks[index];
  if (!track) {
    return;
  }
  if (!track.file_url) {
    appendImportLog("音源が見つかりません。");
    return;
  }
  playerState.currentIndex = index;
  
  // 新規選択時は再シャッフル（playNext/playPrev以外から呼ばれた場合）
  if (playerState.shuffleMode && reshuffle) {
    playerState.shuffleIndices = generateShuffleIndices();
    // 選択した曲を先頭に
    const currentPos = playerState.shuffleIndices.indexOf(index);
    if (currentPos > 0) {
      [playerState.shuffleIndices[0], playerState.shuffleIndices[currentPos]] = 
      [playerState.shuffleIndices[currentPos], playerState.shuffleIndices[0]];
    }
    playerState.shufflePosition = 0;
  } else if (playerState.shuffleMode && playerState.shuffleIndices.length > 0) {
    // playNext/playPrevから呼ばれた場合は位置を同期するだけ
    const shufflePos = playerState.shuffleIndices.indexOf(index);
    if (shufflePos >= 0) {
      playerState.shufflePosition = shufflePos;
    }
  }
  
  if (audioPlayer) {
    audioPlayer.src = track.file_url;
  }
  updatePlayerUI();
};

const togglePlayback = async () => {
  if (!audioPlayer) {
    return;
  }
  if (playerState.currentIndex === -1) {
    if (state.tracks.length > 0) {
      setTrackByIndex(0);
    } else {
      return;
    }
  }
  if (audioPlayer.paused) {
    await audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
};

const seekBySeconds = (deltaSeconds) => {
  if (!audioPlayer) {
    return;
  }
  const duration = audioPlayer.duration || 0;
  const current = audioPlayer.currentTime || 0;
  const next = duration
    ? Math.min(Math.max(current + deltaSeconds, 0), duration)
    : Math.max(current + deltaSeconds, 0);
  audioPlayer.currentTime = next;
  updateMediaSessionPosition();
};

const stopPlayback = () => {
  if (!audioPlayer) {
    return;
  }
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  audioPlayer.removeAttribute("src");
  audioPlayer.load();
  playerState.currentIndex = -1;
  playerState.isPlaying = false;
  updatePlayerUI();
  updatePlayerButtons();
};

const playNext = () => {
  if (!state.tracks.length) {
    return;
  }
  
  let nextIndex;
  if (playerState.shuffleMode && playerState.shuffleIndices.length > 0) {
    // シャッフルモード
    const nextPos = playerState.shufflePosition + 1;
    
    // 1周したら再シャッフル
    if (nextPos >= playerState.shuffleIndices.length) {
      playerState.shuffleIndices = generateShuffleIndices();
      playerState.shufflePosition = 0;
    } else {
      playerState.shufflePosition = nextPos;
    }
    
    nextIndex = playerState.shuffleIndices[playerState.shufflePosition];
  } else {
    // 通常モード
    nextIndex = (playerState.currentIndex + 1) % state.tracks.length;
  }
  
  setTrackByIndex(nextIndex, false);
  if (audioPlayer) {
    audioPlayer.play();
  }
};

const playPrev = () => {
  if (!state.tracks.length) {
    return;
  }
  
  // 再生位置が3秒以上なら曲の先頭に戻す
  if (audioPlayer && audioPlayer.currentTime > 3) {
    audioPlayer.currentTime = 0;
    return;
  }
  
  // 3秒以内または連続2度目なら前の曲へ
  let prevIndex;
  if (playerState.shuffleMode && playerState.shuffleIndices.length > 0) {
    // シャッフルモード
    const prevPos = playerState.shufflePosition - 1;
    
    // 先頭から戻ったら再シャッフルして最後尾へ
    if (prevPos < 0) {
      playerState.shuffleIndices = generateShuffleIndices();
      playerState.shufflePosition = playerState.shuffleIndices.length - 1;
    } else {
      playerState.shufflePosition = prevPos;
    }
    
    prevIndex = playerState.shuffleIndices[playerState.shufflePosition];
  } else {
    // 通常モード
    prevIndex =
      (playerState.currentIndex - 1 + state.tracks.length) % state.tracks.length;
  }
  
  setTrackByIndex(prevIndex, false);
  if (audioPlayer) {
    audioPlayer.play();
  }
};

const toggleLoopMode = () => {
  const modes = ["off", "playlist", "track"];
  const currentIndex = modes.indexOf(playerState.loopMode);
  const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % modes.length;
  playerState.loopMode = modes[nextIndex];
  localStorage.setItem("loopMode", playerState.loopMode);
  updateLoopButtons();
};

const generateShuffleIndices = () => {
  const indices = Array.from({ length: state.tracks.length }, (_, i) => i);
  // Fisher-Yatesシャッフル
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
};

const toggleShuffleMode = () => {
  playerState.shuffleMode = !playerState.shuffleMode;
  localStorage.setItem("shuffleMode", playerState.shuffleMode);
  
  if (playerState.shuffleMode) {
    // シャッフルON: ランダム配列生成
    playerState.shuffleIndices = generateShuffleIndices();
    // 現在再生中の曲を先頭に
    if (playerState.currentIndex >= 0) {
      const currentPos = playerState.shuffleIndices.indexOf(playerState.currentIndex);
      if (currentPos > 0) {
        [playerState.shuffleIndices[0], playerState.shuffleIndices[currentPos]] = 
        [playerState.shuffleIndices[currentPos], playerState.shuffleIndices[0]];
      }
      playerState.shufflePosition = 0;
    } else {
      playerState.shufflePosition = -1;
    }
  } else {
    // シャッフルOFF: 配列クリア
    playerState.shuffleIndices = [];
    playerState.shufflePosition = 0;
  }
  
  updateShuffleButtons();
};

const renderMedia = () => {
  mediaGrid.innerHTML = "";
  if (mediaViewState.mode === "list") {
    mediaGrid.classList.add("is-list");
  } else {
    mediaGrid.classList.remove("is-list");
  }
  const visibleTracks = filterTracks(state.tracks, searchState.mediaQuery);
  if (visibleTracks.length === 0) {
    mediaGrid.innerHTML = `<div class="empty-state">${
      searchState.mediaQuery ? "該当する曲がありません。" : "項目が存在しません。"
    }</div>`;
    return;
  }
  if (mediaViewState.mode === "list") {
    const list = document.createElement("div");
    list.className = "media-list";
    list.innerHTML = `
      <div class="media-list-header">
        <span></span>
        <span>アート</span>
        <span>タイトル</span>
        <span>アーティスト</span>
        <span>再生時間</span>
      </div>
    `;
    visibleTracks.forEach((track) => {
      const row = document.createElement(selectionState.active ? "div" : "button");
      row.type = selectionState.active ? undefined : "button";
      row.className = "media-list-row";
      row.dataset.trackId = track.id;
      const hasAudio = Boolean(track.file_url);
      if (!selectionState.active) {
        row.disabled = !hasAudio;
        if (!hasAudio) {
          row.classList.add("is-disabled");
        }
      }
      if (selectionState.active && selectionState.selectedIds.has(track.id)) {
        row.classList.add("is-selected");
      }

      if (selectionState.active) {
        // 選択モード: チェックボックスが status 列に入る（グリッド構造を維持）
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "media-list-checkbox";
        checkbox.checked = selectionState.selectedIds.has(track.id);
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            selectionState.selectedIds.add(track.id);
            row.classList.add("is-selected");
          } else {
            selectionState.selectedIds.delete(track.id);
            row.classList.remove("is-selected");
          }
          updateBulkBar();
        });
        row.appendChild(checkbox);
        row.insertAdjacentHTML("beforeend", `
          <img class="media-list-cover" src="${track.cover}" alt="${track.album}" loading="lazy" />
          <span class="media-list-title">${track.title}</span>
          <span class="media-list-artist">${track.artist}</span>
          <span class="media-list-duration">${track.duration}</span>
        `);
        row.style.cursor = "pointer";
        row.addEventListener("click", (e) => {
          if (e.target.type === "checkbox") return;
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change"));
        });
      } else {
        // 通常モード: status + cover + title + artist + duration（5カラム維持）
        row.innerHTML = `
          <span class="media-list-status" aria-hidden="true">
            <svg class="media-playing-icon" viewBox="0 0 24 24">
              <polygon points="8,5 19,12 8,19" />
            </svg>
          </span>
          <img class="media-list-cover" src="${track.cover}" alt="${track.album}" />
          <span class="media-list-title">${track.title}</span>
          <span class="media-list-artist">${track.artist}</span>
          <span class="media-list-duration">${track.duration}</span>
        `;
        if (hasAudio) {
          row.addEventListener("click", () => {
            const index = state.tracks.findIndex((item) => item.id === track.id);
            if (index >= 0) {
              setTrackByIndex(index);
              togglePlayback();
            }
          });
        }
      }
      list.appendChild(row);
    });
    mediaGrid.appendChild(list);
    updateMediaPlayingIndicator();
    return;
  }
  visibleTracks.forEach((track) => {
    const card = document.createElement("div");
    card.className = "media-card";
    const hasAudio = Boolean(track.file_url);
    if (selectionState.active && selectionState.selectedIds.has(track.id)) {
      card.classList.add("is-selected");
    }
    card.innerHTML = `
      ${selectionState.active ? `<input type="checkbox" class="media-list-checkbox" ${selectionState.selectedIds.has(track.id) ? "checked" : ""} style="margin-bottom:6px" />` : ""}
      <img src="${track.cover}" alt="${track.album}" loading="lazy" />
      <h3><span class="scroll-text">${track.title}</span></h3>
      <p><span class="scroll-text">${track.artist}</span></p>
      <p><span class="scroll-text">${track.album}</span></p>
      <div class="media-meta">
        <span>${track.genre} ・ ${track.year}</span>
        <span>${track.duration}</span>
      </div>
      ${!selectionState.active ? `<button class="play-button ${hasAudio ? "" : "is-disabled"}" type="button" ${hasAudio ? "" : "disabled"}>${hasAudio ? "再生" : "音源なし"}</button>` : ""}
    `;
    if (selectionState.active) {
      const cb = card.querySelector(".media-list-checkbox");
      if (cb) {
        cb.addEventListener("change", () => {
          if (cb.checked) {
            selectionState.selectedIds.add(track.id);
            card.classList.add("is-selected");
          } else {
            selectionState.selectedIds.delete(track.id);
            card.classList.remove("is-selected");
          }
          updateBulkBar();
        });
      }
      card.style.cursor = "pointer";
      card.addEventListener("click", (e) => {
        if (e.target.type === "checkbox") return;
        const checkbox = card.querySelector(".media-list-checkbox");
        if (checkbox) {
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event("change"));
        }
      });
    } else {
      card.querySelector("button")?.addEventListener("click", () => {
        const index = state.tracks.findIndex((item) => item.id === track.id);
        if (index >= 0) {
          setTrackByIndex(index);
          togglePlayback();
        }
      });
    }
    mediaGrid.appendChild(card);
  });

  // はみ出しているテキストにシームレスマーキーを適用
  const GAP_PX = 48; // テキスト繰り返し間の空白幅 (px)
  const SPEED_PX_S = 60; // スクロール速度 (px/s)
  requestAnimationFrame(() => {
    mediaGrid.querySelectorAll(".media-card .scroll-text").forEach((el) => {
      const parent = el.parentElement;
      const singleWidth = el.scrollWidth;
      if (singleWidth <= parent.clientWidth) return;

      // テキストを複製してシームレスループ構造にする
      const originalText = el.textContent;
      el.textContent = "";
      el.appendChild(document.createTextNode(originalText));
      const gap = document.createElement("span");
      gap.style.cssText = `display:inline-block;width:${GAP_PX}px`;
      el.appendChild(gap);
      el.appendChild(document.createTextNode(originalText));

      const totalDist = singleWidth + GAP_PX;
      el.style.setProperty("--overflow-width", `-${totalDist}px`);
      el.style.setProperty("--scroll-duration", `${(totalDist / SPEED_PX_S).toFixed(1)}s`);
      el.classList.add("is-overflowing");
    });
  });
};

const setSelectedPlaylist = (type, playlistId) => {
  state.selectedPlaylist = { type, id: playlistId };
  renderPlaylists();
  renderFavorites();
  renderPlaylistDetail();
};

const getSelectedPlaylistData = () => {
  if (!state.selectedPlaylist) {
    return null;
  }
  if (state.selectedPlaylist.type === "favorites") {
    return {
      id: "favorites",
      name: "お気に入り",
      track_ids: state.favorites,
    };
  }
  return state.playlists.find((playlist) => playlist.id === state.selectedPlaylist.id);
};

const buildPlaylistTrackRow = (track, listType) => {
  const row = document.createElement("div");
  row.className = "playlist-track-row";
  row.dataset.trackId = track.id;
  row.innerHTML = `
    <span class="playlist-drag-handle" draggable="true" aria-label="並び替え">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="7" width="14" height="2" rx="1" />
        <rect x="5" y="15" width="14" height="2" rx="1" />
      </svg>
    </span>
    <span class="media-list-status" aria-hidden="true">
      <svg class="media-playing-icon" viewBox="0 0 24 24">
        <polygon points="8,5 19,12 8,19" />
      </svg>
    </span>
    <img class="media-list-cover" src="${track.cover}" alt="${track.album}" loading="lazy" />
    <span class="media-list-title">${track.title}</span>
    <span class="media-list-artist">${track.artist}</span>
    <span class="media-list-duration">${track.duration}</span>
    <button class="playlist-remove" type="button" aria-label="削除">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zm-8 0h2v9H6V9z"
        />
      </svg>
    </button>
  `;
  row.addEventListener("click", (event) => {
    if (
      event.target.closest(".playlist-remove") ||
      event.target.closest(".playlist-drag-handle")
    ) {
      return;
    }
    const index = state.tracks.findIndex((item) => item.id === track.id);
    if (index >= 0) {
      setTrackByIndex(index);
      togglePlayback();
    }
  });
  row
    .querySelector(".playlist-drag-handle")
    .addEventListener("dragstart", (event) => {
      row.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", track.id);
    });
  row
    .querySelector(".playlist-drag-handle")
    .addEventListener("dragend", () => {
      row.classList.remove("is-dragging");
    });
  row.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  });
  row.addEventListener("drop", (event) => {
    event.preventDefault();
    const draggedId = event.dataTransfer.getData("text/plain");
    if (!draggedId || draggedId === track.id) {
      return;
    }
    reorderPlaylistTracks(listType, draggedId, track.id);
  });
  row.querySelector(".playlist-remove").addEventListener("click", () => {
    removePlaylistTrack(listType, track.id);
  });
  return row;
};

const formatSyncStatus = (playlist) => {
  if (!playlist?.auto_sync_last_run) {
    return "まだ同期されていません。";
  }
  const errorText = playlist.auto_sync_last_error
    ? `（エラー: ${playlist.auto_sync_last_error.split("\n")[0]}）`
    : "";
  return `最終同期: ${playlist.auto_sync_last_run} ${errorText}`.trim();
};

const buildPlaylistSyncCard = (playlist) => {
  const card = document.createElement("div");
  card.className = "card playlist-sync-card";
  card.innerHTML = `
    <h4>プレイリスト自動同期</h4>
    <p class="playlist-sync-lead">
      外部プレイリストとの差分を定期的にチェックして追加曲を取り込みます。
    </p>
    <label>
      <span>同期先プレイリスト URL</span>
      <input type="url" class="playlist-sync-url" placeholder="https://www.youtube.com/playlist?list=..." />
    </label>
    <label>
      <span>同期間隔（分）</span>
      <input type="number" class="playlist-sync-interval" min="1" step="1" placeholder="60" />
    </label>
    <label class="checkbox">
      <input type="checkbox" class="playlist-sync-enabled" />
      <span>自動同期を有効にする</span>
    </label>
    <div class="playlist-sync-actions">
      <button type="button" class="secondary playlist-sync-save">設定を保存</button>
      <button type="button" class="primary playlist-sync-run">手動で同期する</button>
    </div>
    <p class="playlist-sync-status"></p>
  `;
  const urlInput = card.querySelector(".playlist-sync-url");
  const intervalInput = card.querySelector(".playlist-sync-interval");
  const enabledInput = card.querySelector(".playlist-sync-enabled");
  const saveButton = card.querySelector(".playlist-sync-save");
  const runButton = card.querySelector(".playlist-sync-run");
  const statusLabel = card.querySelector(".playlist-sync-status");

  if (urlInput) {
    urlInput.value = playlist.auto_sync_url || "";
  }
  if (intervalInput) {
    intervalInput.value = playlist.auto_sync_interval_minutes || "";
  }
  if (enabledInput) {
    const enabled =
      playlist.auto_sync_enabled ?? Boolean(playlist.auto_sync_url);
    enabledInput.checked = Boolean(enabled);
  }
  if (runButton) {
    runButton.hidden = !playlist.auto_sync_url;
  }
  if (statusLabel) {
    statusLabel.textContent = formatSyncStatus(playlist);
  }
  if (saveButton) {
    saveButton.addEventListener("click", async () => {
      if (!urlInput || !intervalInput || !enabledInput) {
        return;
      }
      const autoSyncUrl = urlInput.value.trim();
      const intervalValue = intervalInput.value.trim();
      const parsedInterval = intervalValue ? Number(intervalValue) : null;
      const payload = {
        auto_sync_url: autoSyncUrl || null,
        auto_sync_interval_minutes: Number.isFinite(parsedInterval)
          ? parsedInterval
          : null,
        auto_sync_enabled: autoSyncUrl ? Boolean(enabledInput.checked) : false,
      };
      try {
        const updated = await updatePlaylistSettings(playlist.id, payload);
        const targetIndex = state.playlists.findIndex(
          (item) => item.id === updated.id
        );
        if (targetIndex >= 0) {
          state.playlists[targetIndex] = updated;
        }
        renderPlaylists();
        renderPlaylistDetail();
      } catch (error) {
        console.error(error);
      }
    });
  }
  if (runButton) {
    runButton.addEventListener("click", async () => {
      if (statusLabel) {
        statusLabel.textContent = "同期中...";
      }
      try {
        await syncPlaylistNow(playlist.id);
        await refreshLibrary();
      } catch (error) {
        if (statusLabel) {
          statusLabel.textContent = `同期に失敗しました: ${error.message}`;
        }
      }
    });
  }
  return card;
};

const renderPlaylistDetail = () => {
  if (!playlistDetailBody || !playlistDetailTitle || !playlistDetailDesc) {
    return;
  }
  playlistDetailBody.innerHTML = "";
  const selected = getSelectedPlaylistData();
  if (!selected) {
    playlistDetailTitle.textContent = "プレイリストを選択";
    playlistDetailDesc.textContent =
      "左側のリストから表示したいプレイリストを選択してください。";
    return;
  }
  playlistDetailTitle.textContent = selected.name;
  playlistDetailDesc.textContent = `収録曲数: ${selected.track_ids.length}`;
  if (selected.id !== "favorites") {
    playlistDetailBody.appendChild(buildPlaylistSyncCard(selected));
  }
  const visibleTrackIds = selected.track_ids.filter((trackId) => {
    const track = state.tracks.find((item) => item.id === trackId);
    if (!track) {
      return false;
    }
    const query = normalizeQuery(searchState.playlistTrackQuery);
    if (!query) {
      return true;
    }
    const target = `${track.title} ${track.artist} ${track.album}`.toLowerCase();
    return target.includes(query);
  });
  if (visibleTrackIds.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "該当する曲がありません。";
    playlistDetailBody.appendChild(empty);
    return;
  }
  const list = document.createElement("div");
  list.className = "playlist-track-list";
  list.innerHTML = `
    <div class="playlist-track-header">
      <span></span>
      <span></span>
      <span>アート</span>
      <span>タイトル</span>
      <span>アーティスト</span>
      <span>再生時間</span>
      <span></span>
    </div>
  `;
  visibleTrackIds.forEach((trackId) => {
    const track = state.tracks.find((item) => item.id === trackId);
    if (!track) {
      return;
    }
    list.appendChild(
      buildPlaylistTrackRow(track, selected.id === "favorites" ? "favorites" : "playlist")
    );
  });
  playlistDetailBody.appendChild(list);
  updateMediaPlayingIndicator();
};

const renderPlaylists = () => {
  playlistList.innerHTML = "";
  const title = document.createElement("h4");
  title.className = "playlist-section-title";
  title.textContent = "プレイリスト";
  playlistList.appendChild(title);
  const visiblePlaylists = filterPlaylists(state.playlists, searchState.playlistQuery);
  if (visiblePlaylists.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = searchState.playlistQuery
      ? "該当するプレイリストがありません。"
      : "項目が存在しません。";
    playlistList.appendChild(empty);
    return;
  }
  visiblePlaylists.forEach((playlist) => {
    const item = document.createElement("div");
    item.className = "playlist-item";
    if (
      state.selectedPlaylist?.type === "playlist" &&
      state.selectedPlaylist?.id === playlist.id
    ) {
      item.classList.add("is-active");
    }
    const mainButton = document.createElement("button");
    mainButton.type = "button";
    mainButton.className = "playlist-item-main";
    mainButton.innerHTML = `
      <span class="playlist-item-title">${playlist.name}</span>
      <span class="playlist-item-meta">収録曲数: ${playlist.track_ids.length}</span>
    `;
    mainButton.addEventListener("click", () => {
      setSelectedPlaylist("playlist", playlist.id);
    });
    const actions = document.createElement("div");
    actions.className = "playlist-item-actions";
    const renameButton = document.createElement("button");
    renameButton.type = "button";
    renameButton.className = "icon-button playlist-action playlist-rename";
    renameButton.setAttribute("aria-label", "プレイリスト名を変更");
    renameButton.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 16.5V20h3.5l10-10-3.5-3.5-10 10zM19.5 7l-2.5-2.5 1.5-1.5a1 1 0 0 1 1.4 0l1.1 1.1a1 1 0 0 1 0 1.4L19.5 7z"
        />
      </svg>
    `;
    renameButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      const nextName = window.prompt("新しいプレイリスト名を入力してください。", playlist.name);
      if (!nextName) {
        return;
      }
      const trimmedName = nextName.trim();
      if (!trimmedName || trimmedName === playlist.name) {
        return;
      }
      try {
        const updated = await updatePlaylistSettings(playlist.id, { name: trimmedName });
        const targetIndex = state.playlists.findIndex((item) => item.id === updated.id);
        if (targetIndex >= 0) {
          state.playlists[targetIndex] = updated;
        }
        renderPlaylists();
        renderPlaylistDetail();
      } catch (error) {
        console.error(error);
      }
    });
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "icon-button playlist-action playlist-delete";
    deleteButton.setAttribute("aria-label", "プレイリストを削除");
    deleteButton.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M7 6h10l-1 14H8L7 6zm9.5-3H7.5l-1 2H4v2h16V5h-2.5l-1-2z"
        />
      </svg>
    `;
    deleteButton.addEventListener("click", async (event) => {
      event.stopPropagation();
      const result = await showConfirmDialog({
        title: "プレイリストを削除",
        message: `プレイリスト「${playlist.name}」を削除しますか？`,
        showFileOption: false,
        buttons: [
          { label: "キャンセル", className: "secondary", value: "cancel" },
          { label: "削除する", className: "danger", value: "confirm" },
        ],
      });
      if (result.action !== "confirm") {
        return;
      }
      try {
        await deletePlaylist(playlist.id);
        state.playlists = state.playlists.filter((item) => item.id !== playlist.id);
        ensureSelectedPlaylist();
        renderPlaylists();
        renderPlaylistDetail();
        renderFavorites();
      } catch (error) {
        console.error(error);
      }
    });
    actions.appendChild(renameButton);
    actions.appendChild(deleteButton);
    item.appendChild(mainButton);
    item.appendChild(actions);
    playlistList.appendChild(item);
  });
};

const renderFavorites = () => {
  favorites.innerHTML = "";
  const title = document.createElement("h4");
  title.className = "playlist-section-title";
  title.textContent = "お気に入り";
  favorites.appendChild(title);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "playlist-item playlist-item-main-only";
  if (state.selectedPlaylist?.type === "favorites") {
    button.classList.add("is-active");
  }
  button.innerHTML = `
    <span class="playlist-item-title">お気に入り</span>
    <span class="playlist-item-meta">登録数: ${state.favorites.length}</span>
  `;
  button.addEventListener("click", () => {
    setSelectedPlaylist("favorites", "favorites");
  });
  favorites.appendChild(button);
};

const renderPlaylistModalList = () => {
  if (!playlistModalList) {
    return;
  }
  playlistModalList.innerHTML = "";
  if (!state.playlists.length) {
    const empty = document.createElement("p");
    empty.className = "player-menu-title";
    empty.textContent = "プレイリストがありません";
    playlistModalList.appendChild(empty);
    return;
  }
  const isBulkMode = selectionState.active && selectionState.selectedIds.size > 0;
  const track = state.tracks[playerState.currentIndex];
  state.playlists.forEach((playlist) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "modal-item";
    const alreadyAdded = !isBulkMode && track ? playlist.track_ids.includes(track.id) : false;
    button.disabled = !isBulkMode && (!track || alreadyAdded);
    button.innerHTML = `
      <strong>${playlist.name}</strong>
      <span>収録曲数: ${playlist.track_ids.length}</span>
      ${alreadyAdded ? "<span>追加済み</span>" : ""}
    `;
    button.addEventListener("click", async () => {
      if (isBulkMode) {
        const idsToAdd = [...selectionState.selectedIds].filter(
          (id) => !playlist.track_ids.includes(id)
        );
        if (idsToAdd.length) {
          const updatedTrackIds = [...playlist.track_ids, ...idsToAdd];
          try {
            await updatePlaylistTracks(playlist.id, updatedTrackIds);
            playlist.track_ids = updatedTrackIds;
            renderPlaylistDetail();
            renderPlaylists();
          } catch (error) {
            console.error(error);
          }
        }
        closePlaylistModal();
        exitSelectionMode();
      } else {
        addTrackToPlaylist(playlist.id);
        closePlaylistModal();
      }
    });
    playlistModalList.appendChild(button);
  });
};

const renderPlaylistSelectOptions = () => {
  const selects = [
    importPlaylistSelect,
    uploadPlaylistSelect,
    localFolderPlaylistSelect,
  ].filter(Boolean);
  selects.forEach((select) => {
    select.innerHTML = '<option value="">指定なし</option>';
    state.playlists.forEach((playlist) => {
      const option = document.createElement("option");
      option.value = playlist.id;
      option.textContent = playlist.name;
      select.appendChild(option);
    });
  });
};

const openTrackEditModal = (track) => {
  if (!track || !trackEditModal) {
    return;
  }
  if (trackEditTitle) {
    trackEditTitle.value = track.title || "";
  }
  if (trackEditArtist) {
    trackEditArtist.value = track.artist || "";
  }
  if (trackEditAlbum) {
    trackEditAlbum.value = track.album || "";
  }
  if (trackEditSourceUrl) {
    trackEditSourceUrl.value = track.source_url || "";
  }
  trackEditModal.classList.add("is-open");
  trackEditModal.setAttribute("aria-hidden", "false");
};

const closeTrackEditModal = () => {
  if (!trackEditModal) {
    return;
  }
  trackEditModal.classList.remove("is-open");
  trackEditModal.setAttribute("aria-hidden", "true");
};

const openPlaylistModal = () => {
  if (!playlistModal) {
    return;
  }
  renderPlaylistModalList();
  playlistModal.classList.add("is-open");
  playlistModal.setAttribute("aria-hidden", "false");
};

const closePlaylistModal = () => {
  if (!playlistModal) {
    return;
  }
  playlistModal.classList.remove("is-open");
  playlistModal.setAttribute("aria-hidden", "true");
};

const updatePlayerMenuButtons = () => {
  const track = state.tracks[playerState.currentIndex];
  if (playerOpenSource) {
    const hasSource = Boolean(track?.source_url);
    playerOpenSource.disabled = !hasSource;
  }
  if (playerAddPlaylist) {
    playerAddPlaylist.disabled = !track;
  }
  if (playerShareTrack) {
    playerShareTrack.disabled = !track;
  }
  if (playerDeleteTrack) {
    playerDeleteTrack.disabled = !track;
  }
};

const reorderTrackIds = (trackIds, draggedId, targetId) => {
  const fromIndex = trackIds.indexOf(draggedId);
  const toIndex = trackIds.indexOf(targetId);
  if (fromIndex < 0 || toIndex < 0) {
    return trackIds;
  }
  const updated = [...trackIds];
  updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, draggedId);
  return updated;
};

const updatePlaylistTracks = async (playlistId, trackIds) => {
  await requestJson(`/api/playlists/${playlistId}`, { track_ids: trackIds }, "PUT");
};

const deletePlaylist = async (playlistId) => {
  await requestJson(`/api/playlists/${playlistId}`, null, "DELETE");
};

const updatePlaylistSettings = async (playlistId, payload) => {
  return requestJson(`/api/playlists/${playlistId}`, payload, "PUT");
};

const syncPlaylistNow = async (playlistId) => {
  return requestJson(`/api/playlists/${playlistId}/sync`, null, "POST");
};

const updateFavoritesTracks = async (trackIds) => {
  await requestJson("/api/favorites", { track_ids: trackIds }, "PUT");
};

const updateTrackMetadata = async (trackId, payload) => {
  return requestJson(`/api/library/${trackId}`, payload, "PUT");
};

const deleteTrack = async (trackId, deleteFile = true) => {
  return requestJson(`/api/library/${trackId}?delete_file=${deleteFile}`, null, "DELETE");
};

const addTrackToPlaylist = async (playlistId) => {
  const track = state.tracks[playerState.currentIndex];
  if (!track) {
    return;
  }
  const playlist = state.playlists.find((item) => item.id === playlistId);
  if (!playlist) {
    return;
  }
  if (playlist.track_ids.includes(track.id)) {
    appendImportLog("この曲はすでにプレイリストに登録されています。", { append: true });
    return;
  }
  const updatedTrackIds = [...playlist.track_ids, track.id];
  try {
    await updatePlaylistTracks(playlistId, updatedTrackIds);
    playlist.track_ids = updatedTrackIds;
    renderPlaylistDetail();
    renderPlaylists();
    renderPlaylistModalList();
  } catch (error) {
    console.error(error);
  }
};

const reorderPlaylistTracks = async (listType, draggedId, targetId) => {
  const selected = getSelectedPlaylistData();
  if (!selected) {
    return;
  }
  const updatedTrackIds = reorderTrackIds(selected.track_ids, draggedId, targetId);
  if (updatedTrackIds === selected.track_ids) {
    return;
  }
  try {
    if (listType === "favorites") {
      state.favorites = updatedTrackIds;
      await updateFavoritesTracks(updatedTrackIds);
      updateFavoriteButtons();
    } else {
      const playlist = state.playlists.find((item) => item.id === selected.id);
      if (!playlist) {
        return;
      }
      playlist.track_ids = updatedTrackIds;
      await updatePlaylistTracks(playlist.id, updatedTrackIds);
    }
    renderPlaylistDetail();
    renderPlaylists();
    renderFavorites();
  } catch (error) {
    console.error(error);
  }
};

const removePlaylistTrack = async (listType, trackId) => {
  const selected = getSelectedPlaylistData();
  if (!selected) {
    return;
  }
  const updatedTrackIds = selected.track_ids.filter((id) => id !== trackId);
  try {
    if (listType === "favorites") {
      state.favorites = updatedTrackIds;
      await updateFavoritesTracks(updatedTrackIds);
      updateFavoriteButtons();
    } else {
      const playlist = state.playlists.find((item) => item.id === selected.id);
      if (!playlist) {
        return;
      }
      playlist.track_ids = updatedTrackIds;
      await updatePlaylistTracks(playlist.id, updatedTrackIds);
    }
    renderPlaylistDetail();
    renderPlaylists();
    renderFavorites();
  } catch (error) {
    console.error(error);
  }
};

const renderTagOptions = () => {
  if (!tagSelect) {
    return;
  }
  if (state.tracks.length === 0) {
    tagSelect.innerHTML = '<option value="">項目が存在しません。</option>';
    setTagFields(null);
    return;
  }
  tagSelect.innerHTML = state.tracks
    .map(
      (track) => `<option value="${track.id}">${track.title} / ${track.artist}</option>`
    )
    .join("");
  if (!tagSelect.value) {
    tagSelect.value = String(state.tracks[0].id);
  }
  const selectedTrack = state.tracks.find(
    (track) => String(track.id) === String(tagSelect.value)
  );
  setTagFields(selectedTrack);
};

const activateTab = (tabName) => {
  const targetTab = document.querySelector(`.nav-button[data-tab="${tabName}"]`);
  const targetPanel = document.getElementById(`panel-${tabName}`);
  if (!targetTab || !targetPanel) {
    return;
  }
  tabs.forEach((tab) => tab.classList.remove("is-active"));
  panels.forEach((panel) => panel.classList.remove("is-active"));
  targetTab.classList.add("is-active");
  targetPanel.classList.add("is-active");
};

const getConfiguredBaseUrl = () => {
  const value = settingsBaseUrlInput?.value?.trim() || "";
  return value.replace(/\/$/, "");
};

const buildShareUrl = (track) => {
  if (!track?.id) {
    return null;
  }
  const configuredBaseUrl = getConfiguredBaseUrl();
  const fallbackBaseUrl = window.location.origin;
  const rootUrl = configuredBaseUrl || fallbackBaseUrl;
  return `${rootUrl}/share/${encodeURIComponent(track.id)}`;
};

const renderSettings = (settings) => {
  if (settingsVersionList) {
    const version = settings?.version || {};
    settingsVersionList.innerHTML = `
      <li class="settings-version-item">
        <img class="settings-version-logo" src="/static/images/logo.png" alt="SquashTerm logo" />
        <div class="settings-version-values">
          <div class="settings-version-row">
            <span class="settings-version-label">バージョン</span>
            <strong>${version.app || "--"}</strong>
          </div>
          <div class="settings-version-row">
            <span class="settings-version-label">API</span>
            <strong>${version.api || "--"}</strong>
          </div>
          <div class="settings-version-row">
            <span class="settings-version-label">ビルド日時</span>
            <strong>${version.build || "--"}</strong>
          </div>
        </div>
      </li>
    `;
  }
  if (settingsBaseUrlInput) {
    settingsBaseUrlInput.value = settings?.app?.base_url || "";
  }
  if (settingsPlaybackOptions) {
    const options = settings?.playback_options || [];
    settingsPlaybackOptions.innerHTML = "";
    if (options.length === 0) {
      settingsPlaybackOptions.innerHTML = '<p class="empty-state">項目が存在しません。</p>';
    } else {
      options.forEach((option) => {
        const label = document.createElement("label");
        label.className = "checkbox";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = Boolean(option.enabled);
        input.dataset.optionId = option.id;
        input.addEventListener("change", async (e) => {
          try {
            await fetch("/api/settings/playback-options", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                option_id: option.id,
                enabled: e.target.checked,
              }),
            });
          } catch (err) {
            console.error("設定保存エラー:", err);
            e.target.checked = !e.target.checked;
          }
        });
        const span = document.createElement("span");
        span.textContent = option.label || option.id || "--";
        label.appendChild(input);
        label.appendChild(span);
        settingsPlaybackOptions.appendChild(label);
      });
    }
  }
};

const renderSystem = (system) => {
  if (!system) {
    return;
  }
  if (settingsStorageBar && settingsStorageText) {
    const storage = system.storage || {};
    const used = Number(storage.used_gb ?? 0);
    const total = Number(storage.total_gb ?? 0);
    const free = Number(storage.free_gb ?? 0);
    const percent = Math.max(0, Math.min(100, Number(storage.percent ?? 0)));
    settingsStorageBar.style.width = `${percent}%`;
    settingsStorageText.textContent = `使用中: ${used.toFixed(
      1
    )}GB / ${total.toFixed(1)}GB（空き ${free.toFixed(1)}GB）`;
  }
  if (systemInfoList) {
    const os = system.os || "--";
    const hostname = system.hostname || "--";
    systemInfoList.innerHTML = [
      `<li>ホスト名: <strong>${hostname}</strong></li>`,
      `<li>OS: <strong>${os}</strong></li>`,
    ].join("");
  }
};

const updateMediaSessionMetadata = (track) => {
  if (!supportsMediaSession || !track) {
    return;
  }
  const artwork = track.cover
    ? [
        {
          src: track.cover,
          sizes: "512x512",
          type: "image/png",
        },
      ]
    : [];
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title || "",
    artist: track.artist || "",
    album: track.album || "",
    artwork,
  });
};

const updateMediaSessionPlaybackState = () => {
  if (!supportsMediaSession || !audioPlayer) {
    return;
  }
  navigator.mediaSession.playbackState = audioPlayer.paused ? "paused" : "playing";
};

const updateMediaSessionPosition = () => {
  if (!supportsMediaSession || !audioPlayer || !audioPlayer.duration) {
    return;
  }
  if (typeof navigator.mediaSession.setPositionState === "function") {
    navigator.mediaSession.setPositionState({
      duration: audioPlayer.duration,
      playbackRate: audioPlayer.playbackRate,
      position: audioPlayer.currentTime,
    });
  }
};

const ensureSelectedPlaylist = () => {
  if (!state.selectedPlaylist) {
    state.selectedPlaylist = { type: "favorites", id: "favorites" };
    return;
  }
  if (
    state.selectedPlaylist.type === "playlist" &&
    !state.playlists.find((playlist) => playlist.id === state.selectedPlaylist.id)
  ) {
    state.selectedPlaylist = { type: "favorites", id: "favorites" };
  }
};

const fetchJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
};

const requestJson = async (path, payload, method) => {
  const response = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to ${method} ${path}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

const refreshLibrary = async () => {
  const [tracks, playlists, favoritesData] = await Promise.all([
    fetchJson("/api/library"),
    fetchJson("/api/playlists"),
    fetchJson("/api/favorites"),
  ]);
  state.tracks = tracks;
  state.playlists = playlists;
  state.favorites = favoritesData;
  ensureSelectedPlaylist();
  renderMedia();
  updateMediaViewToggle();
  renderPlaylists();
  renderFavorites();
  renderPlaylistDetail();
  renderTagOptions();
  renderPlaylistSelectOptions();
  updatePlayerUI();
  updateFavoriteButtons();
  renderPlaylistModalList();
};

const appendImportLog = (message, options = {}) => {
  if (!importLog) {
    return;
  }
  const { append, reset } = options;
  const maxLength = 3000;
  if (reset) {
    importLog.textContent = "";
  }
  const currentText = append ? `${importLog.textContent}\n${message}` : message;
  if (currentText.length > maxLength) {
    importLog.textContent = currentText.slice(-maxLength);
    return;
  }
  importLog.textContent = currentText.trimStart();
};

const appendUploadLog = (message, options = {}) => {
  if (!uploadLog) {
    return;
  }
  const { append, reset } = options;
  const maxLength = 3000;
  if (reset) {
    uploadLog.textContent = "";
  }
  const currentText = append ? `${uploadLog.textContent}\n${message}` : message;
  if (currentText.length > maxLength) {
    uploadLog.textContent = currentText.slice(-maxLength);
    return;
  }
  uploadLog.textContent = currentText.trimStart();
};

const appendLocalFolderLog = (message, options = {}) => {
  if (!localFolderLog) {
    return;
  }
  const { append, reset } = options;
  const maxLength = 3000;
  if (reset) {
    localFolderLog.textContent = "";
  }
  const currentText = append ? `${localFolderLog.textContent}\n${message}` : message;
  if (currentText.length > maxLength) {
    localFolderLog.textContent = currentText.slice(-maxLength);
    return;
  }
  localFolderLog.textContent = currentText.trimStart();
};

const updateImportProgress = (percent, message) => {
  if (!importProgressBar || !importProgressText) {
    return;
  }
  const clamped = Math.max(0, Math.min(100, Math.floor(percent)));
  importProgressBar.style.width = `${clamped}%`;
  importProgressText.textContent = message
    ? `進行状況: ${clamped}% (${message})`
    : `進行状況: ${clamped}%`;
};

const streamImport = async (payload) => {
  const response = await fetch("/api/library/import/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "ストリームの開始に失敗しました。");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() || "";
    chunks.forEach((chunk) => {
      const line = chunk
        .split("\n")
        .find((entry) => entry.startsWith("data: "));
      if (!line) {
        return;
      }
      const data = line.replace("data: ", "").trim();
      if (!data) {
        return;
      }
      try {
        const event = JSON.parse(data);
        if (event.type === "log") {
          appendImportLog(event.message, { append: true });
        }
        if (event.type === "progress") {
          updateImportProgress(event.value, event.message);
        }
        if (event.type === "error") {
          updateImportProgress(0, "エラー");
          appendImportLog(`エラー: ${event.message}`, { append: true });
        }
        if (event.type === "complete") {
          updateImportProgress(100, "完了");
          appendImportLog("取り込み完了。", { append: true });
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
};

const streamPlaylistBatchImport = async (payload) => {
  const response = await fetch("/api/library/import/playlist-batch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "プレイリストダウンロードの開始に失敗しました。");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() || "";
    chunks.forEach((chunk) => {
      const line = chunk
        .split("\n")
        .find((entry) => entry.startsWith("data: "));
      if (!line) {
        return;
      }
      const data = line.replace("data: ", "").trim();
      if (!data) {
        return;
      }
      try {
        const event = JSON.parse(data);
        if (event.type === "log") {
          appendImportLog(event.message, { append: true });
        }
        if (event.type === "progress") {
          const total = event.total || 1;
          const completed = event.completed || 0;
          const failed = event.failed || 0;
          const percentage = Math.floor((completed + failed) / total * 100);
          updateImportProgress(percentage, `${completed}/${total} 完了 (失敗: ${failed})`);
          appendImportLog(`進行中: ${event.message || ''}`, { append: true });
        }
        if (event.type === "error") {
          updateImportProgress(0, "エラー");
          appendImportLog(`エラー: ${event.message}`, { append: true });
        }
        if (event.type === "complete") {
          const total = event.total || 0;
          const completed = event.completed || 0;
          const failed = event.failed || 0;
          updateImportProgress(100, "完了");
          appendImportLog(`完了: ${completed}件成功, ${failed}件失敗`, { append: true });
        }
      } catch (error) {
        console.error(error);
      }
    });
  }
};

const handleImportSubmit = async () => {
  const url = importUrl?.value?.trim();
  if (!url) {
    appendImportLog("URL を入力してください。");
    return;
  }
  
  // 並列度設定を取得（デフォルト10）
  const concurrency = parseInt(localStorage.getItem("playlistConcurrency") || "10", 10);
  
  // バッチダウンロードAPI（自動判定含む）
  const payload = {
    url,
    concurrency,
  };
  payload.auto_tag = Boolean(importAutoTag?.checked);
  const playlistId = importPlaylistSelect?.value?.trim();
  if (playlistId) {
    payload.playlist_id = playlistId;
  }
  appendImportLog("ダウンロードを開始中...", { reset: true });
  updateImportProgress(0, "開始");
  try {
    await streamPlaylistBatchImport(payload);
    await refreshLibrary();
    importUrl.value = "";
  } catch (error) {
    appendImportLog(`エラー: ${error.message}`, { append: true });
    updateImportProgress(0, "失敗");
  }
};

const handleUploadSubmit = async () => {
  if (!uploadAudioInput || !uploadAudioInput.files?.length) {
    appendUploadLog("音声ファイルを選択してください。");
    return;
  }
  const formData = new FormData();
  formData.append("file", uploadAudioInput.files[0]);
  if (uploadCoverInput?.files?.length) {
    formData.append("cover", uploadCoverInput.files[0]);
  }
  if (uploadTitleInput?.value) {
    formData.append("title", uploadTitleInput.value.trim());
  }
  if (uploadArtistInput?.value) {
    formData.append("artist", uploadArtistInput.value.trim());
  }
  if (uploadAlbumInput?.value) {
    formData.append("album", uploadAlbumInput.value.trim());
  }
  if (uploadGenreInput?.value) {
    formData.append("genre", uploadGenreInput.value.trim());
  }
  if (uploadYearInput?.value) {
    formData.append("year", uploadYearInput.value.trim());
  }
  if (uploadSourceUrlInput?.value) {
    formData.append("source_url", uploadSourceUrlInput.value.trim());
  }
  if (uploadAutoTag) {
    formData.append("auto_tag", uploadAutoTag.checked ? "true" : "false");
  }
  const playlistId = uploadPlaylistSelect?.value?.trim();
  if (playlistId) {
    formData.append("playlist_id", playlistId);
  }
  appendUploadLog("アップロード中...", { reset: true });
  try {
    const response = await fetch("/api/library/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "アップロードに失敗しました。");
    }
    await response.json();
    appendUploadLog("アップロード完了。", { append: true });
    if (uploadForm) {
      uploadForm.reset();
    }
    await refreshLibrary();
  } catch (error) {
    appendUploadLog(`エラー: ${error.message}`, { append: true });
  }
};

const handleLocalFolderSubmit = async () => {
  if (!localFolderPathInput) {
    return;
  }
  const path = localFolderPathInput.value.trim();
  if (!path) {
    appendLocalFolderLog("フォルダパスを入力してください。");
    return;
  }
  const payload = {
    path,
    auto_tag: Boolean(localFolderAutoTag?.checked),
  };
  const playlistId = localFolderPlaylistSelect?.value?.trim();
  if (playlistId) {
    payload.playlist_id = playlistId;
  }
  appendLocalFolderLog("フォルダを取り込み中...", { reset: true });
  try {
    const result = await requestJson("/api/library/import/local-folder", payload, "POST");
    const addedCount = result?.added ?? 0;
    appendLocalFolderLog(`取り込み完了: ${addedCount}件追加`, { append: true });
    await refreshLibrary();
  } catch (error) {
    appendLocalFolderLog(`エラー: ${error.message}`, { append: true });
  }
};

const handlePlaylistCreate = async () => {
  if (!playlistNameInput) {
    return;
  }
  const name = playlistNameInput.value.trim();
  if (!name) {
    return;
  }
  try {
    const playlist = await requestJson(
      "/api/playlists",
      { name, track_ids: [] },
      "POST"
    );
    state.playlists.push(playlist);
    playlistNameInput.value = "";
    if (playlistCreateForm) {
      playlistCreateForm.classList.remove("is-open");
      playlistCreateForm.setAttribute("aria-hidden", "true");
    }
    setSelectedPlaylist("playlist", playlist.id);
    renderPlaylistSelectOptions();
    renderPlaylistModalList();
  } catch (error) {
    console.error(error);
  }
};

const init = async () => {
  try {
    const [tracks, playlists, favoritesData, status, settings, system] =
      await Promise.all([
        fetchJson("/api/library"),
        fetchJson("/api/playlists"),
        fetchJson("/api/favorites"),
        fetchJson("/api/status"),
        fetchJson("/api/settings"),
        fetchJson("/api/system"),
      ]);

    state.tracks = tracks;
    state.playlists = playlists;
    state.favorites = favoritesData;
    ensureSelectedPlaylist();

    renderMedia();
    updateMediaViewToggle();
    renderPlaylists();
    renderFavorites();
    renderPlaylistDetail();
    renderTagOptions();
    renderPlaylistSelectOptions();
    updatePlayerUI();
    updateFavoriteButtons();
    renderPlaylistModalList();
    if (tracks.length === 0) {
      updatePlayerUI();
    }

    if (statusVersion) {
      statusVersion.textContent = status.version;
    }
    if (statusDevice) {
      statusDevice.textContent = status.device;
    }
    if (statusTime) {
      statusTime.textContent = status.time;
    }
    renderSettings(settings);
    renderSystem(system);

    const query = new URLSearchParams(window.location.search);
    const sharedTrackId = query.get("id");
    if (sharedTrackId) {
      const sharedTrackIndex = state.tracks.findIndex((track) => String(track.id) === String(sharedTrackId));
      if (sharedTrackIndex >= 0) {
        setTrackByIndex(sharedTrackIndex, false);
        openPlayerOverlay();
      }
    }
    
    const savedLoopMode = localStorage.getItem("loopMode");
    if (savedLoopMode && ["off", "playlist", "track"].includes(savedLoopMode)) {
      playerState.loopMode = savedLoopMode;
      updateLoopButtons();
    }
    
    const savedShuffleMode = localStorage.getItem("shuffleMode");
    if (savedShuffleMode === "true") {
      playerState.shuffleMode = true;
      if (state.tracks.length > 0) {
        playerState.shuffleIndices = generateShuffleIndices();
      }
      updateShuffleButtons();
    }
    
    const savedTrackIndex = localStorage.getItem("currentTrackIndex");
    const savedTrackTime = localStorage.getItem("currentTrackTime");
    if (savedTrackIndex !== null && state.tracks.length > 0) {
      const trackIndex = parseInt(savedTrackIndex, 10);
      if (trackIndex >= 0 && trackIndex < state.tracks.length) {
        setTrackByIndex(trackIndex, false);
        if (savedTrackTime !== null && audioPlayer) {
          const seekTime = parseFloat(savedTrackTime);
          audioPlayer.addEventListener("loadedmetadata", () => {
            if (audioPlayer.duration >= seekTime) {
              audioPlayer.currentTime = seekTime;
            }
          }, { once: true });
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
};

if (importSubmit) {
  importSubmit.addEventListener("click", () => {
    handleImportSubmit();
  });
}

if (importForm) {
  importForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleImportSubmit();
  });
}

if (playlistConcurrencyInput) {
  // 初期値をlocalStorageから読み込み
  const savedConcurrency = localStorage.getItem("playlistConcurrency");
  if (savedConcurrency) {
    playlistConcurrencyInput.value = savedConcurrency;
  }
  
  // 変更時にlocalStorageに保存
  playlistConcurrencyInput.addEventListener("change", () => {
    const value = parseInt(playlistConcurrencyInput.value, 10);
    if (value >= 1 && value <= 20) {
      localStorage.setItem("playlistConcurrency", value.toString());
    }
  });
}

if (settingsBaseUrlSave) {
  settingsBaseUrlSave.addEventListener("click", async () => {
    const baseUrl = settingsBaseUrlInput?.value?.trim() || "";
    try {
      await requestJson("/api/settings/base-url", { base_url: baseUrl }, "PUT");
      appendImportLog("ベースURLを保存しました。", { append: true });
    } catch (error) {
      appendImportLog(`ベースURLの保存に失敗しました: ${error.message}`, { append: true });
    }
  });
}

if (playlistCreateToggle && playlistCreateForm) {
  playlistCreateToggle.addEventListener("click", () => {
    const isOpen = playlistCreateForm.classList.toggle("is-open");
    playlistCreateForm.setAttribute("aria-hidden", isOpen ? "false" : "true");
  });
}

if (playlistCreateForm) {
  playlistCreateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handlePlaylistCreate();
  });
}

if (mediaSearchInput) {
  mediaSearchInput.addEventListener("input", (event) => {
    searchState.mediaQuery = event.target.value;
    renderMedia();
  });
}

if (playlistSearchInput) {
  playlistSearchInput.addEventListener("input", (event) => {
    searchState.playlistQuery = event.target.value;
    renderPlaylists();
  });
}

if (playlistTrackSearchInput) {
  playlistTrackSearchInput.addEventListener("input", (event) => {
    searchState.playlistTrackQuery = event.target.value;
    renderPlaylistDetail();
  });
}

if (tagSelect) {
  tagSelect.addEventListener("change", () => {
    const selectedTrack = state.tracks.find(
      (track) => String(track.id) === String(tagSelect.value)
    );
    setTagFields(selectedTrack);
  });
}

if (uploadForm) {
  uploadForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleUploadSubmit();
  });
}

if (localFolderForm) {
  localFolderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleLocalFolderSubmit();
  });
}

if (tagSave) {
  tagSave.addEventListener("click", async () => {
    if (!tagSelect) {
      return;
    }
    const track = state.tracks.find(
      (item) => String(item.id) === String(tagSelect.value)
    );
    if (!track) {
      return;
    }
    const payload = {
      title: tagTitleInput?.value?.trim() ?? "",
      artist: tagArtistInput?.value?.trim() ?? "",
      album: tagAlbumInput?.value?.trim() ?? "",
      source_url: tagSourceUrlInput?.value?.trim() ?? "",
    };
    try {
      const updated = await updateTrackMetadata(track.id, payload);
      const targetIndex = state.tracks.findIndex((item) => item.id === track.id);
      if (targetIndex >= 0) {
        state.tracks[targetIndex] = updated;
      }
      renderMedia();
      renderPlaylistDetail();
      renderTagOptions();
      updatePlayerUI();
      updateFavoriteButtons();
    } catch (error) {
      console.error(error);
    }
  });
}

if (mediaViewToggle) {
  mediaViewToggle.addEventListener("click", () => {
    mediaViewState.mode = mediaViewState.mode === "list" ? "grid" : "list";
    updateMediaViewToggle();
    renderMedia();
  });
}

const updateBulkBar = () => {
  const count = selectionState.selectedIds.size;
  if (bulkSelectedCount) {
    bulkSelectedCount.textContent = `${count}件選択中`;
  }
  if (bulkActionBar) {
    bulkActionBar.setAttribute("aria-hidden", selectionState.active ? "false" : "true");
  }
};

const enterSelectionMode = () => {
  selectionState.active = true;
  selectionState.selectedIds.clear();
  if (mediaSelectToggle) mediaSelectToggle.classList.add("is-active");
  updateBulkBar();
  renderMedia();
};

const exitSelectionMode = () => {
  selectionState.active = false;
  selectionState.selectedIds.clear();
  if (mediaSelectToggle) mediaSelectToggle.classList.remove("is-active");
  if (bulkActionBar) bulkActionBar.setAttribute("aria-hidden", "true");
  renderMedia();
};

if (mediaSelectToggle) {
  mediaSelectToggle.addEventListener("click", () => {
    if (selectionState.active) {
      exitSelectionMode();
    } else {
      enterSelectionMode();
    }
  });
}

if (bulkSelectCancel) {
  bulkSelectCancel.addEventListener("click", () => exitSelectionMode());
}

if (bulkAddFavorite) {
  bulkAddFavorite.addEventListener("click", async () => {
    if (!selectionState.selectedIds.size) return;
    const newFavorites = [...state.favorites];
    selectionState.selectedIds.forEach((id) => {
      if (!newFavorites.includes(id)) newFavorites.push(id);
    });
    try {
      await updateFavoritesTracks(newFavorites);
      state.favorites = newFavorites;
      renderFavorites();
      updateFavoriteButtons();
      exitSelectionMode();
    } catch (error) {
      console.error(error);
    }
  });
}

if (bulkAddPlaylist) {
  bulkAddPlaylist.addEventListener("click", () => {
    if (!selectionState.selectedIds.size) return;
    if (playlistModal) {
      playlistModal.classList.add("is-open");
      playlistModal.setAttribute("aria-hidden", "false");
      renderPlaylistModalList();
    }
  });
}

if (bulkDeleteBtn) {
  bulkDeleteBtn.addEventListener("click", async () => {
    const ids = [...selectionState.selectedIds];
    if (!ids.length) return;
    const result = await showConfirmDialog({
      title: "楽曲を削除",
      message: `選択した${ids.length}件の楽曲を削除しますか？`,
      showFileOption: true,
      buttons: [
        { label: "キャンセル", className: "secondary", value: "cancel" },
        { label: "削除する", className: "danger", value: "confirm" },
      ],
    });
    if (result.action !== "confirm") return;
    try {
      for (const id of ids) {
        await deleteTrack(id, result.deleteFile);
      }
      exitSelectionMode();
      await refreshLibrary();
    } catch (error) {
      console.error(error);
      appendImportLog("削除中にエラーが発生しました。", { append: true });
    }
  });
}

if (audioPlayer) {
  audioPlayer.addEventListener("play", () => {
    playerState.isPlaying = true;
    updatePlayerButtons();
    updateMediaSessionPlaybackState();
    syncMobilePlayerButtons();
  });

  audioPlayer.addEventListener("pause", () => {
    playerState.isPlaying = false;
    updatePlayerButtons();
    updateMediaSessionPlaybackState();
    syncMobilePlayerButtons();
  });

  audioPlayer.addEventListener("timeupdate", () => {
    const { currentTime, duration } = audioPlayer;
    const percent = duration ? Math.floor((currentTime / duration) * 100) : 0;
    const pctStr = percent + "%";
    if (playerSeek) {
      playerSeek.value = percent;
      playerSeek.style.setProperty("--seek-pct", pctStr);
    }
    if (miniSeek) {
      miniSeek.value = percent;
      miniSeek.style.setProperty("--seek-pct", pctStr);
    }
    if (playerCurrent) {
      playerCurrent.textContent = formatTime(currentTime);
    }
    if (playerDuration) {
      playerDuration.textContent = formatTime(duration);
    }
    if (miniCurrent) {
      miniCurrent.textContent = formatTime(currentTime);
    }
    if (miniDuration) {
      miniDuration.textContent = formatTime(duration);
    }
    updateMediaSessionPosition();
    
    if (playerState.currentIndex >= 0 && currentTime > 0) {
      localStorage.setItem("currentTrackIndex", playerState.currentIndex);
      localStorage.setItem("currentTrackTime", currentTime);
    }
  });

  audioPlayer.addEventListener("ended", () => {
    if (playerState.loopMode === "track") {
      audioPlayer.currentTime = 0;
      audioPlayer.play();
      return;
    }
    if (playerState.shuffleMode) {
      playNext();
      return;
    }
    if (playerState.loopMode === "playlist") {
      playNext();
      return;
    }
    if (isPlayerOverlayActive()) {
      closePlayerOverlay();
    }
    stopPlayback();
  });
}

if (playerSeek && audioPlayer) {
  playerSeek.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    if (Number.isFinite(value) && audioPlayer.duration) {
      audioPlayer.currentTime = (value / 100) * audioPlayer.duration;
    }
  });
}

if (miniSeek && audioPlayer) {
  miniSeek.addEventListener("input", (event) => {
    const value = Number(event.target.value);
    if (Number.isFinite(value) && audioPlayer.duration) {
      audioPlayer.currentTime = Math.round((value / 100) * audioPlayer.duration);
    }
  });
}

if (playerToggle) {
  playerToggle.addEventListener("click", () => {
    togglePlayback();
  });
}

if (miniToggle) {
  miniToggle.addEventListener("click", () => {
    togglePlayback();
  });
}

if (playerPrev) {
  playerPrev.addEventListener("click", () => {
    playPrev();
  });
}

if (playerSkipBack) {
  playerSkipBack.addEventListener("click", () => {
    seekBySeconds(-10);
  });
}

if (playerNext) {
  playerNext.addEventListener("click", () => {
    playNext();
  });
}

if (playerSkipForward) {
  playerSkipForward.addEventListener("click", () => {
    seekBySeconds(10);
  });
}

if (playerStop) {
  playerStop.addEventListener("click", () => {
    stopPlayback();
  });
}

if (playerLoop) {
  playerLoop.addEventListener("click", () => {
    toggleLoopMode();
  });
}

if (playerShuffle) {
  playerShuffle.addEventListener("click", () => {
    toggleShuffleMode();
  });
}

if (playerFavorite) {
  playerFavorite.addEventListener("click", () => {
    toggleFavorite();
  });
}

if (miniFavorite) {
  miniFavorite.addEventListener("click", () => {
    toggleFavorite();
  });
}

if (miniPrev) {
  miniPrev.addEventListener("click", () => {
    playPrev();
  });
}

if (miniSkipBack) {
  miniSkipBack.addEventListener("click", () => {
    seekBySeconds(-10);
  });
}

if (miniNext) {
  miniNext.addEventListener("click", () => {
    playNext();
  });
}

if (miniSkipForward) {
  miniSkipForward.addEventListener("click", () => {
    seekBySeconds(10);
  });
}

if (miniStop) {
  miniStop.addEventListener("click", () => {
    stopPlayback();
  });
}

if (miniLoop) {
  miniLoop.addEventListener("click", () => {
    toggleLoopMode();
  });
}

if (miniShuffle) {
  miniShuffle.addEventListener("click", () => {
    toggleShuffleMode();
  });
}

if (miniExpand) {
  miniExpand.addEventListener("click", () => {
    openPlayerOverlay();
  });
}

// Nav player button: opens fullscreen player (mobile)
if (navPlayerButton) {
  navPlayerButton.addEventListener("click", () => {
    if (isMobileDevice()) {
      openMobilePlayer();
    } else {
      openPlayerOverlay();
    }
  });
}

// モバイル判定関数
function isMobileDevice() {
  return window.innerWidth <= 768;
}

// モバイルプレイヤー要素
const mobilePlayerOverlay = document.getElementById("mobile-player-overlay");
const mobilePlayerBg = document.getElementById("mobile-player-bg");
const mobilePlayerClose = document.getElementById("mobile-player-close");
const mobilePlayerCover = document.getElementById("mobile-player-cover");
const mobilePlayerTitle = document.getElementById("mobile-player-title");
const mobilePlayerArtist = document.getElementById("mobile-player-artist");
const mobilePlayerAlbum = document.getElementById("mobile-player-album");
const mobilePlayerFormat = document.getElementById("mobile-player-format");
const mobilePlayerProgressSlider = document.getElementById("mobile-player-progress-slider");
const mobilePlayerCurrentTime = document.getElementById("mobile-player-current-time");
const mobilePlayerDuration = document.getElementById("mobile-player-duration");
const mobilePlayerVolumeToggle = document.getElementById("mobile-player-volume-toggle");
const mobilePlayerVolumeSlider = document.getElementById("mobile-player-volume-slider");
const mobilePlayerToggle = document.getElementById("mobile-player-toggle");
const mobilePlayerPrev = document.getElementById("mobile-player-prev");
const mobilePlayerNext = document.getElementById("mobile-player-next");
const mobilePlayerShuffle      = document.getElementById("mobile-player-shuffle");
const mobilePlayerLoop         = document.getElementById("mobile-player-loop");
const mobilePlayerMenuToggle   = document.getElementById("mobile-player-menu-toggle");
const mobilePlayerFavorite = document.getElementById("mobile-player-favorite");

// 現在のタブを保存する変数（ファイル冒頭で宣言済み）

// モバイルプレイヤーを開く
function openMobilePlayer() {
  if (mobilePlayerOverlay) {
    // 現在アクティブなタブを保存（data-tab属性があるもののみ）
    previousActiveTab = null; // リセット
    tabs.forEach((tab) => {
      if (tab.classList.contains("is-active") && tab.dataset && tab.dataset.tab) {
        previousActiveTab = tab.dataset.tab;
      }
    });
    
    // デフォルトがない場合はmediaをデフォルトに
    if (!previousActiveTab) {
      previousActiveTab = "media";
    }
    
    mobilePlayerOverlay.setAttribute("aria-hidden", "false");
    updateMobilePlayerUI();
  }
}

// モバイルプレイヤーを閉じる
function closeMobilePlayer() {
  if (mobilePlayerOverlay) {
    mobilePlayerOverlay.setAttribute("aria-hidden", "true");
    closeMobilePlayerMenu();
    
    // 以前のタブに戻す
    if (previousActiveTab) {
      tabs.forEach((button) => button.classList.remove("is-active"));
      panels.forEach((panel) => panel.classList.remove("is-active"));
      
      const targetTab = document.querySelector(`.nav-button[data-tab="${previousActiveTab}"]`);
      const targetPanel = document.getElementById(`panel-${previousActiveTab}`);
      
      if (targetTab) {
        targetTab.classList.add("is-active");
      }
      if (targetPanel) {
        targetPanel.classList.add("is-active");
      }
      
      previousActiveTab = null;
    }
  }
}

// モバイルプレイヤーUIを更新
function updateMobilePlayerUI() {
  // デスクトップ版のプレイヤーから情報を同期
  if (playerCover && playerCover.src) {
    mobilePlayerCover.src = playerCover.src;
    if (mobilePlayerBg) {
      mobilePlayerBg.style.backgroundImage = `url('${playerCover.src.replace(/'/g, "\\'")}')`;
    }
  }

  // テキストをspan.scroll-textでラップしてセット（XSS対策でtextContent使用）
  const setScrollText = (container, text) => {
    if (!container || !text) return;
    container.innerHTML = "";
    const span = document.createElement("span");
    span.className = "scroll-text";
    span.textContent = text;
    container.appendChild(span);
  };
  setScrollText(mobilePlayerTitle, playerTitle?.textContent);
  setScrollText(mobilePlayerArtist, playerArtist?.textContent);
  setScrollText(mobilePlayerAlbum, playerAlbum?.textContent);

  if (mobilePlayerFormat && playerFormat && playerFormat.textContent) {
    mobilePlayerFormat.textContent = playerFormat.textContent;
  }

  // はみ出しているspan.scroll-textにシームレスマーキーを適用
  const MOBILE_GAP_PX = 64;
  const MOBILE_SPEED_PX_S = 50; // media-cardより少し遅め
  requestAnimationFrame(() => {
    [mobilePlayerTitle, mobilePlayerArtist, mobilePlayerAlbum].forEach((el) => {
      if (!el) return;
      const span = el.querySelector(".scroll-text");
      if (!span) return;
      span.classList.remove("is-overflowing");
      span.style.removeProperty("--overflow-width");
      span.style.removeProperty("--scroll-duration");
      el.style.removeProperty("text-align");

      const singleWidth = span.scrollWidth;
      if (singleWidth <= el.clientWidth) return;

      // シームレスループ構造: テキスト [空白] テキスト
      const originalText = span.textContent;
      span.textContent = "";
      span.appendChild(document.createTextNode(originalText));
      const gap = document.createElement("span");
      gap.style.cssText = `display:inline-block;width:${MOBILE_GAP_PX}px`;
      span.appendChild(gap);
      span.appendChild(document.createTextNode(originalText));

      const totalDist = singleWidth + MOBILE_GAP_PX;
      el.style.textAlign = "left";
      span.style.setProperty("--overflow-width", `-${totalDist}px`);
      span.style.setProperty("--scroll-duration", `${(totalDist / MOBILE_SPEED_PX_S).toFixed(1)}s`);
      span.classList.add("is-overflowing");
    });
  });
  
  // プログレスバーと時間を同期
  if (audioPlayer) {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
    mobilePlayerProgressSlider.value = progress;
    mobilePlayerProgressSlider.style.setProperty("--seek-pct", progress.toFixed(1) + "%");
    mobilePlayerCurrentTime.textContent = formatTime(audioPlayer.currentTime);
    mobilePlayerDuration.textContent = formatTime(audioPlayer.duration);
  }
  
  // 音量スライダーを同期
  if (mobilePlayerVolumeSlider) {
    mobilePlayerVolumeSlider.value = audioPlayer.volume * 100;
  }
  
  // ボタン状態を同期
  syncMobilePlayerButtons();
}

// モバイルプレイヤーボタン状態を同期
function syncMobilePlayerButtons() {
  // 再生/一時停止ボタン
  if (mobilePlayerToggle) {
    if (audioPlayer.paused) {
      mobilePlayerToggle.classList.remove("is-playing");
      mobilePlayerToggle.setAttribute("aria-label", "再生");
    } else {
      mobilePlayerToggle.classList.add("is-playing");
      mobilePlayerToggle.setAttribute("aria-label", "一時停止");
    }
  }
  
  // シャッフルボタン
  if (mobilePlayerShuffle && playerShuffle) {
    const isShuffleOn = playerShuffle.getAttribute("aria-pressed") === "true";
    mobilePlayerShuffle.setAttribute("aria-pressed", isShuffleOn ? "true" : "false");
    if (isShuffleOn) {
      mobilePlayerShuffle.classList.add("is-active");
    } else {
      mobilePlayerShuffle.classList.remove("is-active");
    }
  }
  
  // ループボタン
  if (mobilePlayerLoop && playerLoop) {
    const loopMode = playerLoop.getAttribute("aria-label");
    mobilePlayerLoop.setAttribute("aria-label", loopMode);
    const loopLabel = mobilePlayerLoop.querySelector(".loop-label");
    if (loopLabel) {
      loopLabel.textContent = loopMode.includes("オフ") ? "OFF" : loopMode.includes("1曲") ? "1" : "ALL";
    }
    // ループがオフの場合は色なし、PL/1の場合は色あり
    if (loopMode.includes("オフ")) {
      mobilePlayerLoop.classList.remove("is-active");
    } else {
      mobilePlayerLoop.classList.add("is-active");
    }
  }
  
  // お気に入りボタン
  if (mobilePlayerFavorite && playerFavorite) {
    const isFavorite = playerFavorite.getAttribute("aria-pressed") === "true";
    mobilePlayerFavorite.setAttribute("aria-pressed", isFavorite ? "true" : "false");
    if (isFavorite) {
      mobilePlayerFavorite.classList.add("is-active");
    } else {
      mobilePlayerFavorite.classList.remove("is-active");
    }
  }
}

// モバイルプレイヤーイベントハンドラー
if (mobilePlayerClose) {
  mobilePlayerClose.addEventListener("click", closeMobilePlayer);
}

if (mobilePlayerProgressSlider) {
  const updateProgress = (e) => {
    if (audioPlayer && audioPlayer.duration) {
      const time = (e.target.value / 100) * audioPlayer.duration;
      audioPlayer.currentTime = time;
    }
  };
  mobilePlayerProgressSlider.addEventListener("input", updateProgress);
  mobilePlayerProgressSlider.addEventListener("change", updateProgress);
}

// iOSではJSから音量変更不可のため、スライダーを注意書きに差し替え
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

if (mobilePlayerVolumeSlider) {
  if (isIOS) {
    const note = document.createElement("span");
    note.className = "mobile-player-volume-ios-note";
    note.textContent = "音量はデバイスのボタンで調整してください";
    mobilePlayerVolumeSlider.replaceWith(note);
  } else {
    const updateVolume = (e) => {
      if (audioPlayer) {
        audioPlayer.volume = e.target.value / 100;
        if (playerVolumeSlider) {
          playerVolumeSlider.value = e.target.value;
        }
      }
    };
    mobilePlayerVolumeSlider.addEventListener("input", updateVolume);
    mobilePlayerVolumeSlider.addEventListener("change", updateVolume);
  }
}

// ---- ミュート共通処理 ----
const syncMuteButtons = () => {
  if (!audioPlayer) return;
  const muted = audioPlayer.muted;
  [playerVolumeToggle, mobilePlayerVolumeToggle, spVolumeToggle].forEach((btn) => {
    if (!btn) return;
    btn.classList.toggle("is-muted", muted);
    btn.setAttribute("aria-label", muted ? "ミュート解除" : "ミュート切り替え");
    btn.setAttribute("aria-pressed", muted ? "true" : "false");
  });
};

const toggleMute = () => {
  if (!audioPlayer) return;
  audioPlayer.muted = !audioPlayer.muted;
  syncMuteButtons();
};

[playerVolumeToggle, spVolumeToggle].forEach((btn) => {
  if (btn) btn.addEventListener("click", toggleMute);
});

if (mobilePlayerVolumeToggle) {
  if (isIOS) {
    mobilePlayerVolumeToggle.style.display = "none";
  } else {
    mobilePlayerVolumeToggle.addEventListener("click", toggleMute);
  }
}

if (mobilePlayerToggle) {
  mobilePlayerToggle.addEventListener("click", () => {
    if (playerToggle) {
      playerToggle.click();
    }
  });
}

if (mobilePlayerPrev) {
  mobilePlayerPrev.addEventListener("click", () => {
    if (playerPrev) {
      playerPrev.click();
    }
  });
}

if (mobilePlayerNext) {
  mobilePlayerNext.addEventListener("click", () => {
    if (playerNext) {
      playerNext.click();
    }
  });
}

if (mobilePlayerShuffle) {
  mobilePlayerShuffle.addEventListener("click", () => {
    if (playerShuffle) {
      playerShuffle.click();
      setTimeout(syncMobilePlayerButtons, 50);
    }
  });
}

if (mobilePlayerLoop) {
  mobilePlayerLoop.addEventListener("click", () => {
    if (playerLoop) {
      playerLoop.click();
      setTimeout(syncMobilePlayerButtons, 50);
    }
  });
}

const mobilePlayerMenuPanel = document.getElementById("mobile-player-menu-panel");

const openMobilePlayerMenu = () => {
  if (!mobilePlayerMenuPanel) return;
  mobilePlayerMenuPanel.classList.add("is-open");
  mobilePlayerMenuPanel.setAttribute("aria-hidden", "false");
};

const closeMobilePlayerMenu = () => {
  if (!mobilePlayerMenuPanel) return;
  mobilePlayerMenuPanel.classList.remove("is-open");
  mobilePlayerMenuPanel.setAttribute("aria-hidden", "true");
};

const toggleMobilePlayerMenu = () => {
  if (!mobilePlayerMenuPanel) return;
  if (mobilePlayerMenuPanel.classList.contains("is-open")) {
    closeMobilePlayerMenu();
  } else {
    openMobilePlayerMenu();
  }
};

if (mobilePlayerMenuToggle) {
  mobilePlayerMenuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMobilePlayerMenu();
  });
}

if (mobilePlayerMenuPanel) {
  // 各ボタンをデスクトップ側のボタンに委譲
  const mobilePlayerDownload = document.getElementById("mobile-player-download");
  const mobilePlayerAddPlaylist = document.getElementById("mobile-player-add-playlist");
  const mobilePlayerOpenSource = document.getElementById("mobile-player-open-source");
  const mobilePlayerShareTrack = document.getElementById("mobile-player-share-track");
  const mobilePlayerEditInfo = document.getElementById("mobile-player-edit-info");
  const mobilePlayerDeleteTrack = document.getElementById("mobile-player-delete-track");

  if (mobilePlayerDownload) mobilePlayerDownload.addEventListener("click", () => {
    closeMobilePlayerMenu();
    document.getElementById("player-download")?.click();
  });
  if (mobilePlayerAddPlaylist) mobilePlayerAddPlaylist.addEventListener("click", () => {
    closeMobilePlayerMenu();
    document.getElementById("player-add-playlist")?.click();
  });
  if (mobilePlayerOpenSource) mobilePlayerOpenSource.addEventListener("click", () => {
    closeMobilePlayerMenu();
    document.getElementById("player-open-source")?.click();
  });
  if (mobilePlayerShareTrack) mobilePlayerShareTrack.addEventListener("click", () => {
    closeMobilePlayerMenu();
    document.getElementById("player-share-track")?.click();
  });
  if (mobilePlayerEditInfo) mobilePlayerEditInfo.addEventListener("click", () => {
    closeMobilePlayerMenu();
    document.getElementById("player-edit-info")?.click();
  });
  if (mobilePlayerDeleteTrack) mobilePlayerDeleteTrack.addEventListener("click", () => {
    closeMobilePlayerMenu();
    document.getElementById("player-delete-track")?.click();
  });

  // パネル外タップで閉じる
  document.addEventListener("click", (e) => {
    if (
      mobilePlayerMenuPanel.classList.contains("is-open") &&
      !mobilePlayerMenuPanel.contains(e.target) &&
      e.target !== mobilePlayerMenuToggle
    ) {
      closeMobilePlayerMenu();
    }
  });
}

if (mobilePlayerFavorite) {
  mobilePlayerFavorite.addEventListener("click", () => {
    if (playerFavorite) {
      playerFavorite.click();
      setTimeout(() => {
        // お気に入り状態を同期
        if (playerFavorite.getAttribute("aria-pressed") === "true") {
          mobilePlayerFavorite.setAttribute("aria-pressed", "true");
          mobilePlayerFavorite.classList.add("is-active");
        } else {
          mobilePlayerFavorite.setAttribute("aria-pressed", "false");
          mobilePlayerFavorite.classList.remove("is-active");
        }
      }, 50);
    }
  });
}

// audioPlayerのtimeupdateイベントでモバイルプレイヤーも更新
const originalTimeUpdateHandler = audioPlayer.ontimeupdate;
audioPlayer.addEventListener("timeupdate", () => {
  if (mobilePlayerOverlay && mobilePlayerOverlay.getAttribute("aria-hidden") === "false") {
    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100 || 0;
    mobilePlayerProgressSlider.value = progress;
    mobilePlayerProgressSlider.style.setProperty("--seek-pct", progress.toFixed(1) + "%");
    mobilePlayerCurrentTime.textContent = formatTime(audioPlayer.currentTime);
    mobilePlayerDuration.textContent = formatTime(audioPlayer.duration);
  }
});

if (playerClose) {
  playerClose.addEventListener("click", () => {
    closePlayerOverlay();
  });
}

if (playerMenuToggle) {
  playerMenuToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    togglePlayerMenu();
  });
}

if (playerMenuPanel) {
  playerMenuPanel.addEventListener("click", (event) => {
    const targetButton = event.target?.closest("button");
    if (targetButton) {
      closePlayerMenu();
    }
  });
}

if (playerAddPlaylist) {
  playerAddPlaylist.addEventListener("click", () => {
    closePlayerMenu();
    openPlaylistModal();
  });
}

if (playerOpenSource) {
  playerOpenSource.addEventListener("click", () => {
    const track = state.tracks[playerState.currentIndex];
    if (!track?.source_url) {
      appendImportLog("ソース URL が登録されていません。", { append: true });
      return;
    }
    window.open(track.source_url, "_blank", "noopener");
  });
}

if (playerShareTrack) {
  playerShareTrack.addEventListener("click", () => {
    const track = state.tracks[playerState.currentIndex];
    if (!track) {
      return;
    }
    const shareUrl = buildShareUrl(track);
    if (!shareUrl) {
      appendImportLog("共有リンクを作成できませんでした。", { append: true });
      return;
    }
    showShareDialog(shareUrl);
  });
}

if (shareDialogCopy) {
  shareDialogCopy.addEventListener("click", () => {
    copyShareUrl();
  });
}

if (shareDialogClose) {
  shareDialogClose.addEventListener("click", () => {
    closeShareDialog();
  });
}

if (shareDialog) {
  shareDialog.addEventListener("click", (event) => {
    if (event.target === shareDialog) {
      closeShareDialog();
    }
  });
}

if (playerEditInfo) {
  playerEditInfo.addEventListener("click", () => {
    const track = state.tracks[playerState.currentIndex];
    if (!track) {
      return;
    }
    closePlayerMenu();
    openTrackEditModal(track);
  });
}

if (playerDeleteTrack) {
  playerDeleteTrack.addEventListener("click", async () => {
    const track = state.tracks[playerState.currentIndex];
    if (!track) {
      return;
    }
    closePlayerMenu();
    const result = await showConfirmDialog({
      title: "楽曲を削除",
      message: `「${track.title}」を削除しますか？`,
      showFileOption: true,
      buttons: [
        { label: "キャンセル", className: "secondary", value: "cancel" },
        { label: "削除する", className: "danger", value: "confirm" },
      ],
    });
    if (result.action !== "confirm") {
      return;
    }
    try {
      stopPlayback();
      closePlayerOverlay();
      await deleteTrack(track.id, result.deleteFile);
      await refreshLibrary();
    } catch (error) {
      console.error(error);
      appendImportLog("曲の削除に失敗しました。", { append: true });
    }
  });
}

if (playerDownload) {
  playerDownload.addEventListener("click", () => {
    const track = state.tracks[playerState.currentIndex];
    if (!track?.file_url) {
      appendImportLog("ダウンロードできる音源がありません。", { append: true });
      return;
    }
    const anchor = document.createElement("a");
    const safeTitle = track.title.replace(/[\\/:*?"<>|]/g, "_");
    anchor.href = track.file_url;
    anchor.download = `${safeTitle}.mp3`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  });
}

if (playlistModalClose) {
  playlistModalClose.addEventListener("click", () => {
    closePlaylistModal();
  });
}

if (playlistModal) {
  playlistModal.addEventListener("click", (event) => {
    if (event.target === playlistModal) {
      closePlaylistModal();
    }
  });
}

if (trackEditClose) {
  trackEditClose.addEventListener("click", () => {
    closeTrackEditModal();
  });
}

if (trackEditCancel) {
  trackEditCancel.addEventListener("click", () => {
    closeTrackEditModal();
  });
}

if (trackEditModal) {
  trackEditModal.addEventListener("click", (event) => {
    if (event.target === trackEditModal) {
      closeTrackEditModal();
    }
  });
}

if (trackEditForm) {
  trackEditForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const track = state.tracks[playerState.currentIndex];
    if (!track) {
      return;
    }
    const payload = {
      title: trackEditTitle?.value?.trim() ?? "",
      artist: trackEditArtist?.value?.trim() ?? "",
      album: trackEditAlbum?.value?.trim() ?? "",
      source_url: trackEditSourceUrl?.value?.trim() ?? "",
    };
    try {
      const updated = await updateTrackMetadata(track.id, payload);
      const targetIndex = state.tracks.findIndex((item) => item.id === track.id);
      if (targetIndex >= 0) {
        state.tracks[targetIndex] = updated;
      }
      renderMedia();
      renderPlaylistDetail();
      renderTagOptions();
      updatePlayerUI();
      updateFavoriteButtons();
      closeTrackEditModal();
    } catch (error) {
      console.error(error);
    }
  });
}

document.addEventListener("click", (event) => {
  if (!playerMenuPanel || !playerMenuToggle) {
    return;
  }
  if (
    playerMenuPanel.classList.contains("is-open") &&
    !playerMenuPanel.contains(event.target) &&
    !playerMenuToggle.contains(event.target)
  ) {
    closePlayerMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (!isPlayerOverlayActive()) {
    return;
  }
  const tagName = event.target?.tagName?.toLowerCase();
  if (tagName === "input" || tagName === "textarea" || event.target?.isContentEditable) {
    return;
  }
  if (event.key === "Escape") {
    closePlayerOverlay();
    return;
  }
  if (event.code === "Space" || event.key === " ") {
    event.preventDefault();
    togglePlayback();
  }
});

if (supportsMediaSession) {
  navigator.mediaSession.setActionHandler("play", () => {
    togglePlayback();
  });
  navigator.mediaSession.setActionHandler("pause", () => {
    togglePlayback();
  });
  navigator.mediaSession.setActionHandler("previoustrack", () => {
    playPrev();
  });
  navigator.mediaSession.setActionHandler("nexttrack", () => {
    playNext();
  });
  navigator.mediaSession.setActionHandler("stop", () => {
    stopPlayback();
  });
  navigator.mediaSession.setActionHandler("seekto", (event) => {
    if (!audioPlayer || typeof event.seekTime !== "number") {
      return;
    }
    if (event.fastSeek && typeof audioPlayer.fastSeek === "function") {
      audioPlayer.fastSeek(event.seekTime);
    } else {
      audioPlayer.currentTime = event.seekTime;
    }
    updateMediaSessionPosition();
  });
}


init();
