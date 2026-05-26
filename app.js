const ranks = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

const tableFormats = {
  5: {
    title: "5-max",
    positions: ["HJ", "CO", "BTN", "SB", "BB"],
    loosen: ["A8o", "K9o", "QTo", "J9o", "T9o", "K7s", "Q8s", "T7s", "96s"],
    note: "Tavolo corto: i blind arrivano spesso, quindi le posizioni late e blind si giocano piu larghe.",
  },
  6: {
    title: "6-max",
    positions: ["UTG", "HJ", "CO", "BTN", "SB", "BB"],
    loosen: ["A9o", "KTo", "QTo", "JTo", "K8s", "Q9s", "T8s"],
    note: "Formato standard online: range aggressivi ma ancora disciplinati dalle prime posizioni.",
  },
  8: {
    title: "8-max",
    positions: ["UTG", "UTG+1", "MP", "HJ", "CO", "BTN", "SB", "BB"],
    tightenEarly: ["A9s", "KQo", "T9s", "66", "AJo", "KJs"],
    note: "Tavolo quasi full ring: le prime posizioni richiedono mani piu solide.",
  },
  9: {
    title: "9-max",
    positions: ["UTG", "UTG+1", "MP", "LJ", "HJ", "CO", "BTN", "SB", "BB"],
    tightenEarly: ["A9s", "KQo", "T9s", "66", "AJo", "KJs", "QJs"],
    note: "Full ring: piu giocatori dietro, quindi EP/MP devono essere piu selettive.",
  },
};

const positionProfiles = {
  UTG: {
    title: "UTG - range stretta",
    note: "Apri forte e lascia perdere molte mani marginali: fuori posizione il margine conta.",
    notes: ["Coppie alte e broadway suited sono prioritarie.", "Evita call passivi con mani dominate.", "Adatta contro tavoli molto tight."],
    raise: ["AA", "KK", "QQ", "JJ", "TT", "99", "AKs", "AQs", "AJs", "ATs", "KQs", "AKo", "AQo"],
    call: ["88", "77", "KJs", "QJs", "JTs"],
    mix: ["A9s", "KQo", "T9s", "66"],
  },
  "UTG+1": {
    extends: "UTG",
    title: "UTG+1 - pressione selettiva",
    note: "Una tacca piu larga di UTG, ma ancora con molti giocatori che possono reagire.",
    addRaise: ["88", "KJs"],
    addMix: ["A8s", "QJs", "JTs"],
  },
  MP: {
    extends: "HJ",
    title: "Middle Position - equilibrio",
    note: "Range intermedio: puoi aprire piu mani rispetto a UTG, senza diventare loose come cutoff.",
    removeRaise: ["AJo", "KQo"],
    addCall: ["88", "77"],
  },
  LJ: {
    extends: "HJ",
    title: "Lojack - transizione",
    note: "In full ring e' la prima posizione davvero flessibile, ma cutoff e bottone restano pericolosi.",
    addRaise: ["66", "KTs"],
    addMix: ["A8s", "QTs"],
  },
  HJ: {
    title: "Hijack - pressione controllata",
    note: "Puoi allargare il range, ma tieni d'occhio cutoff e bottone ancora dietro.",
    notes: ["Aggiungi suited connector solidi.", "Le coppie medie giocano bene in raise.", "Riduci i bluff se i blind 3-bettano spesso."],
    raise: ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "AKs", "AQs", "AJs", "ATs", "A9s", "KQs", "KJs", "QJs", "JTs", "T9s", "AKo", "AQo", "AJo", "KQo"],
    call: ["66", "55", "KTs", "QTs", "J9s", "98s"],
    mix: ["A8s", "A7s", "KJo", "QJo", "87s"],
  },
  CO: {
    title: "Cutoff - apri il gioco",
    note: "Qui la posizione inizia a pesare: rubare blind diventa parte importante del piano.",
    notes: ["Apri molte mani suited con buona giocabilita.", "Isola i limper con mani che dominano il loro range.", "Contro bottone aggressivo stringi leggermente."],
    raise: ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "KQs", "KJs", "KTs", "QJs", "QTs", "JTs", "J9s", "T9s", "98s", "87s", "AKo", "AQo", "AJo", "ATo", "KQo", "KJo", "QJo"],
    call: ["44", "33", "22", "A6s", "A5s", "K9s", "T8s", "97s", "76s"],
    mix: ["A9o", "QTo", "JTo", "65s", "54s"],
  },
  BTN: {
    title: "Button - massima posizione",
    note: "La posizione migliore consente range larghi, steal frequenti e tante mani speculative.",
    notes: ["Apri spesso se i blind foldano troppo.", "Le mani suited basse diventano piu redditizie.", "Riduci gli open marginali contro blind aggressivi."],
    raise: ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44", "33", "22", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KJs", "KTs", "K9s", "K8s", "QJs", "QTs", "Q9s", "JTs", "J9s", "J8s", "T9s", "T8s", "98s", "97s", "87s", "86s", "76s", "65s", "54s", "AKo", "AQo", "AJo", "ATo", "A9o", "KQo", "KJo", "KTo", "QJo", "QTo", "JTo"],
    call: ["K7s", "Q8s", "T7s", "96s", "75s", "64s", "53s"],
    mix: ["A8o", "A7o", "K9o", "J9o", "T9o", "43s"],
  },
  SB: {
    title: "Small Blind - fuori posizione",
    note: "Range abbastanza largo, ma senza posizione postflop: preferisci raise chiari a call deboli.",
    notes: ["3-betta polarizzato contro steal frequenti.", "Completa solo se il BB non punisce.", "Evita mani offsuit dominate."],
    raise: ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A5s", "KQs", "KJs", "KTs", "QJs", "QTs", "JTs", "T9s", "98s", "AKo", "AQo", "AJo", "KQo"],
    call: ["66", "55", "44", "A7s", "A6s", "A4s", "A3s", "A2s", "K9s", "Q9s", "J9s", "87s", "76s", "65s"],
    mix: ["ATo", "KJo", "QJo", "JTo", "54s"],
  },
  BB: {
    title: "Big Blind - difesa",
    note: "Difendi in base alla size avversaria: la chart qui rappresenta una difesa media contro open standard.",
    notes: ["Chiama di piu contro small open.", "3-betta per valore le premium.", "Le mani suited realizzano meglio equity."],
    raise: ["AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "KQs", "AKo", "AQo"],
    call: ["99", "88", "77", "66", "55", "44", "33", "22", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KJs", "KTs", "K9s", "QJs", "QTs", "JTs", "T9s", "98s", "87s", "76s", "65s", "54s", "AJo", "ATo", "KQo", "KJo", "QJo", "JTo"],
    mix: ["K8s", "Q9s", "J9s", "T8s", "97s", "86s", "75s", "64s", "53s"],
  },
};

const stackProfiles = [
  {
    max: 20,
    title: "10-20 BB",
    note: "Stack corto: meno call speculativi, piu mani da raise deciso o push/fold.",
    promoteCallToRaise: ["99", "88", "77", "66", "AJs", "ATs", "KQs", "AQo", "AJo"],
    removeCall: ["22", "33", "44", "54s", "64s", "75s", "86s", "96s", "T7s", "K7s", "Q8s", "53s", "43s"],
    removeMix: ["65s", "54s", "43s", "A7o", "A8o", "K9o", "J9o", "T9o"],
    addMix: ["A5s", "A4s", "KQo", "KJs"],
  },
  {
    max: 35,
    title: "25-35 BB",
    note: "Stack medio-corto: taglia i call fragili e sposta piu mani buone in aggressione.",
    promoteCallToRaise: ["99", "88", "77", "AJs", "KQs", "AQo"],
    removeCall: ["22", "33", "54s", "64s", "75s", "96s", "T7s"],
    removeMix: ["43s", "A7o", "K9o"],
    addMix: ["A5s", "KQo"],
  },
  {
    max: 60,
    title: "40-60 BB",
    note: "Stack intermedio: buon equilibrio tra raise, difesa e qualche call con giocabilita.",
    promoteCallToRaise: ["99", "88"],
    removeCall: ["53s", "43s"],
    addMix: ["A5s", "KTs"],
  },
  {
    max: 100,
    title: "65-100 BB",
    note: "Stack deep: puoi mantenere piu call speculativi e sfruttare implied odds postflop.",
    addCall: ["22", "33", "44", "65s", "54s", "76s", "87s"],
    addMix: ["A5s", "A4s", "K9s", "Q9s"],
  },
];

const tableSelect = document.querySelector("#tableSelect");
const positionSelect = document.querySelector("#positionSelect");
const stackSlider = document.querySelector("#stackSlider");
const stackValue = document.querySelector("#stackValue");
const handGrid = document.querySelector("#handGrid");
const scenarioTitle = document.querySelector("#scenarioTitle");
const scenarioNote = document.querySelector("#scenarioNote");
const selectedHand = document.querySelector("#selectedHand");
const selectedAction = document.querySelector("#selectedAction");
const quickNotes = document.querySelector("#quickNotes");

let selected = "AA";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

function buildHand(rowIndex, colIndex) {
  const first = ranks[rowIndex];
  const second = ranks[colIndex];

  if (rowIndex === colIndex) return `${first}${second}`;
  if (rowIndex < colIndex) return `${first}${second}s`;
  return `${second}${first}o`;
}

function cloneProfile(profile) {
  if (profile.extends) {
    const base = cloneProfile(positionProfiles[profile.extends]);
    return mergeProfile(base, profile);
  }

  return {
    title: profile.title,
    note: profile.note,
    notes: [...(profile.notes ?? [])],
    raise: [...profile.raise],
    call: [...profile.call],
    mix: [...profile.mix],
  };
}

function mergeProfile(base, overrides) {
  const merged = {
    ...base,
    title: overrides.title ?? base.title,
    note: overrides.note ?? base.note,
    notes: overrides.notes ? [...overrides.notes] : [...base.notes],
    raise: [...base.raise],
    call: [...base.call],
    mix: [...base.mix],
  };

  addHands(merged, "raise", overrides.addRaise);
  addHands(merged, "call", overrides.addCall);
  addHands(merged, "mix", overrides.addMix);
  removeHands(merged, overrides.removeRaise, ["raise"]);
  removeHands(merged, overrides.removeCall, ["call"]);
  removeHands(merged, overrides.removeMix, ["mix"]);
  return merged;
}

function addHands(chart, action, hands = []) {
  hands.forEach((hand) => {
    removeHands(chart, [hand]);
    chart[action].push(hand);
  });
}

function removeHands(chart, hands = [], zones = ["raise", "call", "mix"]) {
  zones.forEach((zone) => {
    chart[zone] = chart[zone].filter((hand) => !hands.includes(hand));
  });
}

function moveHands(chart, from, to, hands = []) {
  const movable = chart[from].filter((hand) => hands.includes(hand));
  removeHands(chart, movable, [from, to]);
  chart[to].push(...movable);
}

function getStackProfile(stack) {
  return stackProfiles.find((profile) => stack <= profile.max);
}

function isEarlyPosition(position) {
  return ["UTG", "UTG+1", "MP", "LJ"].includes(position);
}

function buildChart() {
  const table = tableFormats[tableSelect.value];
  const stack = Number(stackSlider.value);
  const stackProfile = getStackProfile(stack);
  const position = positionSelect.value;
  const chart = cloneProfile(positionProfiles[position]);

  if (table.loosen && !isEarlyPosition(position)) {
    addHands(chart, "mix", table.loosen);
  }

  if (table.tightenEarly && isEarlyPosition(position)) {
    removeHands(chart, table.tightenEarly);
  }

  moveHands(chart, "call", "raise", stackProfile.promoteCallToRaise);
  addHands(chart, "call", stackProfile.addCall);
  addHands(chart, "mix", stackProfile.addMix);
  removeHands(chart, stackProfile.removeCall, ["call"]);
  removeHands(chart, stackProfile.removeMix, ["mix"]);

  chart.contextNote = `${table.note} ${stackProfile.note}`;
  chart.contextTitle = `${chart.title} - ${table.title}, ${stack} BB`;
  chart.notes = [
    ...chart.notes,
    stack <= 20 ? "Con 20 BB o meno, evita call senza piano: molte mani diventano push/fold." : "Piu stack hai, piu puoi usare mani suited e coppie basse con implied odds.",
    tableSelect.value === "5" ? "Nel 5-max i blind incidono di piu: difendi e ruba con frequenza maggiore." : "Con piu giocatori al tavolo, le prime posizioni vanno strette.",
  ];

  return chart;
}

function getAction(hand, chart) {
  if (chart.raise.includes(hand)) return "raise";
  if (chart.call.includes(hand)) return "call";
  if (chart.mix.includes(hand)) return "mix";
  return "fold";
}

function actionLabel(action) {
  return {
    raise: "Open / Raise",
    call: "Call",
    mix: "Mix: alterna raise, call o fold in base al tavolo",
    fold: "Fold",
  }[action];
}

function renderPositions() {
  const previousPosition = positionSelect.value;
  const positions = tableFormats[tableSelect.value].positions;

  positionSelect.replaceChildren(...positions.map((position) => {
    const option = document.createElement("option");
    option.value = position;
    option.textContent = position;
    return option;
  }));

  positionSelect.value = positions.includes(previousPosition) ? previousPosition : positions[Math.min(2, positions.length - 1)];
}

function renderChart() {
  renderPositions();
  stackValue.textContent = `${stackSlider.value} BB`;
  const chart = buildChart();

  scenarioTitle.textContent = chart.contextTitle;
  scenarioNote.textContent = `${chart.note} ${chart.contextNote}`;
  quickNotes.replaceChildren(...chart.notes.map((note) => {
    const item = document.createElement("li");
    item.textContent = note;
    return item;
  }));

  handGrid.replaceChildren();

  ranks.forEach((_, rowIndex) => {
    ranks.forEach((__, colIndex) => {
      const hand = buildHand(rowIndex, colIndex);
      const action = getAction(hand, chart);
      const cell = document.createElement("button");
      cell.className = `hand-cell ${action}`;
      cell.type = "button";
      cell.textContent = hand;
      cell.setAttribute("aria-label", `${hand}: ${actionLabel(action)}`);
      cell.title = `${hand}: ${actionLabel(action)}`;

      if (hand === selected) cell.classList.add("is-selected");

      cell.addEventListener("click", () => {
        selected = hand;
        renderChart();
      });

      handGrid.append(cell);
    });
  });

  updateSelected(chart);
}

function updateSelected(chart = buildChart()) {
  const action = getAction(selected, chart);
  selectedHand.textContent = selected;
  selectedAction.textContent = actionLabel(action);
}

tableSelect.addEventListener("change", renderChart);
positionSelect.addEventListener("change", renderChart);
stackSlider.addEventListener("input", renderChart);

renderChart();
