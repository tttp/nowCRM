import { startConsumer } from "./consumer";
import { startScheduler } from "./scheduler";

/**
 * Initializes RabbitMQ scheduler and consumer in the background.
 * Safe to call during app bootstrap (e.g., inside server.ts or app.ts).
 */
export function initRabbitWorker(): void {
	try {
		console.log("[RabbitWorker] Starting scheduler and consumer...");
		startScheduler(); // non-blocking cron job
		void startConsumer(); // run consumer async
	} catch (err) {
		console.error("[RabbitWorker] Failed to start:", err);
	}
}
