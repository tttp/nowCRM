import type { Event, Form_Event } from "@/lib/types/new_type/event";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class EventsService extends BaseService<Event, Form_Event> {
	private static instance: EventsService;

	private constructor() {
		super(APIRoutes.EVENTS);
	}

	/**
	 * Retrieves the singleton instance of EventsService.
	 * @returns {EventsService} - The singleton instance.
	 */
	public static getInstance(): EventsService {
		if (!EventsService.instance) {
			EventsService.instance = new EventsService();
		}
		return EventsService.instance;
	}
}

const eventsService = EventsService.getInstance();
export default eventsService;
