export function csvCell(value: string | number | null | undefined) {
  let text = value == null ? "" : String(value);
  if (/^[\s]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function toCsv(rows: (string | number | null | undefined)[][]) {
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}
