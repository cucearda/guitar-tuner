import { describe, it, expect } from "vitest";
import { centsDiff } from "./musicUtils.js";

describe("centsDiff", () => {
  it("returns 0 when frequencies are equal", () => {
    expect(centsDiff(440, 440)).toBeCloseTo(0);
  });

  it("returns 100 cents for one semitone up", () => {
    // One semitone = 2^(1/12)
    const oneUp = 440 * 2 ** (1 / 12);
    expect(centsDiff(440, oneUp)).toBeCloseTo(100);
  });

  it("returns -100 cents for one semitone down", () => {
    const oneDown = 440 * 2 ** (-1 / 12);
    expect(centsDiff(440, oneDown)).toBeCloseTo(-100);
  });

  it("returns 1200 cents for one octave up", () => {
    expect(centsDiff(440, 880)).toBeCloseTo(1200);
  });
});
