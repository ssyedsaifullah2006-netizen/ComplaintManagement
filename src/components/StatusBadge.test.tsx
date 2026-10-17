import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StatusBadge } from "./StatusBadge";

afterEach(cleanup);

describe("StatusBadge", () => {
  it.each([
    ["registered", "Registered"],
    ["assigned", "Assigned"],
    ["in_progress", "In Progress"],
    ["resolved", "Resolved"],
    ["closed", "Closed"],
  ] as const)("labels %s", (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeVisible();
  });
});
