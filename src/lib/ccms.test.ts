import { beforeEach, describe, expect, it, vi } from "vitest";

const supabaseMock = vi.hoisted(() => ({
  auth: { getUser: vi.fn() },
  from: vi.fn(),
}));

vi.mock("@/integrations/supabase/client", () => ({ supabase: supabaseMock }));

import {
  PRIORITIES,
  ROLE_LABEL,
  STATUSES,
  STATUS_LABEL,
  errMsg,
  isStaff,
  locationLabel,
  meQuery,
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
