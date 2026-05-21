import { z } from 'zod';

export const PushSubscriptionsSchema = z.object({
  endpoint: z.url(),
  expirationTime: z.number().nullable().optional(),
  keys: z.object({
    p256dh: z.string().min(1),
    auth: z.string().min(1)
  })
});

export type PushSubscription = z.infer<typeof PushSubscriptionsSchema>;

export interface PushNotificationPayload {
  title: string;
  body: string;
  url: string;
  icon?: string;
  badge?: string;
}
