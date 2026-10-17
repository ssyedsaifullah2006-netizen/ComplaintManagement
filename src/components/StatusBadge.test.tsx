import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PRIORITIES, STATUSES, type Status } from "@/lib/ccms";
import { PriorityTag, StatusBadge, StatusTrack } from "./StatusBadge";

// Spelled out here rather than read from STATUS_LABEL so a changed label fails the test.
const EXPECTED_LABEL: Record<Status, string> = {
  registered: "Registered",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

describe("StatusBadge", () => {
  it("covers every status", () => {
    expect(Object.keys(EXPECTED_LABEL).sort()).toEqual([...STATUSES].sort());
  });

  it.each(STATUSES)("renders the label for %s", (status) => {
    const { container } = render(<StatusBadge status={status} />);

    expect(container).toHaveTextContent(new RegExp(`^${EXPECTED_LABEL[status]}$`));
  });

  it("never shows the raw enum value", () => {
    render(<StatusBadge status="in_progress" />);

    expect(screen.queryByText("in_progress")).not.toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it.each(STATUSES)("gives %s its own colour classes", (status) => {
    const token = status === "in_progress" ? "progress" : status;
    const { container } = render(<StatusBadge status={status} />);

    expect(container.firstElementChild).toHaveClass(`text-st-${token}`);
  });
});

describe("StatusTrack", () => {
  it.each(STATUSES)("lists every step in lifecycle order when at %s", (status) => {
    render(<StatusTrack status={status} />);

    const steps = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(steps.map((li) => li.textContent)).toEqual(STATUSES.map((s) => EXPECTED_LABEL[s]));
  });

  it.each(STATUSES)("highlights steps up to and including %s", (status) => {
    render(<StatusTrack status={status} />);

    const reached = STATUSES.indexOf(status);
    STATUSES.forEach((s, i) => {
      expect(screen.getByText(EXPECTED_LABEL[s])).toHaveClass(
        i <= reached ? "text-foreground" : "text-muted-foreground",
      );
    });
  });
});

describe("PriorityTag", () => {
  it.each(PRIORITIES)("renders %s", (priority) => {
    render(<PriorityTag priority={priority} />);

    expect(screen.getByText(priority)).toBeInTheDocument();
  });
});
