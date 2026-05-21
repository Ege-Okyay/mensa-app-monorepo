import { api } from "./client";

// TODO: Handle the input stuff more secure
export const pushApi = {
  subscribe: (body: any) =>
    api.post("/push/subscribe", body),

  unsubscribe: (body: any) =>
    api.post("/push/unsubscribe", body)
};
