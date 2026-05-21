import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../models/database.types';
import { PushSubscriptionsSchema, type PushNotificationPayload, type PushSubscription } from '../models/push';
import { HTTPException } from 'hono/http-exception';
import { sendPushNotification } from '@mmmike/web-push';

const LOCALIZED_MESSAGES: Record<string, { title: string; body: string }> = {
  en: {
    title: '🍽️ Fresh menus just posted!',
    body: 'A new round of menus is live. See what\'s on the list.'
  },
  tr: {
    title: '🍽️ Yeni menüler yüklendi!',
    body: 'Güncel listeler geldi. Menüde neler olduğuna göz at.'
  },
  it: {
    title: '🍽️ Nuovi Menu Disponibili!',
    body: 'È online un nuovo aggiornamento dei menu. Dai un\'occhiata.'
  }
};

export const pushService = {
  /**
   * Saves or updates a push subscription in the database
   */
  async saveSubscription(
    supabase: SupabaseClient<Database>,
    rawDto: unknown
  ) {
    const subscription = PushSubscriptionsSchema.safeParse(rawDto);
    
    if (!subscription.success) throw new HTTPException(400, { message: `Invalid push subscription data: ${subscription.error.message}` });

    const { endpoint, keys, locale = 'en' } = subscription.data as PushSubscription & { locale?: string };
    const normalizedLocale = locale.split('-')[0].toLowerCase();

    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert({
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        locale: normalizedLocale
      }, { onConflict: 'endpoint' })
      .select()
      .single();

    if (error) throw new HTTPException(500, { message: error.message });

    return data;
  },

  /**
   * Removes a subscription from the database
   */
  async deleteSubscription(supabase: SupabaseClient<Database>, endpoint: string) {
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', endpoint);

    if (error) throw new HTTPException(500, { message: error.message });
  },

  /**
   * Broadcasts a new menu notification to every subscriber
   */
  async broadcastMenuUpdate(
    supabase: SupabaseClient<Database>,
    vapid: { publicKey: string; privateKey: string; subject: string }
  ) {
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error) throw new HTTPException(500, { message: error.message });
    if (!subscriptions || subscriptions.length === 0) return;

    const groups = subscriptions.reduce((acc, sub) => {
      const lang = (sub as any).locale || 'en';
      if (!acc[lang]) acc[lang] = [];

      acc[lang].push(sub);

      return acc;
    }, {} as Record<string, any[]>);

    console.log(`Sending notification to ${subscriptions.length} devices...`);

    for (const [lang, subs] of Object.entries(groups)) {
      const content = LOCALIZED_MESSAGES[lang] || LOCALIZED_MESSAGES.en;
      const payload: PushNotificationPayload = { ...content, url: '/' };

      await Promise.allSettled(
        subs.map(async (sub) => {
          try {
            await this.sendPush({
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth
              }
            }, payload, vapid);
          } catch (err: any) {
            console.error(`Failed to send push notification to ${sub.endpoint}:`, err);

            // Delete subscription if the push service returns 410 or 404
            const isExpired = err.status === 410
              || err.status === 404
              || err.message?.toLowerCase().includes('expired')
              || err.message?.toLowerCase().includes('subscription');

            if (isExpired) await this.deleteSubscription(supabase, sub.endpoint);
          }
        })
      );
    }
  },

  async sendPush(
    subscription: PushSubscription,
    payload: PushNotificationPayload,
    vapid: { publicKey: string; privateKey: string; subject: string },
  ) {
    const success = await sendPushNotification(
      subscription,
      payload,
      {
        publicKey: vapid.publicKey,
        privateKey: vapid.privateKey,
        subject: vapid.subject
      }
    );

    if (!success) throw new HTTPException(410, { message: 'Push subscription has expired or is invalid' });
  }
};
