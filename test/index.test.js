import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { parse, isValid, normalize, format, getStateName, STATES } from "../src/index.js";

const require = createRequire(import.meta.url);

test("parses a standard registration number", () => {
  assert.deepEqual(parse("MH12AB1234"), {
    type: "standard",
    normalized: "MH12AB1234",
    formatted: "MH 12 AB 1234",
    state: "MH",
    stateName: "Maharashtra",
    legacy: false,
    rto: "12",
    series: "AB",
    number: "1234"
  });
});

test("accepts spaces, dashes, dots and lowercase", () => {
  for (const input of ["mh 12 ab 1234", "MH-12-AB-1234", "MH.12.AB.1234", "  Mh12 ab-1234 "]) {
    assert.equal(normalize(input), "MH12AB1234", input);
  }
});

test("handles single-letter, empty and three-letter series", () => {
  assert.equal(parse("KA01M4321").series, "M");
  assert.equal(parse("GJ 5 1234").series, "");
  assert.equal(parse("GJ 5 1234").formatted, "GJ 5 1234");
  assert.equal(parse("DL 3C AB 1234").series, "CAB");
  assert.equal(parse("DL 3C AB 1234").rto, "3");
});

test("parses Bharat (BH) series numbers", () => {
  assert.deepEqual(parse("22 BH 1234 AA"), {
    type: "bh",
    normalized: "22BH1234AA",
    formatted: "22 BH 1234 AA",
    year: 2022,
    number: "1234",
    series: "AA"
  });
  assert.equal(parse("21BH0001A").series, "A");
});

test("rejects BH numbers from before the scheme started in 2021", () => {
  assert.equal(parse("20BH1234AA"), null);
});

test("flags legacy state codes", () => {
  const r = parse("OR 02 AB 1234");
  assert.equal(r.stateName, "Odisha");
  assert.equal(r.legacy, true);
  assert.equal(parse("TS09AB1234").legacy, true);
  assert.equal(parse("TG09AB1234").legacy, false);
});

test("rejects invalid input", () => {
  for (const input of ["", "XX12AB1234", "MH00AB1234", "MH12AB0000", "MH12AB12345", "MH12ABCD1234", "MH", 42, null, undefined, "MH12 AB 12#4"]) {
    assert.equal(parse(input), null, String(input));
    assert.equal(isValid(input), false, String(input));
  }
});

test("normalize and format return null for invalid input", () => {
  assert.equal(normalize("nope"), null);
  assert.equal(format("nope"), null);
  assert.equal(format("mh12ab1234"), "MH 12 AB 1234");
});

test("getStateName is case-insensitive and returns null for unknown codes", () => {
  assert.equal(getStateName("ka"), "Karnataka");
  assert.equal(getStateName("ZZ"), null);
  assert.equal(getStateName(undefined), null);
});

test("STATES is frozen", () => {
  assert.ok(Object.isFrozen(STATES));
  assert.equal(STATES.DL.name, "Delhi");
});

test("CommonJS build exposes the same API", () => {
  const cjs = require("../src/index.cjs");
  assert.deepEqual(cjs.parse("MH12AB1234"), parse("MH12AB1234"));
  assert.equal(cjs.isValid("22BH1234AA"), true);
});
