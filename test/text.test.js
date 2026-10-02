import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify, truncate } from "../src/text.js";

test("slugify makes URL-friendly names", () => {
  assert.equal(slugify("Hello, World!"), "hello-world");
  assert.equal(slugify("  Café Tour 2026 "), "cafe-tour-2026");
});

test("truncate shortens long text with an ellipsis", () => {
  assert.equal(truncate("short", 10), "short");
  assert.equal(truncate("a rather long sentence", 10), "a rather…");
});
