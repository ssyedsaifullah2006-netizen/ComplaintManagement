import { describe, expect, it } from "vitest";
import { csvCell, toCsv } from "./reports";

describe("CSV reports", () => {
  it("quotes delimiters, quotes, and line breaks", () => {
    expect(csvCell('Wing, "A"\nRoom 1')).toBe('"Wing, ""A""\nRoom 1"');
  });

  it("neutralizes spreadsheet formula cells", () => {
    expect(csvCell('=HYPERLINK("https://example.com")')).toBe(
      `"'=HYPERLINK(""https://example.com"")"`,
    );
    expect(csvCell(" -3")).toBe(`"' -3"`);
  });

  it("serializes rows as CRLF-separated CSV", () => {
    expect(
      toCsv([
        ["Ticket", "Count"],
        ["CC-1001", 2],
      ]),
    ).toBe('"Ticket","Count"\r\n"CC-1001","2"');
  });
});
