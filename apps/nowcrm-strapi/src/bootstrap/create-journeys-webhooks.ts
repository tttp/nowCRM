import type { Core } from '@strapi/strapi';
import { CONFIG } from "./config";

const WEBHOOK_NAME = 'Journeys webhook';

/**
 * Sets up the "Journeys" webhook in Strapi.
 * Recreates it on each startup to ensure correct host and configuration.
 */
export async function setUpJourneysWebhook(strapi: Core.Strapi): Promise<void> {
  // Webhook store API differs between v4 and v5
  const webhookStore =
    'webhookStore' in strapi
      ? (strapi as any).webhookStore // Strapi v4 compatibility
      : await (strapi as any).get('webhookStore'); // Strapi v5 API

  try {
    const webhooks = await webhookStore.findWebhooks();
    const existing = webhooks.find((webhook: { name: string }) => webhook.name === WEBHOOK_NAME);

    if (existing) {
      console.log(`Removing old "${existing.name}" webhook...`);
      await webhookStore.deleteWebhook(existing.id);
      console.log(`Old "${existing.name}" webhook removed.`);
    } else {
      console.log(`"${WEBHOOK_NAME}" does not exist yet.`);
    }
  } catch (error) {
    console.error(`Unable to prepare "${WEBHOOK_NAME}" webhook:`, error);
  }

  try {
    const isDev = CONFIG.NODE_ENV.toLowerCase() === 'development';
    const webhookUrl = isDev
      ? `http://${CONFIG.JOURNEYS_HOST}:${CONFIG.JOURNEYS_PORT}/webhooks/trigger`
      : `https://${CONFIG.JOURNEYS_HOST}.${CONFIG.CUSTOMER_DOMAIN}/webhooks/trigger`;

    await webhookStore.createWebhook({
      events: [
        'entry.create',
        'entry.update',
        'entry.delete',
        'entry.publish',
        'entry.unpublish',
      ],
      isEnabled: true,
      name: WEBHOOK_NAME,
      url: webhookUrl,
    });

    console.log(`"${WEBHOOK_NAME}" webhook created.`);
  } catch (error) {
    console.error(`Unable to create "${WEBHOOK_NAME}" webhook:`, error);
  }
}
