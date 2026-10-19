import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  subscribeToComplaintUpdates,
  type ComplaintRealtimeChannel,
  type ComplaintRealtimeClient,
} from "@/lib/complaint-realtime";

type ComplaintChange = {
  new?: Record<string, unknown>;
  old?: Record<string, unknown>;
};

describe("subscribeToComplaintUpdates", () => {
  const registrations: {
    filter: {
      event: "*";
      schema: "public";
      table: "complaints" | "complaint_updates";
    };
    callback: (payload: ComplaintChange) => void;
  }[] = [];
  const statuses: ((status: string) => void)[] = [];
  let channel: ComplaintRealtimeChannel;
  let client: ComplaintRealtimeClient;
  let channelName: string;
  let removedChannel: ComplaintRealtimeChannel | undefined;
  let queryClient: QueryClient;

  beforeEach(() => {
    registrations.length = 0;
    statuses.length = 0;
    channelName = "";
    removedChannel = undefined;
    channel = {
      on(_type, filter, callback) {
        registrations.push({ filter, callback });
        return channel;
      },
      subscribe(callback) {
        statuses.push(callback);
        return channel;
      },
    };
    client = {
      channel(name) {
        channelName = name;
        return channel;
      },
      async removeChannel(removed) {
        removedChannel = removed;
      },
    };
    queryClient = new QueryClient();
    vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue();
  });

  it("subscribes for the user and removes the channel during cleanup", () => {
    const cleanup = subscribeToComplaintUpdates(client, queryClient, "user-1", vi.fn());

    expect(channelName).toBe("complaint-updates:user-1");
    expect(registrations.map(({ filter }) => filter)).toEqual([
      { event: "*", schema: "public", table: "complaints" },
      { event: "*", schema: "public", table: "complaint_updates" },
    ]);
    expect(statuses).toHaveLength(1);

    cleanup();

    expect(removedChannel).toBe(channel);
  });

  it("invalidates complaint lists and the affected detail for insert/update/delete events", () => {
    subscribeToComplaintUpdates(client, queryClient, "user-1", vi.fn());

    registrations[0]?.callback({ new: { id: "complaint-1" } });
    registrations[0]?.callback({ old: { id: "complaint-2" } });
    registrations[0]?.callback({ new: {}, old: {} });
    registrations[1]?.callback({});

    expect(queryClient.invalidateQueries).toHaveBeenNthCalledWith(1, {
      queryKey: ["complaints"],
    });
    expect(queryClient.invalidateQueries).toHaveBeenNthCalledWith(2, {
      queryKey: ["complaint", "complaint-1"],
    });
    expect(queryClient.invalidateQueries).toHaveBeenNthCalledWith(4, {
      queryKey: ["complaint", "complaint-2"],
    });
    expect(queryClient.invalidateQueries).toHaveBeenNthCalledWith(6, {
      queryKey: ["complaint"],
    });
    expect(queryClient.invalidateQueries).toHaveBeenNthCalledWith(7, {
      queryKey: ["complaint"],
    });
  });

  it("reports channel errors and timeouts", () => {
    const onUnavailable = vi.fn();
    subscribeToComplaintUpdates(client, queryClient, "user-1", onUnavailable);

    statuses[0]?.("CHANNEL_ERROR");
    statuses[0]?.("TIMED_OUT");
    statuses[0]?.("SUBSCRIBED");

    expect(onUnavailable).toHaveBeenCalledTimes(2);
  });
});
