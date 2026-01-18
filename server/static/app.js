const tabs = document.querySelectorAll(".nav-button");
const panels = document.querySelectorAll(".panel");

const nowPlaying = document.getElementById("now-playing");
const mediaGrid = document.getElementById("media-grid");
const playlistList = document.getElementById("playlist-list");
const favorites = document.getElementById("favorites");
const tagSelect = document.getElementById("tag-track-select");
const importForm = document.getElementById("import-form");
const importUrl = document.getElementById("import-url");
const importPlaylist = document.getElementById("import-playlist");
const importAutoTag = document.getElementById("import-auto-tag");
const importSubmit = document.getElementById("import-submit");
const importLog = document.getElementById("import-log");

const statusVersion = document.getElementById("status-version");
const statusDevice = document.getElementById("status-device");
const statusTime = document.getElementById("status-time");

const state = {
  tracks: [],
  playlists: [],
  favorites: [],
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((button) => button.classList.remove("is-active"));
    panels.forEach((panel) => panel.classList.remove("is-active"));
    tab.classList.add("is-active");
    const target = document.getElementById(`panel-${tab.dataset.tab}`);
    if (target) {
      target.classList.add("is-active");
    }
  });
});

const renderNowPlaying = (track) => {
  const title = track ? track.title : "--";
  const meta = track ? `${track.artist} ・ ${track.album}` : "--";
  nowPlaying.querySelector(".track").textContent = title;
  nowPlaying.querySelector(".meta").textContent = meta;
};

const renderMedia = () => {
  mediaGrid.innerHTML = "";
  state.tracks.forEach((track) => {
    const card = document.createElement("div");
    card.className = "media-card";
    card.innerHTML = `
      <img src="${track.cover}" alt="${track.album}" />
      <h3>${track.title}</h3>
      <p>${track.artist}</p>
      <p>${track.album}</p>
      <div class="media-meta">
        <span>${track.genre} ・ ${track.year}</span>
        <span>${track.duration}</span>
      </div>
      <button class="play-button" type="button">再生</button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      renderNowPlaying(track);
    });
    mediaGrid.appendChild(card);
  });
};

const renderPlaylists = () => {
  playlistList.innerHTML = "";
  state.playlists.forEach((playlist) => {
    const trackNames = playlist.track_ids
      .map((id) => state.tracks.find((track) => track.id === id))
      .filter(Boolean)
      .map((track) => `${track.title} / ${track.artist}`);

    const card = document.createElement("div");
    card.className = "playlist-card";
    card.innerHTML = `
      <h3>${playlist.name}</h3>
      <p>収録曲数: ${playlist.track_ids.length}</p>
      <ul>
        ${trackNames.map((name) => `<li>${name}</li>`).join("")}
      </ul>
      <button class="secondary" type="button">再生キューへ送る</button>
    `;
    playlistList.appendChild(card);
  });
};

const renderFavorites = () => {
  favorites.innerHTML = `
    <h3>お気に入り</h3>
    <p>よく聴く楽曲のショートカット。</p>
  `;
  const list = document.createElement("ul");
  state.favorites
    .map((id) => state.tracks.find((track) => track.id === id))
    .filter(Boolean)
    .forEach((track) => {
      const item = document.createElement("li");
      item.textContent = `${track.title} / ${track.artist}`;
      list.appendChild(item);
    });
  favorites.appendChild(list);
};

const renderTagOptions = () => {
  tagSelect.innerHTML = state.tracks
    .map((track) => `<option value="${track.id}">${track.title} / ${track.artist}</option>`)
    .join("");
};

const renderImportPlaylists = () => {
  if (!importPlaylist) {
    return;
  }
  const options = state.playlists.map(
    (playlist) =>
      `<option value="${playlist.id}">${playlist.name}</option>`
  );
  options.push('<option value="__new__">未分類</option>');
  importPlaylist.innerHTML = options.join("");
};

const fetchJson = async (path) => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
};

const postJson = async (path, payload) => {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to post ${path}`);
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
  renderMedia();
  renderPlaylists();
  renderFavorites();
  renderTagOptions();
  renderImportPlaylists();
};

const appendImportLog = (message) => {
  if (!importLog) {
    return;
  }
  importLog.textContent = message;
};

const handleImportSubmit = async () => {
  const url = importUrl?.value?.trim();
  if (!url) {
    appendImportLog("URL を入力してください。");
    return;
  }
  const selected = importPlaylist?.value;
  const payload = {
    url,
  };
  if (selected && selected !== "__new__") {
    payload.playlist_id = selected;
  } else if (selected === "__new__") {
    payload.playlist_name = "未分類";
  }
  payload.auto_tag = Boolean(importAutoTag?.checked);
  appendImportLog("yt-dlp を実行中...");
  try {
    const response = await postJson("/api/library/import", payload);
    appendImportLog(response.log || "取り込み完了。");
    await refreshLibrary();
    importUrl.value = "";
  } catch (error) {
    appendImportLog(`エラー: ${error.message}`);
  }
};

const init = async () => {
  try {
    const [tracks, playlists, favoritesData, status] = await Promise.all([
      fetchJson("/api/library"),
      fetchJson("/api/playlists"),
      fetchJson("/api/favorites"),
      fetchJson("/api/status"),
    ]);

    state.tracks = tracks;
    state.playlists = playlists;
    state.favorites = favoritesData;

    renderMedia();
    renderPlaylists();
    renderFavorites();
    renderTagOptions();
    renderImportPlaylists();
    renderNowPlaying(tracks[0]);

    statusVersion.textContent = status.version;
    statusDevice.textContent = status.device;
    statusTime.textContent = status.time;
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

init();
