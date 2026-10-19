import { pageHead } from "@/lib/page-head";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, StatCard, NoAccess } from "@/components/AppShell";
import {
  complaintsQuery,
  isStaff,
  lookupsQuery,
  meQuery,
  STATUSES,
  STATUS_LABEL,
  locationLabel,
} from "@/lib/ccms";
import { toCsv } from "@/lib/reports";
import type { Status } from "@/lib/ccms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => pageHead("Maintenance Reports — CCMS", "Review and export campus maintenance data."),
  component: Reports,
});

function Reports() {
  const { data: me } = useQuery(meQuery);
  const staff = isStaff(me?.role);
  const {
    data: rows = [],
    isLoading,
    error,
    refetch,
  } = useQuery({ ...complaintsQuery("reports"), enabled: staff });
  const { data: lookups } = useQuery(lookupsQuery);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  if (!me) return null;
  if (!staff) return <NoAccess />;

  const fromTime = from ? new Date(`${from}T00:00:00`).getTime() : undefined;
  const throughDate = to ? new Date(`${to}T00:00:00`) : undefined;
  throughDate?.setDate(throughDate.getDate() + 1);
  const throughTime = throughDate?.getTime();
  const filtered = rows.filter((row) => {
    const createdAt = new Date(row.created_at).getTime();
    return (
      (fromTime === undefined || createdAt >= fromTime) &&
      (throughTime === undefined || createdAt < throughTime) &&
      (status === "all" || row.status === status) &&
      (category === "all" || row.category_id === category)
    );
  });
  const open = filtered.filter((row) => row.status !== "resolved" && row.status !== "closed");
  const overdue = open.filter(
    (row) =>
      Date.now() - new Date(row.created_at).getTime() > (row.category?.sla_hours ?? 48) * 36e5,
  );
  const resolutionTimes = filtered
    .filter((row) => row.resolved_at)
    .map((row) => new Date(row.resolved_at!).getTime() - new Date(row.created_at).getTime())
    .filter((duration) => duration >= 0);
  const averageResolutionHours = resolutionTimes.length
    ? Math.round(
        resolutionTimes.reduce((total, duration) => total + duration, 0) /
          resolutionTimes.length /
          36e5,
      )
    : null;

  function exportCsv() {
    const csv = toCsv([
      [
        "Ticket",
        "Title",
        "Category",
        "Location",
        "Room",
        "Priority",
        "Status",
        "Reporter",
        "Technician",
        "Created",
        "Updated",
        "Resolved",
      ],
      ...filtered.map((row) => [
        row.ticket_no,
        row.title,
        row.category?.name,
        locationLabel(row.location),
        row.room,
        row.priority,
        STATUS_LABEL[row.status],
        row.reporter?.full_name,
        row.technician?.full_name,
        row.created_at,
        row.updated_at,
        row.resolved_at,
      ]),
    ]);
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ccms-maintenance-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow="Estate desk" title="Maintenance reports">
        <Button onClick={exportCsv} disabled={isLoading || !!error || filtered.length === 0}>
          <Download /> Export CSV
        </Button>
      </PageHeader>

      <section
        aria-label="Report filters"
        className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <label className="space-y-1.5 text-sm">
          <span>From date</span>
          <Input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </label>
        <label className="space-y-1.5 text-sm">
          <span>To date</span>
          <Input
            type="date"
            min={from || undefined}
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </label>
        <div className="space-y-1.5 text-sm">
          <span className="block">Status</span>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger aria-label="Filter report by status" className="bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((item: Status) => (
                <SelectItem key={item} value={item}>
                  {STATUS_LABEL[item]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 text-sm">
          <span className="block">Category</span>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger aria-label="Filter report by category" className="bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {lookups?.categories.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {error ? (
        <div role="alert" className="space-y-3">
          <p>Unable to load maintenance report.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : isLoading ? (
        <p role="status" className="text-muted-foreground">
          Loading report…
        </p>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard tone="accent" label="Complaints in report" value={filtered.length} />
            <StatCard tone="ink" label="Open complaints" value={open.length} />
            <StatCard
              label="Past target time"
              value={overdue.length}
              hint="Open beyond category SLA"
            />
            <StatCard
              label="Average resolution"
              value={averageResolutionHours === null ? "—" : `${averageResolutionHours}h`}
              hint={`${resolutionTimes.length} resolved complaints`}
            />
          </div>

          <h2 className="mb-3 text-xl font-bold">Complaints by category</h2>
          <div className="overflow-x-auto rounded-lg border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-muted/50 text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Category
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Total
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Open
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Resolved / closed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(lookups?.categories ?? []).map((item) => {
                  const categoryRows = filtered.filter((row) => row.category_id === item.id);
                  const completed = categoryRows.filter(
                    (row) => row.status === "resolved" || row.status === "closed",
                  ).length;
                  return (
                    <tr key={item.id}>
                      <th scope="row" className="px-4 py-3 font-medium">
                        {item.name}
                      </th>
                      <td className="px-4 py-3">{categoryRows.length}</td>
                      <td className="px-4 py-3">{categoryRows.length - completed}</td>
                      <td className="px-4 py-3">{completed}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Showing {filtered.length} complaints. Report data is limited by the signed-in staff
            account’s database access policies.
          </p>
        </>
      )}
    </div>
  );
}
