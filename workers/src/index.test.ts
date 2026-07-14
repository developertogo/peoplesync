import { describe, it, expect } from "vitest";
import { runZeroClawAgent } from "./index.js";

describe("Workers Agent Subprocess Spawning", () => {
  it("exports runZeroClawAgent function correctly", () => {
    expect(runZeroClawAgent).toBeInstanceOf(Function);
  });
});
