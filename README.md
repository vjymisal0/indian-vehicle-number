# indian-vehicle-number

Validate, parse and format Indian vehicle registration numbers, including Bharat (BH) series. Zero runtime dependencies, ESM and CommonJS, TypeScript types included.

## Install

```sh
npm install indian-vehicle-number
```

## Usage

```js
import { parse, isValid, normalize, format, getStateName } from "indian-vehicle-number";

parse("mh-12-ab-1234");
// {
//   type: "standard",
//   normalized: "MH12AB1234",
//   formatted: "MH 12 AB 1234",
//   state: "MH",
//   stateName: "Maharashtra",
//   legacy: false,
//   rto: "12",
//   series: "AB",
//   number: "1234"
// }

parse("22 BH 1234 AA");
// { type: "bh", normalized: "22BH1234AA", formatted: "22 BH 1234 AA", year: 2022, number: "1234", series: "AA" }

isValid("XX12AB1234"); // false (unknown state code)
normalize("ka 01 m 4321"); // "KA01M4321"
format("KA01M4321"); // "KA 01 M 4321"
getStateName("tg"); // "Telangana"
```

CommonJS:

```js
const { parse } = require("indian-vehicle-number");
```

## API

| Function | Returns |
| --- | --- |
| `parse(input)` | A `standard` or `bh` object, or `null` if invalid |
| `isValid(input)` | `boolean` |
| `normalize(input)` | Compact uppercase form, or `null` |
| `format(input)` | Spaced form, or `null` |
| `getStateName(code)` | State/UT name, or `null` |
| `STATES` | Frozen map of code to `{ name, legacy }` |

Input may use spaces, dashes or dots and any letter case.

## Rules

- **Standard:** `SS RR XXX NNNN`: a known state/UT code, a 1–2 digit RTO code (not `00`), 0–3 series letters, and a 1–4 digit number (not `0000`).
- **BH series:** `YY BH NNNN XX`: year `21` or later (the scheme started in 2021), 4 digits, 1–2 letters.
- **Legacy codes** (`OR`, `TS`, `UA`, `DN`) are accepted and flagged with `legacy: true`.
- Write the number with spaces when the RTO code is a single digit: `GJ51234` is read as RTO `51`, while `GJ 5 1234` is read as RTO `5`.

## Not covered

Defence (arrow) plates, diplomatic plates (`CD`, `CC`, `UN`), temporary registrations and trade certificates are not recognised. RTO office names are not included.

## License

MIT
