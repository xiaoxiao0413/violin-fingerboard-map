const SCALE_LENGTH_DEFAULT = 325;
const FINGERBOARD_LENGTH_DEFAULT = 270;
const MAX_SEMITONE = 24;
const STORAGE_KEY = "violin-formula-fingerboard-v1";

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];
const LETTER_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

const MODES = {
  major: {
    label: "大调",
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
    label: "小调",
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
  "#0b7887",
  "#bd4f6c",
  "#5c7cfa",
  "#d97706",
  "#5f7f39",
  "#b13d75",
  "#2f8f83",
  "#7b61c7",
  "#c65d32",
  "#2d6a9f",
  "#9b6b20",
  "#50724f",
  "#bc5274",
  "#397c89",
  "#8a6a39",
];

const filters = document.querySelector("#filters");
const tonicSelect = document.querySelector("#tonic");
const resultTitle = document.querySelector("#result-title");
const formulaNote = document.querySelector("#formula-note");
const results = document.querySelector("#results");
const resetButton = document.querySelector("#reset");

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

    return {
      degree: index + 1,
      interval,
      pc,
      label: `${letter}${accidentalText(accidental)}`,
    };
  });
}

function getModeId() {
  const value = new FormData(filters).get("mode");
  return MODES[value] ? value : "major";
}

function getMode() {
  return MODES[getModeId()] || MODES.major;
}

function fillTonicOptions(modeId, preferredValue = "all") {
  const keys = MODES[modeId].keys;
  tonicSelect.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "全部调";
  tonicSelect.append(allOption);

  for (const key of keys) {
    const option = document.createElement("option");
    option.value = key.id;
    option.textContent = key.label;
    tonicSelect.append(option);
  }

  tonicSelect.value = preferredValue === "all" || keys.some((key) => key.id === preferredValue)
    ? preferredValue
    : "all";
}

function loadSavedState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return null;

    const modeId = ["naturalMinor", "harmonicMinor", "melodicMinor"].includes(saved.mode)
      ? "minor"
      : MODES[saved.mode] ? saved.mode : "major";
    return {
      mode: modeId,
      tonic: typeof saved.tonic === "string" ? saved.tonic : "all",
    };
  } catch {
    return null;
  }
}

function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        mode: getModeId(),
        tonic: tonicSelect.value,
      })
    );
  } catch {
    /* localStorage 不可用时忽略。 */
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

    markers.push({
      ...note,
      semitone,
      distanceMm: fingerDistanceMm(semitone, scaleLength),
      isOpen: semitone === 0,
    });
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

function makeFingerboardSvg(key, keyIndex, mode, maxSemitone, scaleLength) {
  const scale = buildScale(key, mode);
  const scaleMap = scaleByPitchClass(scale);
  const width = 420;
  const top = 112;
  const stringGap = 62;
  const left = 116;
  const boardHeight = 620;
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

  const yFor = (semitone) => {
    const distance = fingerDistanceMm(semitone, scaleLength);
    return top + (distance / xMax) * boardHeight;
  };

  const parts = [];
  parts.push(`<svg class="fingerboard-svg" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img">`);
  parts.push(`<title>${escapeXml(key.label)}${mode.label}小提琴指板公式图</title>`);
  parts.push(`<rect x="0" y="0" width="${width}" height="${height}" rx="18" fill="#fffdf6"/>`);
  parts.push(`<rect x="${boardLeft}" y="${boardTop}" width="${boardRight - boardLeft}" height="${boardBottom - boardTop}" rx="28" fill="#2a211d"/>`);
  parts.push(`<rect x="${boardLeft + 8}" y="${boardTop + 8}" width="${boardRight - boardLeft - 16}" height="${boardBottom - boardTop - 16}" rx="21" fill="#3b2c25"/>`);
  parts.push(`<line x1="${boardLeft + 12}" y1="${top}" x2="${boardRight - 12}" y2="${top}" stroke="#f4ead9" stroke-width="9" stroke-linecap="round"/>`);
  parts.push(`<line x1="${boardLeft + 16}" y1="${fingerboardEndY.toFixed(2)}" x2="${boardRight - 16}" y2="${fingerboardEndY.toFixed(2)}" stroke="#1c1512" stroke-width="5" stroke-linecap="round"/>`);
  parts.push(`<text x="${boardRight + 8}" y="${(fingerboardEndY + 4).toFixed(2)}" text-anchor="start" font-size="12" font-weight="900" fill="#4b3d32">指板末端</text>`);
  parts.push(`<line x1="${boardLeft + 10}" y1="${bridgeY}" x2="${boardRight - 10}" y2="${bridgeY}" stroke="#d9a45f" stroke-width="10" stroke-linecap="round"/>`);
  parts.push(`<text x="${boardRight + 8}" y="${bridgeY + 4}" text-anchor="start" font-size="13" font-weight="900" fill="#8a5a20">琴码</text>`);
  parts.push(`<line x1="48" y1="${top}" x2="48" y2="${bridgeY}" stroke="#0b7887" stroke-width="2"/>`);
  parts.push(`<line x1="42" y1="${top}" x2="54" y2="${top}" stroke="#0b7887" stroke-width="2"/>`);
  parts.push(`<line x1="42" y1="${bridgeY}" x2="54" y2="${bridgeY}" stroke="#0b7887" stroke-width="2"/>`);
  parts.push(`<text x="36" y="${top + boardHeight / 2}" text-anchor="middle" font-size="13" font-weight="900" fill="#0b7887" transform="rotate(-90 36 ${top + boardHeight / 2})">L0 = ${scaleLength} mm</text>`);
  parts.push(`<text x="74" y="${(top + (fingerboardEndY - top) / 2).toFixed(2)}" text-anchor="middle" font-size="12" font-weight="800" fill="#4b3d32" transform="rotate(-90 74 ${(top + (fingerboardEndY - top) / 2).toFixed(2)})">指板约 ${FINGERBOARD_LENGTH_DEFAULT} mm</text>`);
  parts.push(`<text x="48" y="${top - 14}" text-anchor="middle" font-size="12" font-weight="800" fill="#6a5a4d">上枕</text>`);

  for (let semitone = 0; semitone <= maxSemitone; semitone += 1) {
    const y = yFor(semitone);
    const strong = semitone % 12 === 0;
    parts.push(
      `<line x1="${boardLeft + 14}" y1="${y.toFixed(2)}" x2="${boardRight - 14}" y2="${y.toFixed(2)}" stroke="#f8efe2" stroke-opacity="${strong ? 0.34 : 0.15}" stroke-width="${strong ? 2 : 1}"/>`
    );
    if (semitone % 12 === 0) {
      parts.push(`<text x="${boardLeft - 18}" y="${(y + 4).toFixed(2)}" text-anchor="middle" font-size="13" font-weight="700" fill="#6a5a4d">${semitone}</text>`);
    }
  }

  for (const line of FINGER_LINES) {
    if (line.semitone > maxSemitone) continue;

    const y = yFor(line.semitone);
    parts.push(
      `<line x1="${boardLeft + 14}" y1="${y.toFixed(2)}" x2="${boardRight - 14}" y2="${y.toFixed(2)}" stroke="#f4bd27" stroke-opacity="0.92" stroke-width="2.5" stroke-dasharray="7 6"/>`
    );
    parts.push(`<rect x="${boardRight + 8}" y="${(y - 12).toFixed(2)}" width="42" height="24" rx="12" fill="#f4bd27" stroke="#9b6b20" stroke-width="1"/>`);
    parts.push(`<text x="${boardRight + 29}" y="${(y + 4).toFixed(2)}" text-anchor="middle" font-size="12" font-weight="900" fill="#36240f">${line.finger}指</text>`);
  }

  for (let i = 0; i < STRINGS.length; i += 1) {
    const string = STRINGS[i];
    const x = xs[i];
    const markers = noteMarkersForString(string, scaleMap, maxSemitone, scaleLength);

    parts.push(`<text x="${x}" y="${top - 52}" text-anchor="middle" font-size="22" font-weight="900" fill="#16202a">${string.name}</text>`);
    parts.push(`<text x="${x}" y="${top - 34}" text-anchor="middle" font-size="12" font-weight="800" fill="#7a6b5e">${string.openLabel}</text>`);
    parts.push(
      `<line x1="${x}" y1="${top}" x2="${x}" y2="${bridgeY}" stroke="#e8d8bf" stroke-width="${string.width}" stroke-linecap="round"/>`
    );

    for (const marker of markers) {
      const y = yFor(marker.semitone);
      const isTonic = marker.degree === 1;
      const radius = maxSemitone > 17 ? 9.5 : 12.5;
      const labelSize = marker.label.length > 2 ? 8.5 : 10.5;
      const fill = isTonic ? "#14191f" : keyColor;
      const text = isTonic ? "#ffffff" : "#fffdf6";

      parts.push(`<g class="note-dot">`);
      parts.push(
        `<title>${escapeXml(`${string.name}弦 ${marker.label}，音级${marker.degree}，n=${marker.semitone}，距上枕 ${marker.distanceMm.toFixed(1)} mm`)}</title>`
      );
      parts.push(
        `<circle cx="${x}" cy="${y.toFixed(2)}" r="${radius}" fill="${fill}" stroke="#fff7ec" stroke-width="2.2"/>`
      );
      parts.push(
        `<text x="${x}" y="${(y + 3.4).toFixed(2)}" text-anchor="middle" font-size="${labelSize}" font-weight="900" fill="${text}">${escapeXml(marker.label)}</text>`
      );
      parts.push(`</g>`);
    }
  }

  parts.push(`<text x="28" y="28" font-size="18" font-weight="900" fill="#16202a">${escapeXml(key.label)} ${mode.label}</text>`);
  parts.push("</svg>");
  return parts.join("");
}

function makeCard(key, keyIndex, mode, maxSemitone, scaleLength) {
  const scale = buildScale(key, mode);
  const card = document.createElement("article");
  card.className = "diagram-card formula-card";

  const header = document.createElement("div");
  header.className = "formula-card-head";

  const title = document.createElement("h3");
  title.textContent = `${key.label} ${mode.label}`;

  const scaleLine = document.createElement("p");
  scaleLine.textContent = scale.map((note) => note.label).join(" ");

  const media = document.createElement("div");
  media.className = "fingerboard-media";
  media.innerHTML = makeFingerboardSvg(key, keyIndex, mode, maxSemitone, scaleLength);
  media.tabIndex = 0;
  media.setAttribute("role", "img");
  media.setAttribute("aria-label", `${key.label}${mode.label}小提琴指板公式图`);
  media.title = "点击放大";
  media.addEventListener("click", () => openLightbox(key, keyIndex, mode, maxSemitone, scaleLength));
  media.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(key, keyIndex, mode, maxSemitone, scaleLength);
    }
  });

  const meta = document.createElement("p");
  meta.className = "formula-meta";
  meta.textContent = "完整指板";

  header.append(title, scaleLine);
  card.append(header, media, meta);
  return card;
}

const lightbox = document.createElement("dialog");
lightbox.className = "lightbox";
lightbox.innerHTML =
  '<button class="lightbox-close" type="button" aria-label="关闭">×</button>' +
  '<figure><div class="lightbox-media"></div><figcaption></figcaption></figure>';
document.body.append(lightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target.closest(".lightbox-close")) {
    lightbox.close();
  }
});

function openLightbox(key, keyIndex, mode, maxSemitone, scaleLength) {
  const media = lightbox.querySelector(".lightbox-media");
  media.innerHTML = makeFingerboardSvg(key, keyIndex, mode, maxSemitone, scaleLength);
  lightbox.querySelector("figcaption").textContent = `${key.label} ${mode.label}`;
  lightbox.showModal();
}

function render() {
  const modeId = getModeId();
  const mode = getMode();
  const keys = selectedKeys(modeId);
  const maxSemitone = MAX_SEMITONE;
  const scaleLength = SCALE_LENGTH_DEFAULT;

  resultTitle.textContent = tonicSelect.value === "all"
    ? `全部调 ${mode.label}`
    : `${keys[0]?.label || ""} ${mode.label}`;
  formulaNote.textContent = "完整指板";
  results.dataset.layout = keys.length === 1 ? "single" : "multi";
  results.replaceChildren(...keys.map((key, index) => makeCard(key, index, mode, maxSemitone, scaleLength)));
  saveState();
}

function handleModeChange() {
  fillTonicOptions(getModeId(), tonicSelect.value);
  render();
}

for (const modeInput of filters.querySelectorAll('input[name="mode"]')) {
  modeInput.addEventListener("change", handleModeChange);
}

tonicSelect.addEventListener("input", render);
tonicSelect.addEventListener("change", render);

filters.addEventListener("submit", (event) => {
  event.preventDefault();
  render();
});

resetButton.addEventListener("click", () => {
  filters.elements.mode.value = "major";
  fillTonicOptions("major", "all");
  render();
});

const saved = loadSavedState();
if (saved) {
  filters.elements.mode.value = saved.mode;
  fillTonicOptions(saved.mode, saved.tonic);
} else {
  fillTonicOptions("major", "all");
}

render();
