import { describe, expect, it } from "vitest";
import {
  createIlikeContainsFilter,
  quotePostgrestFilterValue,
} from "./postgrest-filter";

describe("postgrest filter helpers", () => {
  it("quotes plain values", () => {
    expect(quotePostgrestFilterValue("tiago")).toBe('"tiago"');
  });

  it("escapes quotes and backslashes inside filter values", () => {
    expect(quotePostgrestFilterValue('name "x" \\ test')).toBe(
      '"name \\"x\\" \\\\ test"',
    );
  });

  it("wraps ilike contains values before quoting them", () => {
    expect(createIlikeContainsFilter("tiago, qa")).toBe('"%tiago, qa%"');
  });
});
