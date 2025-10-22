import type {
	ActivityLog,
	Form_ActivityLog,
} from "@/lib/types/new_type/activity_log";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class ActivityLogsService extends BaseService<ActivityLog, Form_ActivityLog> {
	private static instance: ActivityLogsService;

	private constructor() {
		super(APIRoutes.ACTIVITY_LOGS);
	}

	/**
	 * Retrieves the singleton instance of ActivityLogsService.
	 * @returns {ActivityLogsService} - The singleton instance.
	 */
	public static getInstance(): ActivityLogsService {
		if (!ActivityLogsService.instance) {
			ActivityLogsService.instance = new ActivityLogsService();
		}
		return ActivityLogsService.instance;
	}
}

const activityLogsService = ActivityLogsService.getInstance();
export default activityLogsService;
