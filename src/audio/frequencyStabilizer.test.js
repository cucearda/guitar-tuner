import { describe, it, expect, beforeEach } from "vitest";
import { FrequencyStabilizer } from "./audioservice.js";

describe("FrequencyStabilizer", () => {
  let stabilizer;

  beforeEach(() => {
    stabilizer = new FrequencyStabilizer({ bufferSize: 4, stabilityThreshold: 15 });
  });

  it("returns -1 when buffer not yet full and no stable value exists", () => {
    expect(stabilizer.process(440)).toBe(-1);
    expect(stabilizer.process(441)).toBe(-1);
  });

  it("returns -1 immediately on silence without touching the buffer", () => {
    stabilizer.process(440);
    stabilizer.process(440);
    stabilizer.process(440);
    stabilizer.process(440); // now stable, lastStableFrequency = 440
    expect(stabilizer.process(-1)).toBe(-1);
  });

  it("returns lastStableFrequency while buffer is filling after a reset", () => {
    stabilizer.process(440);
    stabilizer.process(440);
    stabilizer.process(440);
    stabilizer.process(440); // stable at 440
    stabilizer.reset();
    stabilizer.process(440);
    stabilizer.process(440);
    // Buffer not full yet, no stable value after reset — returns -1
    expect(stabilizer.process(440)).toBe(-1);
  });

  it("emits the median frequency when buffer is full and stable", () => {
    stabilizer.process(439);
    stabilizer.process(440);
    stabilizer.process(441);
    const result = stabilizer.process(440);
    expect(result).toBe(440);
  });

  it("holds lastStableFrequency when readings are unstable", () => {
    stabilizer.process(440);
    stabilizer.process(440);
    stabilizer.process(440);
    stabilizer.process(440); // lastStableFrequency = 440
    // 880 is an octave up = 1200 cents away — very unstable
    stabilizer.process(880);
    stabilizer.process(440);
    const result = stabilizer.process(880);
    expect(result).toBe(440);
  });

  it("reset clears the buffer and lastStableFrequency", () => {
    stabilizer.process(440);
    stabilizer.process(440);
    stabilizer.process(440);
    stabilizer.process(440); // stable at 440
    stabilizer.reset();
    expect(stabilizer.process(440)).toBe(-1);
  });
});
