import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDuration } from "../src/time.js";

test("formatDuration formats seconds, minutes and hours", () => {
  const cases = [
    [0, "0s"],
    [42, "42s"],
    [60, "1m 00s"],
    [303, "5m 03s"],
    [3600, "1h 00m"],
    [7505, "2h 05m"],
    [90061, "25h 01m"],
  ];
  for (const [input, expected] of cases) {
    assert.equal(formatDuration(input), expected);
  }
});

test("formatDuration handles unit boundaries", () => {
  assert.equal(formatDuration(59), "59s");
  assert.equal(formatDuration(3599), "59m 59s");
});

test("formatDuration throws TypeError for invalid input", () => {
  for (const bad of [-1, 1.5, NaN, Infinity, "42", null, undefined, {}, [], true]) {
    assert.throws(() => formatDuration(bad), TypeError);
  }
});
