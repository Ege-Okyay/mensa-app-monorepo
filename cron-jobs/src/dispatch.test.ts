import { expect, test } from 'bun:test';
import { buildDispatchBody, buildDispatchUrl } from './dispatch';

test("builds dispatch url", () => {
  expect(buildDispatchUrl("https://api.github.com", "o", "r", "w.yml")).toBe(
    "https://api.github.com/repos/o/r/actions/workflows/w.yml/dispatches"
  );
});

test("builds dispatch body from ref", () => {
  expect(buildDispatchBody("dev")).toBe(JSON.stringify({ ref: "dev" }));
});
