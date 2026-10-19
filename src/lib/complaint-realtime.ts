import type { QueryClient } from "@tanstack/react-query";

type ComplaintChange = {
  new?: Record<string, unknown>;
  old?: Record<string, unknown>;
};

export type ComplaintRealtimeChannel = {
  on(
    type: "postgres_changes",
    filter: {
      event: "*";
      schema: "public";
      table: "complaints" | "complaint_updates";
    },
    callback: (payload: ComplaintChange) => void,
  ): ComplaintRealtimeChannel;
  subscribe(callback: (status: string) => void): ComplaintRealtimeChannel;
};

export type ComplaintRealtimeClient = {
  channel(name: string): ComplaintRealtimeChannel;
  removeChannel(channel: ComplaintRealtimeChannel): Promise<unknown>;
};

export function subscribeToComplaintUpdates(
  client: ComplaintRealtimeClient,
  queryClient: QueryClient,
  userId: string,
  onUnavailable: () => void,
) {
  const channel = client
    .channel(`complaint-updates:${userId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "complaints" }, (payload) => {
      const id =
        typeof payload.new?.["id"] === "string"
          ? payload.new["id"]
          : typeof payload.old?.["id"] === "string"
            ? payload.old["id"]
            : undefined;
      void queryClient.invalidateQueries({ queryKey: ["complaints"] });
      void queryClient.invalidateQueries({
        queryKey: id ? ["complaint", id] : ["complaint"],
      });
    })
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "complaint_updates" },
      () => void queryClient.invalidateQueries({ queryKey: ["complaint"] }),
    )
    .subscribe((status) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") onUnavailable();
    });

  return () => {
    void client.removeChannel(channel);
  };
}
