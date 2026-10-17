import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AssignDialog } from "./AssignDialog";

vi.mock("@/integrations/supabase/client", () => ({ supabase: { rpc: vi.fn() } }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const technician = {
  user_id: "technician-1",
  category_id: "plumbing",
  is_available: true,
  profile: { full_name: "Alex" },
  category: { name: "Plumbing" },
};

function openDialog(techs = [technician], current?: string) {
  const client = new QueryClient({
    defaultOptions: { queries: { staleTime: Infinity, retry: false } },
  });
  client.setQueryData(["technicians"], techs);
  const invalidate = vi.spyOn(client, "invalidateQueries");
  render(
    <QueryClientProvider client={client}>
      <AssignDialog complaintId="complaint-1" categoryId="plumbing" current={current ?? null} />
    </QueryClientProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Assign" }));
  return invalidate;
}

beforeEach(() => vi.clearAllMocks());
afterEach(cleanup);

describe("AssignDialog", () => {
  it("disables assignment when there are no technicians", () => {
    openDialog([]);
    expect(screen.getByText(/No technicians yet/)).toBeVisible();
    expect(screen.getByRole("button", { name: "Assign" })).toBeDisabled();
  });

  it("requires a technician before calling the backend", () => {
    openDialog();
    fireEvent.click(screen.getByRole("button", { name: "Assign" }));
    expect(toast.error).toHaveBeenCalledWith("Pick a technician");
    expect(supabase.rpc).not.toHaveBeenCalled();
  });

  it("assigns the current technician with trimmed instructions and refreshes queries", async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({ error: null } as never);
    const invalidate = openDialog([technician], technician.user_id);
    fireEvent.change(screen.getByLabelText("Instructions (optional)"), {
      target: { value: "  Please check the valve  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Assign" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Technician assigned"));
    expect(supabase.rpc).toHaveBeenCalledWith("assign_technician", {
      _complaint: "complaint-1",
      _technician: "technician-1",
      _note: "Please check the valve",
    });
    expect(invalidate).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("keeps the dialog open on a backend error and omits blank instructions", async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({ error: { message: "Assignment denied" } } as never);
    const invalidate = openDialog([technician], technician.user_id);
    fireEvent.click(screen.getByRole("button", { name: "Assign" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Assignment denied"));
    expect(supabase.rpc).toHaveBeenCalledWith("assign_technician", {
      _complaint: "complaint-1",
      _technician: "technician-1",
    });
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(invalidate).not.toHaveBeenCalled();
  });
});
