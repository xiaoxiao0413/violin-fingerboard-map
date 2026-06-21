const SCALE_LENGTH_DEFAULT = 325;
const FINGERBOARD_LENGTH_DEFAULT = 270;
const MAX_SEMITONE = 24;
const STORAGE_KEY = "violin-formula-fingerboard-v2";

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

const I18N = {
  "zh-Hans": {
    htmlLang: "zh-CN",
    pageTitle: "小提琴指板图",
    brandEyebrow: "小提琴指板图",
    appTitle: "小提琴指板图",
    circleTitle: "五度圈",
    circleCenter: "五度圈",
    circleSub: "大小调",
    languageLabel: "语言",
    modeLabel: "调式",
    majorMode: "大调",
    minorMode: "小调",
    tonicLabel: "主音",
    positionLabel: "把位",
    resetButton: "重置筛选",
    chartsEyebrow: "结果",
    allKeys: "全部调",
    allPositions: "全部把位",
    positionOption: (position) => `第${position.cnHans}把位`,
    positionSuffix: (position) => ` · 第${position.cnHans}把位`,
    none: "无",
    sharpCount: (count) => `${count}♯`,
    flatCount: (count) => `${count}♭`,
    keyLabel: (key, sig) => `${key.label}（${sig}）`,
    fingerboard: "指板",
    bridge: "琴码",
    chartName: "小提琴指板图",
    stringWord: "弦",
    scaleDegree: "音级",
    distanceFromNut: "距弦枕",
    clickToZoom: "点击放大",
    close: "关闭",
  },
  "zh-Hant": {
    htmlLang: "zh-Hant",
    pageTitle: "小提琴指板圖",
    brandEyebrow: "小提琴指板圖",
    appTitle: "小提琴指板圖",
    circleTitle: "五度圈",
    circleCenter: "五度圈",
    circleSub: "大小調",
    languageLabel: "語言",
    modeLabel: "調式",
    majorMode: "大調",
    minorMode: "小調",
    tonicLabel: "主音",
    positionLabel: "把位",
    resetButton: "重置篩選",
    chartsEyebrow: "結果",
    allKeys: "全部調",
    allPositions: "全部把位",
    positionOption: (position) => `第${position.cnHant}把位`,
    positionSuffix: (position) => ` · 第${position.cnHant}把位`,
    none: "無",
    sharpCount: (count) => `${count}♯`,
    flatCount: (count) => `${count}♭`,
    keyLabel: (key, sig) => `${key.label}（${sig}）`,
    fingerboard: "指板",
    bridge: "琴碼",
    chartName: "小提琴指板圖",
    stringWord: "弦",
    scaleDegree: "音級",
    distanceFromNut: "距弦枕",
    clickToZoom: "點擊放大",
    close: "關閉",
  },
  en: {
    htmlLang: "en",
    pageTitle: "Violin Fingerboard Chart",
    brandEyebrow: "Violin Fingerboard Chart",
    appTitle: "Violin Fingerboard Chart",
    circleTitle: "Circle of Fifths",
    circleCenter: "Fifths",
    circleSub: "Major / minor",
    languageLabel: "Language",
    modeLabel: "Mode",
    majorMode: "Major",
    minorMode: "Minor",
    tonicLabel: "Tonic",
    positionLabel: "Position",
    resetButton: "Reset filters",
    chartsEyebrow: "Results",
    allKeys: "All Keys",
    allPositions: "All Positions",
    positionOption: (position) => `Position ${position.order}`,
    positionSuffix: (position) => ` · Position ${position.order}`,
    none: "None",
    sharpCount: (count) => `${count}♯`,
    flatCount: (count) => `${count}♭`,
    keyLabel: (key, sig) => `${key.label} (${sig})`,
    fingerboard: "Fingerboard",
    bridge: "Bridge",
    chartName: "Violin Fingerboard Chart",
    stringWord: "String",
    scaleDegree: "Scale Degree",
    distanceFromNut: "from Nut",
    clickToZoom: "Click to zoom",
    close: "Close",
  },
};

const MODES = {
  major: {
    labelKey: "majorMode",
    formula: "{0, 2, 4, 5, 7, 9, 11}",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    keys: [
      { id: "c", label: "C", pc: 0, letter: "C" },
      { id: "g", label: "G", pc: 7, letter: "G" },
      { id: "d", label: "D", pc: 2, letter: "D" },
      { id: "a", label: "A", pc: 9, letter: "A" },
      { id: "e", label: "E", pc: 4, letter: "E" },
      { id: "b", label: "B", pc: 11, letter: "B" },
      { id: "fs", label: "F♯", pc: 6, letter: "F" },
      { id: "cs", label: "C♯", pc: 1, letter: "C" },
      { id: "f", label: "F", pc: 5, letter: "F" },
      { id: "bb", label: "B♭", pc: 10, letter: "B" },
      { id: "eb", label: "E♭", pc: 3, letter: "E" },
      { id: "ab", label: "A♭", pc: 8, letter: "A" },
      { id: "db", label: "D♭", pc: 1, letter: "D" },
      { id: "gb", label: "G♭", pc: 6, letter: "G" },
      { id: "cb", label: "C♭", pc: 11, letter: "C" },
    ],
  },
  minor: {
    labelKey: "minorMode",
    formula: "{0, 2, 3, 5, 7, 8, 10}",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    keys: [
      { id: "a", label: "A", pc: 9, letter: "A" },
      { id: "e", label: "E", pc: 4, letter: "E" },
      { id: "b", label: "B", pc: 11, letter: "B" },
      { id: "fs", label: "F♯", pc: 6, letter: "F" },
      { id: "cs", label: "C♯", pc: 1, letter: "C" },
      { id: "gs", label: "G♯", pc: 8, letter: "G" },
      { id: "ds", label: "D♯", pc: 3, letter: "D" },
      { id: "as", label: "A♯", pc: 10, letter: "A" },
      { id: "d", label: "D", pc: 2, letter: "D" },
      { id: "g", label: "G", pc: 7, letter: "G" },
      { id: "c", label: "C", pc: 0, letter: "C" },
      { id: "f", label: "F", pc: 5, letter: "F" },
      { id: "bb", label: "B♭", pc: 10, letter: "B" },
      { id: "eb", label: "E♭", pc: 3, letter: "E" },
      { id: "ab", label: "A♭", pc: 8, letter: "A" },
    ],
  },
};

const STRINGS = [
  { name: "G", openLabel: "G3", pc: 7, width: 4.2 },
  { name: "D", openLabel: "D4", pc: 2, width: 3.6 },
  { name: "A", openLabel: "A4", pc: 9, width: 3 },
  { name: "E", openLabel: "E5", pc: 4, width: 2.4 },
];

const FINGER_LINES = [
  { finger: "1", semitone: 2 },
  { finger: "2", semitone: 4 },
  { finger: "3", semitone: 5 },
  { finger: "4", semitone: 7 },
];

const KEY_COLORS = [
  "#0b7887", "#bd4f6c", "#5c7cfa", "#d97706", "#5f7f39",
  "#b13d75", "#2f8f83", "#7b61c7", "#c65d32", "#2d6a9f",
  "#9b6b20", "#50724f", "#bc5274", "#397c89", "#8a6a39",
];

const KEY_SIGNATURES = {
  major: { c: 0, g: 1, d: 2, a: 3, e: 4, b: 5, fs: 6, cs: 7, f: -1, bb: -2, eb: -3, ab: -4, db: -5, gb: -6, cb: -7 },
  minor: { a: 0, e: 1, b: 2, fs: 3, cs: 4, gs: 5, ds: 6, as: 7, d: -1, g: -2, c: -3, f: -4, bb: -5, eb: -6, ab: -7 },
};

const CN_NUM = [
  { cnHans: "一", cnHant: "一" },
  { cnHans: "二", cnHant: "二" },
  { cnHans: "三", cnHant: "三" },
  { cnHans: "四", cnHant: "四" },
  { cnHans: "五", cnHant: "五" },
  { cnHans: "六", cnHant: "六" },
  { cnHans: "七", cnHant: "七" },
  { cnHans: "八", cnHant: "八" },
  { cnHans: "九", cnHant: "九" },
  { cnHans: "十", cnHant: "十" },
];

const POSITIONS = CN_NUM.map((names, index) => {
  const p = index + 1;
  return { id: String(p), order: p, ...names, startNote: p + 1, endNote: p + 4 };
});

const filters = document.querySelector("#filters");
const languageSelect = document.querySelector("#language");
const tonicSelect = document.querySelector("#tonic");
const positionSelect = document.querySelector("#position");
const resultTitle = document.querySelector("#result-title");
const results = document.querySelector("#results");
const resetButton = document.querySelector("#reset");
const lightbox = document.createElement("dialog");

function getLang() {
  return I18N[languageSelect?.value] ? languageSelect.value : "zh-Hans";
}

function t(key) {
  return I18N[getLang()][key];
}

function modeLabel(modeId) {
  return t(MODES[modeId].labelKey);
}

function updateStaticText() {
  const lang = getLang();
  const dict = I18N[lang];
  document.documentElement.lang = dict.htmlLang;
  document.title = dict.pageTitle;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = dict[node.dataset.i18n];
    if (typeof value === "string") node.textContent = value;
  });
  document.querySelector(".fifths-svg")?.setAttribute("aria-label", dict.circleTitle);
  filters.querySelector(".mode-segmented")?.setAttribute("aria-label", dict.modeLabel);
  lightbox.querySelector(".lightbox-close")?.setAttribute("aria-label", dict.close);
}

function fillPositionOptions(preferredValue = "all") {
  positionSelect.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = t("allPositions");
  positionSelect.append(allOption);

  for (const position of POSITIONS) {
    const option = document.createElement("option");
    option.value = position.id;
    option.textContent = t("positionOption")(position);
    positionSelect.append(option);
  }

  positionSelect.value = POSITIONS.some((position) => position.id === preferredValue) ? preferredValue : "all";
}

function getPositionFilter() {
  if (!positionSelect.value || positionSelect.value === "all") return null;
  return POSITIONS.find((position) => position.id === positionSelect.value) || null;
}

function mod12(value) {
  return ((value % 12) + 12) % 12;
}

function fingerDistanceMm(semitone, scaleLength) {
  return scaleLength * (1 - 2 ** (-semitone / 12));
}

function accidentalText(delta) {
  if (delta === -2) return "𝄫";
  if (delta === -1) return "♭";
  if (delta === 1) return "♯";
  if (delta === 2) return "𝄪";
  if (delta < -2) return "♭".repeat(Math.abs(delta));
  if (delta > 2) return "♯".repeat(delta);
  return "";
}

function signedPitchDelta(targetPc, naturalPc) {
  let delta = mod12(targetPc - naturalPc);
  if (delta > 6) delta -= 12;
  return delta;
}

function nextLetter(rootLetter, steps) {
  const start = LETTERS.indexOf(rootLetter);
  return LETTERS[(start + steps) % LETTERS.length];
}

function buildScale(key, mode) {
  return mode.intervals.map((interval, index) => {
    const letter = nextLetter(key.letter, index);
    const pc = mod12(key.pc + interval);
    const accidental = signedPitchDelta(pc, LETTER_PC[letter]);
    return { degree: index + 1, interval, pc, label: `${letter}${accidentalText(accidental)}` };
  });
}

function getModeId() {
  const value = new FormData(filters).get("mode");
  return MODES[value] ? value : "major";
}

function getMode() {
  return MODES[getModeId()] || MODES.major;
}

function keySignatureText(key, modeId) {
  const count = KEY_SIGNATURES[modeId]?.[key.id] ?? 0;
  if (count === 0) return t("none");
  return count > 0 ? t("sharpCount")(count) : t("flatCount")(Math.abs(count));
}

function keyDisplayLabel(key, modeId) {
  return t("keyLabel")(key, keySignatureText(key, modeId));
}

function fillTonicOptions(modeId, preferredValue = "all") {
  const keys = MODES[modeId].keys;
  tonicSelect.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = t("allKeys");
  tonicSelect.append(allOption);

  for (const key of keys) {
    const option = document.createElement("option");
    option.value = key.id;
    option.textContent = keyDisplayLabel(key, modeId);
    tonicSelect.append(option);
  }

  tonicSelect.value = preferredValue === "all" || keys.some((key) => key.id === preferredValue) ? preferredValue : "all";
}

function loadSavedState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return null;
    const modeId = ["naturalMinor", "harmonicMinor", "melodicMinor"].includes(saved.mode)
      ? "minor"
      : MODES[saved.mode] ? saved.mode : "major";
    return {
      lang: I18N[saved.lang] ? saved.lang : "zh-Hans",
      mode: modeId,
      tonic: typeof saved.tonic === "string" ? saved.tonic : "all",
      position: typeof saved.position === "string" ? saved.position : "all",
    };
  } catch {
    return null;
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      lang: getLang(),
      mode: getModeId(),
      tonic: tonicSelect.value,
      position: positionSelect.value,
    }));
  } catch {
    /* Ignore unavailable localStorage. */
  }
}

function selectedKeys(modeId) {
  const keys = MODES[modeId].keys;
  if (tonicSelect.value === "all") return keys;
  return keys.filter((key) => key.id === tonicSelect.value);
}

function scaleByPitchClass(scale) {
  return new Map(scale.map((note) => [note.pc, note]));
}

function noteMarkersForString(string, scaleMap, maxSemitone, scaleLength) {
  const markers = [];
  for (let semitone = 0; semitone <= maxSemitone; semitone += 1) {
    const pc = mod12(string.pc + semitone);
    const note = scaleMap.get(pc);
    if (!note) continue;
    markers.push({ ...note, semitone, distanceMm: fingerDistanceMm(semitone, scaleLength), isOpen: semitone === 0 });
  }
  return markers;
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function markerStyleForSemitone(semitone, label) {
  const longLabelAdjust = label.length > 2 ? 0.7 : 0;
  if (semitone >= 19) return { radius: 5.8, fontSize: 6.2 - longLabelAdjust, textOffset: 2.1 };
  if (semitone >= 14) return { radius: 6.8, fontSize: 7 - longLabelAdjust, textOffset: 2.4 };
  if (semitone >= 9) return { radius: 8.2, fontSize: 7.9 - longLabelAdjust, textOffset: 2.7 };
  return { radius: 10.5, fontSize: 9.5 - longLabelAdjust, textOffset: 3.2 };
}

function makeFingerboardSvg(key, keyIndex, mode, maxSemitone, scaleLength) {
  const modeId = getModeId();
  const positionFilter = getPositionFilter();
  const scale = buildScale(key, mode);
  const scaleMap = scaleByPitchClass(scale);
  const width = 420;
  const top = 112;
  const stringGap = 62;
  const left = 116;
  const boardHeight = 780;
  const bridgeY = top + boardHeight;
  const fingerboardEndY = top + (FINGERBOARD_LENGTH_DEFAULT / scaleLength) * boardHeight;
  const height = bridgeY + 44;
  const boardLeft = 82;
  const boardRight = left + stringGap * (STRINGS.length - 1) + 34;
  const boardTop = top - 28;
  const boardBottom = fingerboardEndY + 24;
  const xMax = scaleLength;
  const keyColor = KEY_COLORS[keyIndex % KEY_COLORS.length];
  const xs = STRINGS.map((_, index) => left + index * stringGap);

  const yFor = (semitone) => top + (fingerDistanceMm(semitone, scaleLength) / xMax) * boardHeight;
  const parts = [];

  parts.push(`<svg class="fingerboard-svg" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img">`);
  parts.push(`<title>${escapeXml(`${keyDisplayLabel(key, modeId)} ${modeLabel(modeId)} ${t("chartName")}`)}</title>`);
  parts.push(`<rect x="0" y="0" width="${width}" height="${height}" rx="18" fill="#fffdf6"/>`);
  parts.push(`<rect x="${boardLeft}" y="${boardTop}" width="${boardRight - boardLeft}" height="${boardBottom - boardTop}" rx="28" fill="#2a211d"/>`);
  parts.push(`<rect x="${boardLeft + 8}" y="${boardTop + 8}" width="${boardRight - boardLeft - 16}" height="${boardBottom - boardTop - 16}" rx="21" fill="#3b2c25"/>`);
  parts.push(`<line x1="${boardLeft + 12}" y1="${top}" x2="${boardRight - 12}" y2="${top}" stroke="#f4ead9" stroke-width="9" stroke-linecap="round"/>`);
  parts.push(`<line x1="${boardLeft + 16}" y1="${fingerboardEndY.toFixed(2)}" x2="${boardRight - 16}" y2="${fingerboardEndY.toFixed(2)}" stroke="#1c1512" stroke-width="5" stroke-linecap="round"/>`);
  parts.push(`<text x="${boardLeft - 18}" y="${(boardTop + (boardBottom - boardTop) / 2).toFixed(2)}" text-anchor="middle" font-size="13" font-weight="900" fill="#4b3d32" transform="rotate(-90 ${boardLeft - 18} ${(boardTop + (boardBottom - boardTop) / 2).toFixed(2)})">${escapeXml(t("fingerboard"))}</text>`);
  parts.push(`<line x1="${boardLeft + 10}" y1="${bridgeY}" x2="${boardRight - 10}" y2="${bridgeY}" stroke="#d9a45f" stroke-width="10" stroke-linecap="round"/>`);
  parts.push(`<text x="${boardRight + 8}" y="${bridgeY + 4}" text-anchor="start" font-size="13" font-weight="900" fill="#8a5a20">${escapeXml(t("bridge"))}</text>`);

  for (let semitone = 0; semitone <= maxSemitone; semitone += 1) {
    const y = yFor(semitone);
    const strong = semitone % 12 === 0;
    parts.push(`<line x1="${boardLeft + 14}" y1="${y.toFixed(2)}" x2="${boardRight - 14}" y2="${y.toFixed(2)}" stroke="#f8efe2" stroke-opacity="${strong ? 0.34 : 0.15}" stroke-width="${strong ? 2 : 1}"/>`);
  }

  for (const line of FINGER_LINES) {
    if (line.semitone > maxSemitone) continue;
    const y = yFor(line.semitone);
    parts.push(`<line x1="${boardLeft + 14}" y1="${y.toFixed(2)}" x2="${boardRight - 14}" y2="${y.toFixed(2)}" stroke="#f4bd27" stroke-opacity="0.92" stroke-width="2.5" stroke-dasharray="7 6"/>`);
    parts.push(`<rect x="${boardRight + 8}" y="${(y - 12).toFixed(2)}" width="42" height="24" rx="12" fill="#f4bd27" stroke="#9b6b20" stroke-width="1"/>`);
    parts.push(`<text x="${boardRight + 29}" y="${(y + 4).toFixed(2)}" text-anchor="middle" font-size="12" font-weight="900" fill="#36240f">${line.finger}</text>`);
  }

  for (let i = 0; i < STRINGS.length; i += 1) {
    const string = STRINGS[i];
    const x = xs[i];
    const markers = noteMarkersForString(string, scaleMap, maxSemitone, scaleLength);

    parts.push(`<text x="${x}" y="${top - 52}" text-anchor="middle" font-size="22" font-weight="900" fill="#16202a">${string.name}</text>`);
    parts.push(`<text x="${x}" y="${top - 34}" text-anchor="middle" font-size="12" font-weight="800" fill="#7a6b5e">${string.openLabel}</text>`);
    parts.push(`<line x1="${x}" y1="${top}" x2="${x}" y2="${bridgeY}" stroke="#e8d8bf" stroke-width="${string.width}" stroke-linecap="round"/>`);

    markers.forEach((marker, markerIndex) => {
      const y = yFor(marker.semitone);
      const isTonic = marker.degree === 1;
      const markerStyle = markerStyleForSemitone(marker.semitone, marker.label);
      const fill = isTonic ? "#14191f" : keyColor;
      const textColor = isTonic ? "#ffffff" : "#fffdf6";
      const noteOrder = markerIndex + 1;
      const inPosition = positionFilter ? noteOrder >= positionFilter.startNote && noteOrder <= positionFilter.endNote : null;
      const dotClass = inPosition === null ? "note-dot" : inPosition ? "note-dot note-in-position" : "note-dot note-dim";

      parts.push(`<g class="${dotClass}">`);
      parts.push(`<title>${escapeXml(`${string.name} ${t("stringWord")} · ${marker.label}, ${t("scaleDegree")} ${marker.degree}, n=${marker.semitone}, ${marker.distanceMm.toFixed(1)} mm ${t("distanceFromNut")}`)}</title>`);
      if (inPosition) parts.push(`<circle cx="${x}" cy="${y.toFixed(2)}" r="${(markerStyle.radius + 3.4).toFixed(2)}" fill="none" stroke="#ffce45" stroke-width="2.6"/>`);
      parts.push(`<circle cx="${x}" cy="${y.toFixed(2)}" r="${markerStyle.radius}" fill="${fill}" stroke="#fff7ec" stroke-width="1.8"/>`);
      parts.push(`<text x="${x}" y="${(y + markerStyle.textOffset).toFixed(2)}" text-anchor="middle" font-size="${markerStyle.fontSize.toFixed(1)}" font-weight="900" fill="${textColor}">${escapeXml(marker.label)}</text>`);
      parts.push("</g>");
    });
  }

  parts.push(`<text x="28" y="28" font-size="18" font-weight="900" fill="#16202a">${escapeXml(`${keyDisplayLabel(key, modeId)} ${modeLabel(modeId)}`)}</text>`);
  parts.push("</svg>");
  return parts.join("");
}

function makeCard(key, keyIndex, mode, maxSemitone, scaleLength) {
  const modeId = getModeId();
  const scale = buildScale(key, mode);
  const card = document.createElement("article");
  card.className = "diagram-card formula-card";

  const header = document.createElement("div");
  header.className = "formula-card-head";

  const title = document.createElement("h3");
  title.textContent = `${keyDisplayLabel(key, modeId)} ${modeLabel(modeId)}`;

  const scaleLine = document.createElement("p");
  scaleLine.textContent = scale.map((note) => note.label).join(" ");

  const media = document.createElement("div");
  media.className = "fingerboard-media";
  media.innerHTML = makeFingerboardSvg(key, keyIndex, mode, maxSemitone, scaleLength);
  media.tabIndex = 0;
  media.setAttribute("role", "img");
  media.setAttribute("aria-label", `${key.label} ${modeLabel(modeId)} ${t("chartName")}`);
  media.title = t("clickToZoom");
  media.addEventListener("click", () => openLightbox(key, keyIndex, mode, maxSemitone, scaleLength));
  media.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(key, keyIndex, mode, maxSemitone, scaleLength);
    }
  });

  header.append(title, scaleLine);
  card.append(header, media);
  return card;
}

lightbox.className = "lightbox";
lightbox.innerHTML = '<button class="lightbox-close" type="button"></button><figure><div class="lightbox-media"></div><figcaption></figcaption></figure>';
document.body.append(lightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target.closest(".lightbox-close")) lightbox.close();
});

function openLightbox(key, keyIndex, mode, maxSemitone, scaleLength) {
  const media = lightbox.querySelector(".lightbox-media");
  media.innerHTML = makeFingerboardSvg(key, keyIndex, mode, maxSemitone, scaleLength);
  lightbox.querySelector("figcaption").textContent = `${keyDisplayLabel(key, getModeId())} ${modeLabel(getModeId())}`;
  lightbox.showModal();
}

function render() {
  updateStaticText();
  const modeId = getModeId();
  const mode = getMode();
  const keys = selectedKeys(modeId);
  const maxSemitone = MAX_SEMITONE;
  const scaleLength = SCALE_LENGTH_DEFAULT;
  const positionFilter = getPositionFilter();
  const positionSuffix = positionFilter ? t("positionSuffix")(positionFilter) : "";

  resultTitle.textContent = (tonicSelect.value === "all"
    ? `${t("allKeys")} · ${modeLabel(modeId)}`
    : `${keys[0] ? keyDisplayLabel(keys[0], modeId) : ""} ${modeLabel(modeId)}`) + positionSuffix;
  results.dataset.layout = keys.length === 1 ? "single" : "multi";
  results.replaceChildren(...keys.map((key, index) => makeCard(key, index, mode, maxSemitone, scaleLength)));
  saveState();
}

function handleModeChange() {
  fillTonicOptions(getModeId(), tonicSelect.value);
  render();
}

function handleLanguageChange() {
  fillTonicOptions(getModeId(), tonicSelect.value);
  fillPositionOptions(positionSelect.value);
  render();
}

for (const modeInput of filters.querySelectorAll('input[name="mode"]')) {
  modeInput.addEventListener("change", handleModeChange);
}

languageSelect.addEventListener("change", handleLanguageChange);
tonicSelect.addEventListener("input", render);
tonicSelect.addEventListener("change", render);
positionSelect.addEventListener("input", render);
positionSelect.addEventListener("change", render);
filters.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});

resetButton.addEventListener("click", () => {
  filters.elements.mode.value = "major";
  updateStaticText();
  fillTonicOptions("major", "all");
  fillPositionOptions("all");
  render();
});

const saved = loadSavedState();
if (saved) {
  languageSelect.value = saved.lang;
  filters.elements.mode.value = saved.mode;
  updateStaticText();
  fillTonicOptions(saved.mode, saved.tonic);
  fillPositionOptions(saved.position);
} else {
  languageSelect.value = "zh-Hans";
  updateStaticText();
  fillTonicOptions("major", "all");
  fillPositionOptions("all");
}

render();
