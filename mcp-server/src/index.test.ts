import { describe, it, expect } from "vitest";
import { readDb } from "./index";

describe("MCP Server Database", () => {
  it("reads seed data from db.json correctly", () => {
    const db = readDb();
    expect(db).toBeDefined();
    expect(db.candidates).toBeInstanceOf(Array);
    expect(db.employees).toBeInstanceOf(Array);
    expect(db.provisioned_accounts).toBeDefined();
    expect(db.feedback).toBeInstanceOf(Array);
  });
});
