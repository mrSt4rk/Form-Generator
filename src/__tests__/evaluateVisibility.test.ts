import { describe, it, expect } from "vitest";
import { evaluateVisibility, type FormValues } from "@/util/visibility";
import type { ConditionGroup } from "@/types";

describe("evaluateVisibility", () => {
  it("returns true when no group", () => {
    const res = evaluateVisibility(undefined, {} as FormValues);
    expect(res).toBe(true);
  });

  it("AND: all conditions must match", () => {
    const group: ConditionGroup = {
      op: "AND",
      conditions: [
        { targetElementId: "country", valueToMatch: "BE" },
        { targetElementId: "topics", valueToMatch: "music" },
      ],
    };
    const values: FormValues = { country: "BE", topics: ["tech", "music"] };
    expect(evaluateVisibility(group, values)).toBe(true);
    expect(evaluateVisibility(group, { country: "BE", topics: ["tech"] })).toBe(false);
  });

  it("OR: at least one condition must match", () => {
    const group: ConditionGroup = {
      op: "OR",
      conditions: [
        { targetElementId: "employment", valueToMatch: "student" },
        { targetElementId: "hasCoupon", valueToMatch: "yes" },
      ],
    };
    expect(evaluateVisibility(group, { employment: "student" })).toBe(true);
    expect(evaluateVisibility(group, { hasCoupon: true })).toBe(true);
    expect(evaluateVisibility(group, { employment: "other", hasCoupon: false })).toBe(false);
  });
});