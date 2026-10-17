import { cleanup, render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ComplaintRow } from "@/lib/ccms";
import { ComplaintList } from "./ComplaintTable";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, params }: { children: ReactNode; params: { id: string } }) => (
    <a href={`/complaints/${params.id}`}>{children}</a>
  ),
}));

afterEach(cleanup);

const complaint: ComplaintRow = {
  id: "complaint-1",
  ticket_no: "CCMS-001",
  title: "Leaking tap",
  description: "The tap will not close",
  status: "assigned",
  priority: "high",
  created_at: "2026-10-01T12:00:00Z",
  updated_at: "2026-10-01T12:00:00Z",
  category_id: "plumbing",
  location_id: "library",
  reporter_id: "reporter-1",
  assigned_technician_id: "technician-1",
  room: "Room 2",
  photo_url: null,
  resolved_at: null,
  closed_at: null,
  category: { name: "Plumbing", sla_hours: 24 },
  location: { building: "Library", block: "Block A" },
  reporter: { full_name: "Sam", email: "sam@example.com", department: null },
  technician: { full_name: "Alex" },
};

describe("ComplaintList", () => {
  it("shows the supplied empty state", () => {
    render(<ComplaintList rows={[]} empty="No complaints found" />);
    expect(screen.getByText("No complaints found")).toBeVisible();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders each complaint and passes it to the action renderer", () => {
    const second = {
      ...complaint,
      id: "complaint-2",
      ticket_no: "CCMS-002",
      title: "Broken light",
    };
    render(
      <ComplaintList
        rows={[complaint, second]}
        empty="No complaints found"
        action={(row) => <button>Manage {row.ticket_no}</button>}
      />,
    );

    const rows = screen.getAllByRole("listitem");
    expect(rows).toHaveLength(2);
    expect(within(rows[0]!).getByRole("link", { name: /Leaking tap/ })).toHaveAttribute(
      "href",
      "/complaints/complaint-1",
    );
    expect(within(rows[0]!).getByText("Assigned")).toBeVisible();
    expect(within(rows[0]!).getByText(/Library · Block A · Room 2/)).toHaveTextContent("Alex");
    expect(within(rows[1]!).getByRole("button", { name: "Manage CCMS-002" })).toBeVisible();
  });
});
