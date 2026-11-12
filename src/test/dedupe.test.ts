import { describe, expect, it } from "vitest";
import { findDuplicate, nameSimilarity } from "@/lib/dedupe";

const db = [
  { id: "1", name: "Pradhan Mantri Kaushal Vikas Yojana", level: "central" },
  { id: "2", name: "Pudhumai Penn Scheme", level: "state" },
  { id: "3", name: "Post Matric Scholarship for SC Students", level: "central" },
];
describe("duplicate detection", () => {
  it("matches abbreviation PM for Pradhan Mantri", () => expect(findDuplicate({ name: "PM Kaushal Vikas Yojna" }, db)?.id).toBe("1"));
  it("matches acronym", () => expect(findDuplicate({ name: "PMKVY" }, db)?.id).toBe("1"));
  it("matches minor spelling/format differences", () => expect(findDuplicate({ name: "Pudhumai  Pen scheme", level: "state" }, db)?.id).toBe("2"));
  it("matches via alternate name", () => expect(findDuplicate({ name: "Moovalur Ramamirtham", alt_names: ["Pudhumai Penn"] }, db)?.id).toBe("2"));
  it("does not merge different scholarships", () => expect(findDuplicate({ name: "Pre Matric Scholarship for ST Students" }, db)).toBeNull());
  it("scores identical names as 1", () => expect(nameSimilarity("The PM-Kisan Scheme", "pm kisan")).toBe(1));
});
