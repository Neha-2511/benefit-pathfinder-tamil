import { describe, expect, it } from "vitest";
import { findDuplicates, outdatedReasons } from "@/lib/quality";

const base = { status: "active", last_verified: "2026-10-01", deadline: null, link_status: 200 };
const today = new Date("2026-11-06");

describe("quality", () => {
  it("groups schemes whose names match ignoring case and brackets", () => {
    const d = findDuplicates([
      { ...base, id: "1", name: "PM Kisan (Central)" },
      { ...base, id: "2", name: "pm kisan" },
      { ...base, id: "3", name: "Pudhumai Penn" },
    ]);
    expect(d.map((g) => g.map((s) => s.id))).toEqual([["1", "2"]]);
  });
  it("flags verification older than 365 days", () => {
    expect(outdatedReasons({ ...base, id: "1", name: "x", last_verified: "2025-10-01" }, today)).toContain("Verified over a year ago");
  });
  it("flags active schemes past their deadline", () => {
    expect(outdatedReasons({ ...base, id: "1", name: "x", deadline: "2026-01-01" }, today)).toContain("Deadline passed but marked active");
  });
  it("does not flag a recently verified scheme", () => {
    expect(outdatedReasons({ ...base, id: "1", name: "x" }, today)).toEqual([]);
  });
});
