import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const { supabaseMock, toastMock } = vi.hoisted(() => ({
  supabaseMock: { from: vi.fn(), rpc: vi.fn() },
  toastMock: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("@/integrations/supabase/client", () => ({ supabase: supabaseMock }));
vi.mock("sonner", () => ({ toast: toastMock }));

import { AssignDialog } from "./AssignDialog";

type Tech = {
  user_id: string;
  category_id: string | null;
  is_available: boolean;
  profile: { full_name: string } | null;
  category: { name: string } | null;
};

const TECHS: Tech[] = [
  {
    user_id: "t-busy",
    category_id: "cat-plumbing",
    is_available: false,
    profile: { full_name: "Pat Plumber" },
    category: { name: "Plumbing" },
  },
  {
    user_id: "t-general",
    category_id: null,
    is_available: true,
    profile: { full_name: "Gene Ral" },
    category: null,
  },
  {
    user_id: "t-match",
    category_id: "cat-electrical",
    is_available: true,
    profile: { full_name: "Ella Sparks" },
    category: { name: "Electrical" },
  },
];

function mockTechnicians(techs: Tech[]) {
  supabaseMock.from.mockReturnValue({
    select: vi.fn().mockResolvedValue({ data: techs, error: null }),
  });
}

function renderDialog(props: Partial<Parameters<typeof AssignDialog>[0]> = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <AssignDialog complaintId="c-1" categoryId="cat-electrical" {...props} />
    </QueryClientProvider>,
  );
}

function openDialog(name = "Assign") {
  fireEvent.click(screen.getByRole("button", { name }));
  return screen.findByRole("dialog");
}

beforeAll(() => {
  // Radix Select relies on DOM APIs jsdom does not implement.
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.scrollIntoView ??= () => {};
});

beforeEach(() => {
  vi.clearAllMocks();
  mockTechnicians(TECHS);
});

describe("AssignDialog", () => {
  it("uses 'Assign' as the default trigger label", () => {
    renderDialog();

    expect(screen.getByRole("button", { name: "Assign" })).toBeInTheDocument();
  });

  it("renders a custom trigger label", () => {
    renderDialog({ label: "Reassign" });

    expect(screen.getByRole("button", { name: "Reassign" })).toBeInTheDocument();
  });

  it("explains there are no technicians and disables Assign", async () => {
    mockTechnicians([]);
    renderDialog();

    const dialog = await openDialog();

    expect(dialog).toHaveTextContent("Assign technician");
    expect(await screen.findByText(/No technicians yet/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Assign" })).toBeDisabled();
  });

  it("labels each technician with category and availability, best match first", async () => {
    renderDialog();
    await openDialog();

    fireEvent.keyDown(await screen.findByRole("combobox"), { key: "Enter" });

    const options = await screen.findAllByRole("option");
    expect(options.map((o) => o.textContent)).toEqual([
      "Ella Sparks · Electrical · Available",
      "Gene Ral · General · Available",
      "Pat Plumber · Plumbing · Unavailable",
    ]);
  });

  it("shows the currently assigned technician as the selection", async () => {
    renderDialog({ current: "t-busy" });
    await openDialog();

    expect(await screen.findByRole("combobox")).toHaveTextContent(
      "Pat Plumber · Plumbing · Unavailable",
    );
  });

  it("asks for a technician before submitting", async () => {
    renderDialog();
    await openDialog();
    await screen.findByRole("combobox");

    fireEvent.click(screen.getByRole("button", { name: "Assign" }));

    expect(toastMock.error).toHaveBeenCalledWith("Pick a technician");
    expect(supabaseMock.rpc).not.toHaveBeenCalled();
  });

  it("assigns the technician with trimmed instructions", async () => {
    supabaseMock.rpc.mockResolvedValue({ error: null });
    renderDialog({ current: "t-match" });
    await openDialog();
    await screen.findByRole("combobox");

    fireEvent.change(screen.getByLabelText("Instructions (optional)"), {
      target: { value: "  Bring a ladder  " },
    });
    fireEvent.click(screen.getByRole("button", { name: "Assign" }));

    await waitFor(() => expect(toastMock.success).toHaveBeenCalledWith("Technician assigned"));
    expect(supabaseMock.rpc).toHaveBeenCalledWith("assign_technician", {
      _complaint: "c-1",
      _technician: "t-match",
      _note: "Bring a ladder",
    });
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("surfaces the server error and stays open", async () => {
    supabaseMock.rpc.mockResolvedValue({ error: { message: "Invalid transition" } });
    renderDialog({ current: "t-match" });
    await openDialog();
    await screen.findByRole("combobox");

    fireEvent.click(screen.getByRole("button", { name: "Assign" }));

    await waitFor(() => expect(toastMock.error).toHaveBeenCalledWith("Invalid transition"));
    expect(supabaseMock.rpc.mock.calls[0]?.[1]).not.toHaveProperty("_note");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
