import { beforeEach, describe, expect, it, vi } from "vitest";

const supabaseMock = vi.hoisted(() => ({
  auth: { getUser: vi.fn() },
  from: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({ supabase: supabaseMock }));

import {
  PRIORITIES,
  DEFAULT_SLA_HOURS,
  ROLE_LABEL,
  STATUSES,
  STATUS_LABEL,
  errMsg,
  formatSpan,
  isOverdue,
  isStaff,
  locationLabel,
  meQuery,
  slaDeadline,
  slaLabel,
  slaState,
  sortComplaints,
} from "@/lib/ccms";

describe("complaint lifecycle constants", () => {
  it("lists statuses in lifecycle order", () => {
    expect(STATUSES).toEqual(["registered", "assigned", "in_progress", "resolved", "closed"]);
  });

  it("has a human label for every status", () => {
    for (const status of STATUSES) expect(STATUS_LABEL[status]).toBeTruthy();
    expect(STATUS_LABEL.in_progress).toBe("In Progress");
  });

  it("has a human label for every role", () => {
    expect(Object.keys(ROLE_LABEL).sort()).toEqual(
      ["admin", "estate_manager", "faculty", "student", "technician"].sort(),
    );
  });

  it("orders priorities from low to urgent", () => {
    expect(PRIORITIES).toEqual(["low", "medium", "high", "urgent"]);
  });
});

describe("isStaff", () => {
  it("is true only for estate managers and admins", () => {
    expect(isStaff("admin")).toBe(true);
    expect(isStaff("estate_manager")).toBe(true);
    expect(isStaff("technician")).toBe(false);
    expect(isStaff("faculty")).toBe(false);
    expect(isStaff("student")).toBe(false);
  });

  it("is false when there is no role", () => {
    expect(isStaff(undefined)).toBe(false);
    expect(isStaff(null)).toBe(false);
  });
});

describe("errMsg", () => {
  it("reads the message from an Error", () => {
    expect(errMsg(new Error("boom"))).toBe("boom");
  });

  it("reads the message from a plain error-like object", () => {
    expect(errMsg({ message: "row level security violation" })).toBe(
      "row level security violation",
    );
  });

  it("falls back to a generic message for non-error values", () => {
    expect(errMsg(null)).toBe("Something went wrong");
    expect(errMsg("oops")).toBe("Something went wrong");
    expect(errMsg(42)).toBe("Something went wrong");
  });
});

describe("locationLabel", () => {
  it("shows a dash when there is no location", () => {
    expect(locationLabel(null)).toBe("—");
    expect(locationLabel(undefined)).toBe("—");
  });

  it("shows just the building when there is no block", () => {
    expect(locationLabel({ building: "Library", block: null })).toBe("Library");
  });

  it("joins building and block", () => {
    expect(locationLabel({ building: "Hostel A", block: "Block 2" })).toBe("Hostel A · Block 2");
  });
});

describe("meQuery", () => {
  type QueryFn = () => Promise<{ id: string; email: string; role: string } | null>;
  const run = () => (meQuery.queryFn as unknown as QueryFn)();

  function mockUser(roles: string[] | null) {
    supabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { id: "u1", email: "u1@campus.test" } },
    });
    supabaseMock.from.mockImplementation((table: string) => ({
      select: () => ({
        eq: () =>
          table === "profiles"
            ? { maybeSingle: async () => ({ data: { id: "u1", full_name: "User One" } }) }
            : Promise.resolve({ data: roles?.map((role) => ({ role })) ?? null }),
      }),
    }));
  }

  beforeEach(() => {
    supabaseMock.auth.getUser.mockReset();
    supabaseMock.from.mockReset();
  });

  it("returns null when nobody is signed in", async () => {
    supabaseMock.auth.getUser.mockResolvedValue({ data: { user: null } });
    expect(await run()).toBeNull();
  });

  it("picks the highest-privilege role when a user has several", async () => {
    mockUser(["student", "technician", "estate_manager"]);
    expect((await run())?.role).toBe("estate_manager");

    mockUser(["faculty", "admin"]);
    expect((await run())?.role).toBe("admin");
  });

  it("defaults to student when the user has no role rows", async () => {
    mockUser([]);
    expect((await run())?.role).toBe("student");

    mockUser(null);
    expect((await run())?.role).toBe("student");
  });

  it("returns the id and email of the signed-in user", async () => {
    mockUser(["faculty"]);
    const me = await run();
    expect(me?.id).toBe("u1");
    expect(me?.email).toBe("u1@campus.test");
  });
});

describe("SLA tracking", () => {
  const created = "2026-10-01T08:00:00.000Z";
  const at = (hoursAfterCreate: number) =>
    new Date(new Date(created).getTime() + hoursAfterCreate * 36e5);
  const complaint = (over: Partial<Parameters<typeof slaState>[0]> = {}) => ({
    status: "assigned" as const,
    created_at: created,
    resolved_at: null,
    category: { sla_hours: 24 },
    ...over,
  });

  describe("slaDeadline", () => {
    it("adds the category target to the filing time", () => {
      expect(slaDeadline(complaint()).toISOString()).toBe("2026-10-02T08:00:00.000Z");
    });

    it("falls back to the default target when the category is missing", () => {
      expect(DEFAULT_SLA_HOURS).toBe(48);
      expect(slaDeadline(complaint({ category: null })).toISOString()).toBe(
        "2026-10-03T08:00:00.000Z",
      );
    });
  });

  describe("slaState", () => {
    it("is on track early in the window", () => {
      expect(slaState(complaint(), at(1))).toBe("on_track");
      expect(slaState(complaint(), at(17.9))).toBe("on_track");
    });

    it("is due soon in the last quarter of the window", () => {
      expect(slaState(complaint(), at(18))).toBe("due_soon");
      expect(slaState(complaint(), at(24))).toBe("due_soon");
    });

    it("is overdue once the deadline has passed", () => {
      expect(slaState(complaint(), at(24.01))).toBe("overdue");
      expect(isOverdue(complaint(), at(30))).toBe(true);
      expect(isOverdue(complaint(), at(2))).toBe(false);
    });

    it("judges resolved and closed complaints by their resolution time", () => {
      const resolvedAt = (h: number) => at(h).toISOString();
      expect(
        slaState(complaint({ status: "resolved", resolved_at: resolvedAt(20) }), at(100)),
      ).toBe("met");
      expect(slaState(complaint({ status: "closed", resolved_at: resolvedAt(30) }), at(1))).toBe(
        "missed",
      );
      expect(
        isOverdue(complaint({ status: "resolved", resolved_at: resolvedAt(30) }), at(100)),
      ).toBe(false);
    });

    it("has no outcome for a complaint closed without being resolved", () => {
      expect(slaState(complaint({ status: "closed" }), at(100))).toBe("none");
      expect(slaLabel(complaint({ status: "closed" }), at(100))).toBeNull();
    });

    it("treats a reopened complaint as open even though it was resolved before", () => {
      const reopened = complaint({ status: "in_progress", resolved_at: at(10).toISOString() });
      expect(slaState(reopened, at(30))).toBe("overdue");
    });
  });

  describe("slaLabel and formatSpan", () => {
    it("formats spans compactly", () => {
      expect(formatSpan(0)).toBe("1m");
      expect(formatSpan(45 * 6e4)).toBe("45m");
      expect(formatSpan(5 * 36e5)).toBe("5h");
      expect(formatSpan(48 * 36e5)).toBe("2d");
      expect(formatSpan(51 * 36e5)).toBe("2d 3h");
      expect(formatSpan(-3 * 36e5)).toBe("3h");
    });

    it("describes each state", () => {
      expect(slaLabel(complaint(), at(19))).toBe("Due in 5h");
      expect(slaLabel(complaint(), at(26))).toBe("Overdue by 2h");
      expect(slaLabel(complaint({ status: "resolved", resolved_at: at(3).toISOString() }))).toBe(
        "Target met",
      );
      expect(slaLabel(complaint({ status: "resolved", resolved_at: at(75).toISOString() }))).toBe(
        "Target missed by 2d 3h",
      );
    });
  });

  describe("sortComplaints", () => {
    const rows = [
      {
        id: "a",
        ...complaint({ created_at: "2026-10-01T00:00:00Z", category: { sla_hours: 72 } }),
      },
      { id: "b", ...complaint({ created_at: "2026-10-02T00:00:00Z", category: { sla_hours: 4 } }) },
      {
        id: "c",
        ...complaint({
          created_at: "2026-10-03T00:00:00Z",
          status: "resolved",
          resolved_at: "2026-10-03T01:00:00Z",
        }),
      },
    ];
    const ids = (r: typeof rows) => r.map((x) => x.id);

    it("sorts by filing time", () => {
      expect(ids(sortComplaints(rows, "newest"))).toEqual(["c", "b", "a"]);
      expect(ids(sortComplaints(rows, "oldest"))).toEqual(["a", "b", "c"]);
    });

    it("puts open complaints first by deadline when sorting by due date", () => {
      expect(ids(sortComplaints(rows, "due"))).toEqual(["b", "a", "c"]);
    });

    it("does not mutate the input", () => {
      sortComplaints(rows, "oldest");
      expect(ids(rows)).toEqual(["a", "b", "c"]);
    });
  });
});
