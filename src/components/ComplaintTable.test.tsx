import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));

// Render Link as a plain anchor so the list can mount without a router.
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    params,
    children,
    className,
  }: {
    to: string;
    params: { id: string };
    children: ReactNode;
    className?: string;
  }) => (
    <a href={to.replace("$id", params.id)} className={className}>
      {children}
    </a>
  ),
}));

import { STATUSES, type ComplaintRow, type Status } from "@/lib/ccms";
import { ComplaintList } from "./ComplaintTable";

const EXPECTED_LABEL: Record<Status, string> = {
  registered: "Registered",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

function row(overrides: Partial<ComplaintRow> = {}): ComplaintRow {
  return {
    id: "c-1",
    ticket_no: "CMP-0001",
    title: "Projector not working",
    description: "No signal",
    status: "registered",
    priority: "medium",
    room: "204",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    closed_at: null,
    resolved_at: null,
    photo_url: null,
    category_id: "cat-1",
    location_id: "loc-1",
    reporter_id: "u-1",
    assigned_technician_id: null,
    category: { name: "Electrical", sla_hours: 24 },
    location: { building: "Main Block", block: "A" },
    reporter: { full_name: "Sam Reporter", email: "sam@example.edu", department: "CS" },
    technician: null,
    ...overrides,
  } as ComplaintRow;
}

describe("ComplaintList", () => {
  it("shows the empty message when there are no rows", () => {
    render(<ComplaintList rows={[]} empty="No complaints yet" />);

    expect(screen.getByText("No complaints yet")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it.each(STATUSES)("renders the %s status label on its row", (status) => {
    render(<ComplaintList rows={[row({ status })]} empty="" />);

    const item = screen.getByRole("listitem");
    expect(within(item).getByText(EXPECTED_LABEL[status])).toBeInTheDocument();
  });

  it("pairs each row with its own status when every status is listed together", () => {
    const rows = STATUSES.map((status, i) =>
      row({ id: `c-${i}`, ticket_no: `CMP-${i}`, title: `Complaint ${status}`, status }),
    );
    render(<ComplaintList rows={rows} empty="" />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(STATUSES.length);
    STATUSES.forEach((status, i) => {
      const item = items[i]!;
      expect(within(item).getByText(`Complaint ${status}`)).toBeInTheDocument();
      expect(within(item).getByText(EXPECTED_LABEL[status])).toBeInTheDocument();
    });
  });

  it("shows ticket, priority, category, location and technician", () => {
    render(<ComplaintList rows={[row({ technician: { full_name: "Tara Tech" } })]} empty="" />);

    expect(screen.getByText("CMP-0001")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
    expect(screen.getByText("· Electrical")).toBeInTheDocument();
    expect(screen.getByText(/Main Block · A · 204 ·/)).toBeInTheDocument();
    expect(screen.getByText(/· Tara Tech$/)).toBeInTheDocument();
  });

  it("links each row to its complaint page", () => {
    render(<ComplaintList rows={[row({ id: "abc" })]} empty="" />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/complaints/abc");
  });

  it("renders the action slot for each row", () => {
    render(
      <ComplaintList
        rows={[row({ id: "a" }), row({ id: "b" })]}
        empty=""
        action={(c) => <button>Act on {c.id}</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Act on a" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Act on b" })).toBeInTheDocument();
  });
});
