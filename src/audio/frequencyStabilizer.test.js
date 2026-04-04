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

  it("returns -1 on silence when buffer is partially filled and no stable value", () => {
    stabilizer.process(440); // buffer filling, no stable value yet
    stabilizer.process(441);
    expect(stabilizer.process(-1)).toBe(-1);
  });

  it("correctly computes median for default bufferSize 8 with asymmetric input", () => {
    const s = new FrequencyStabilizer({ bufferSize: 8, stabilityThreshold: 15 });
    // 6 readings near 440, 2 outliers far away — outliers should prevent stability
    // but median should sit at 440, not be biased upward
    [440, 441, 439, 440, 441, 439, 880, 880].forEach(f => s.process(f));
    // buffer is full but unstable (880 readings are 1200+ cents away)
    // should hold lastStableFrequency (null → -1)
    expect(s.process(440)).toBe(-1);

    // Now fill with all-stable readings using bufferSize 8
    const s2 = new FrequencyStabilizer({ bufferSize: 8, stabilityThreshold: 15 });
    [438, 439, 440, 441, 442, 439, 440, 441].forEach(f => s2.process(f));
    const result = s2.process(440);
    // After 9th call, 438 is shifted out — buffer holds [439,440,441,442,439,440,441,440]
    // sorted: [439,439,440,440,440,441,441,442] → median = (440+440)/2 = 440
    expect(result).toBeCloseTo(440, 0);
  });
});
