import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];
export type Status = Database["public"]["Enums"]["complaint_status"];
export type Priority = Database["public"]["Enums"]["complaint_priority"];

export const STATUSES: Status[] = ["registered", "assigned", "in_progress", "resolved", "closed"];
export const STATUS_LABEL: Record<Status, string> = {
  registered: "Registered",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};
export const ROLE_LABEL: Record<AppRole, string> = {
  student: "Student",
  faculty: "Faculty",
  technician: "Technician",
  estate_manager: "Estate Manager",
  admin: "Admin",
};
export const PRIORITIES: Priority[] = ["low", "medium", "high", "urgent"];

export function isStaff(role?: AppRole | null) {
  return role === "estate_manager" || role === "admin";
}

export function errMsg(e: unknown) {
  if (e && typeof e === "object" && "message" in e)
    return String((e as { message: unknown }).message);
  return "Something went wrong";
}

export const meQuery = queryOptions({
  queryKey: ["me"],
  queryFn: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return null;
    const [{ data: profile }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", u.user.id),
    ]);
    const order: AppRole[] = ["admin", "estate_manager", "technician", "faculty", "student"];
    const role = order.find((r) => roles?.some((x) => x.role === r)) ?? "student";
    return { id: u.user.id, email: u.user.email ?? "", profile, role };
  },
});

export const lookupsQuery = queryOptions({
  queryKey: ["lookups"],
  queryFn: async () => {
    const [c, l] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("locations").select("*").order("building"),
    ]);
    if (c.error) throw c.error;
    if (l.error) throw l.error;
    return { categories: c.data, locations: l.data };
  },
});

export const COMPLAINT_SELECT =
  "*, category:categories(name, sla_hours), location:locations(building, block), reporter:profiles!complaints_reporter_id_fkey(full_name, email, department), technician:profiles!complaints_assigned_technician_id_fkey(full_name)";

export type ComplaintRow = Awaited<ReturnType<typeof fetchComplaints>>[number];

export async function fetchComplaints(filter?: {
  reporter?: string | undefined;
  technician?: string | undefined;
}) {
  let q = supabase
    .from("complaints")
    .select(COMPLAINT_SELECT)
    .order("created_at", { ascending: false });
  if (filter?.reporter) q = q.eq("reporter_id", filter.reporter);
  if (filter?.technician) q = q.eq("assigned_technician_id", filter.technician);
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export const complaintsQuery = (
  key: string,
  filter?: { reporter?: string | undefined; technician?: string | undefined },
) =>
  queryOptions({ queryKey: ["complaints", key, filter], queryFn: () => fetchComplaints(filter) });

export const unreadCountQuery = (uid?: string) =>
  queryOptions({
    queryKey: ["notifications", "unread", uid],
    enabled: !!uid,
    refetchInterval: 30000,
    queryFn: async () => {
      const { count } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false);
      return count ?? 0;
    },
  });

export function locationLabel(l?: { building: string; block: string | null } | null) {
  if (!l) return "—";
  return l.block ? `${l.building} · ${l.block}` : l.building;
}

export const DEFAULT_SLA_HOURS = 48;
/** Share of the response window left at which an open complaint counts as "due soon". */
export const DUE_SOON_FRACTION = 0.25;

export type SlaState = "on_track" | "due_soon" | "overdue" | "met" | "missed" | "none";

type SlaInput = {
  status: Status;
  created_at: string;
  resolved_at: string | null;
  category?: { sla_hours: number | null } | null;
};

const HOUR = 36e5;

export function slaDeadline(c: Pick<SlaInput, "created_at" | "category">) {
  const hours = c.category?.sla_hours ?? DEFAULT_SLA_HOURS;
  return new Date(new Date(c.created_at).getTime() + hours * HOUR);
}

export function isOpen(status: Status) {
  return status !== "resolved" && status !== "closed";
}

/**
 * Where a complaint stands against its category's response target. Open complaints are
 * on track, due soon or overdue; resolved and closed ones met or missed the target by
 * their resolution time. A complaint closed without being resolved (rejected as invalid)
 * has no SLA outcome.
 */
export function slaState(c: SlaInput, now: Date = new Date()): SlaState {
  const created = new Date(c.created_at).getTime();
  const deadline = slaDeadline(c).getTime();
  if (!isOpen(c.status)) {
    if (!c.resolved_at) return "none";
    return new Date(c.resolved_at).getTime() <= deadline ? "met" : "missed";
  }
  const left = deadline - now.getTime();
  if (left < 0) return "overdue";
  if (left <= (deadline - created) * DUE_SOON_FRACTION) return "due_soon";
  return "on_track";
}

export function isOverdue(c: SlaInput, now: Date = new Date()) {
  return slaState(c, now) === "overdue";
}

/** Compact duration such as "45m", "5h" or "2d 3h". */
export function formatSpan(ms: number) {
  const mins = Math.max(1, Math.round(Math.abs(ms) / 6e4));
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  return rem ? `${days}d ${rem}h` : `${days}d`;
}

export function slaLabel(c: SlaInput, now: Date = new Date()) {
  const state = slaState(c, now);
  const deadline = slaDeadline(c).getTime();
  switch (state) {
    case "on_track":
    case "due_soon":
      return `Due in ${formatSpan(deadline - now.getTime())}`;
    case "overdue":
      return `Overdue by ${formatSpan(now.getTime() - deadline)}`;
    case "met":
      return "Target met";
    case "missed":
      return `Target missed by ${formatSpan(new Date(c.resolved_at ?? now).getTime() - deadline)}`;
    default:
      return null;
  }
}

export type ComplaintSort = "newest" | "oldest" | "due";
export const SORT_LABEL: Record<ComplaintSort, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  due: "Due soonest",
};

/** Sorts a copy. "due" puts open complaints first by deadline, then the rest newest first. */
export function sortComplaints<T extends SlaInput>(rows: T[], sort: ComplaintSort): T[] {
  const created = (r: T) => new Date(r.created_at).getTime();
  const out = [...rows];
  if (sort === "newest") return out.sort((a, b) => created(b) - created(a));
  if (sort === "oldest") return out.sort((a, b) => created(a) - created(b));
  return out.sort((a, b) => {
    const ao = isOpen(a.status);
    const bo = isOpen(b.status);
    if (ao !== bo) return ao ? -1 : 1;
    if (!ao) return created(b) - created(a);
    return slaDeadline(a).getTime() - slaDeadline(b).getTime();
  });
}
