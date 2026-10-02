// Indian vehicle registration number parser. Zero dependencies.
// src/index.cjs is generated from this file by scripts/build-cjs.js.

const STATE_LIST = [
  ["AN", "Andaman and Nicobar Islands"],
  ["AP", "Andhra Pradesh"],
  ["AR", "Arunachal Pradesh"],
  ["AS", "Assam"],
  ["BR", "Bihar"],
  ["CG", "Chhattisgarh"],
  ["CH", "Chandigarh"],
  ["DD", "Dadra and Nagar Haveli and Daman and Diu"],
  ["DL", "Delhi"],
  ["GA", "Goa"],
  ["GJ", "Gujarat"],
  ["HP", "Himachal Pradesh"],
  ["HR", "Haryana"],
  ["JH", "Jharkhand"],
  ["JK", "Jammu and Kashmir"],
  ["KA", "Karnataka"],
  ["KL", "Kerala"],
  ["LA", "Ladakh"],
  ["LD", "Lakshadweep"],
  ["MH", "Maharashtra"],
  ["ML", "Meghalaya"],
  ["MN", "Manipur"],
  ["MP", "Madhya Pradesh"],
  ["MZ", "Mizoram"],
  ["NL", "Nagaland"],
  ["OD", "Odisha"],
  ["PB", "Punjab"],
  ["PY", "Puducherry"],
  ["RJ", "Rajasthan"],
  ["SK", "Sikkim"],
  ["TG", "Telangana"],
  ["TN", "Tamil Nadu"],
  ["TR", "Tripura"],
  ["UK", "Uttarakhand"],
  ["UP", "Uttar Pradesh"],
  ["WB", "West Bengal"],
  // Codes that are no longer issued but still appear on older vehicles.
  ["DN", "Dadra and Nagar Haveli", true],
  ["OR", "Odisha", true],
  ["TS", "Telangana", true],
  ["UA", "Uttarakhand", true]
];

export const STATES = Object.freeze(
  Object.fromEntries(
    STATE_LIST.map(([code, name, legacy = false]) => [code, Object.freeze({ name, legacy })])
  )
);

// Matched against the input with separators kept, so "GJ 5 1234" reads as RTO 5
// rather than RTO 51. Without separators the RTO takes up to two digits.
const SEP = "[ .-]*";
const STANDARD = new RegExp(`^([A-Z]{2})${SEP}(\\d{1,2})${SEP}((?:[A-Z]${SEP}){0,3})(\\d{1,4})$`);
const BH = new RegExp(`^(\\d{2})${SEP}BH${SEP}(\\d{4})${SEP}([A-Z]{1,2})$`);
// The Bharat series was introduced in 2021.
const BH_FIRST_YEAR = 21;

function clean(input) {
  if (typeof input !== "string") return null;
  return input.trim().toUpperCase().replace(/\s+/g, " ");
}

const strip = (s) => s.replace(/[ .-]/g, "");

export function parse(input) {
  const s = clean(input);
  if (!s) return null;

  const bh = BH.exec(s);
  if (bh) {
    const [, yy, number, series] = bh;
    const normalized = `${yy}BH${number}${series}`;
    if (Number(yy) < BH_FIRST_YEAR || Number(number) === 0) return null;
    return {
      type: "bh",
      normalized,
      formatted: `${yy} BH ${number} ${series}`,
      year: 2000 + Number(yy),
      number,
      series
    };
  }

  const m = STANDARD.exec(s);
  if (!m) return null;
  const [, state, rto, rawSeries, number] = m;
  const series = strip(rawSeries);
  const info = STATES[state];
  if (!info || Number(rto) === 0 || Number(number) === 0) return null;
  return {
    type: "standard",
    normalized: `${state}${rto}${series}${number}`,
    formatted: [state, rto, series, number].filter(Boolean).join(" "),
    state,
    stateName: info.name,
    legacy: info.legacy,
    rto,
    series,
    number
  };
}

export function isValid(input) {
  return parse(input) !== null;
}

export function normalize(input) {
  return parse(input)?.normalized ?? null;
}

export function format(input) {
  return parse(input)?.formatted ?? null;
}

export function getStateName(code) {
  if (typeof code !== "string") return null;
  return STATES[code.toUpperCase()]?.name ?? null;
}
