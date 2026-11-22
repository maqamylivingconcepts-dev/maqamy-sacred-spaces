import { describe, it as test } from "node:test";
import { strict as assert } from "node:assert";
import { BANNER_TITLE_MAX, joinBannerTitle, splitBannerTitle } from "./banner-title";

describe("banner title and subtitle", () => {
  test("round-trips a title and subtitle through the single stored field", () => {
    const stored = joinBannerTitle("Syafi Naira", "MAQAMY™ · Virtual Brand Ambassador");
    assert.equal(stored, "Syafi Naira | MAQAMY™ · Virtual Brand Ambassador");
    assert.deepEqual(splitBannerTitle(stored), { title: "Syafi Naira", subtitle: "MAQAMY™ · Virtual Brand Ambassador" });
  });
  test("older single-line titles show as the title only", () => {
    assert.deepEqual(splitBannerTitle("SYAFI NAIRA - BRAND AMBASSADOR"), { title: "SYAFI NAIRA - BRAND AMBASSADOR", subtitle: "" });
    assert.deepEqual(splitBannerTitle(null), { title: "", subtitle: "" });
  });
  test("omits the separator without a subtitle and strips stray separators", () => {
    assert.equal(joinBannerTitle(" Launch ", ""), "Launch");
    assert.equal(joinBannerTitle("A|B", "C"), "AB | C");
  });
  test("both fields at their limits fit the stored column", () => {
    assert.ok(joinBannerTitle("x".repeat(60), "y".repeat(BANNER_TITLE_MAX - 63)).length <= BANNER_TITLE_MAX);
  });
});
