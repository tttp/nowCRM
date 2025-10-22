import type { Form_Task, Task } from "@/lib/types/new_type/task";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

/**
 * Service class to handle Contact-related API interactions.
 * Extends the generic BaseService with Contact-specific types.
 */
class TasksService extends BaseService<Task, Form_Task> {
	private static instance: TasksService;

	private constructor() {
		super(APIRoutes.TASKS);
	}

	/**
	 * Retrieves the singleton instance of TasksService.
	 * @returns {TasksService} - The singleton instance.
	 */
	public static getInstance(): TasksService {
		if (!TasksService.instance) {
			TasksService.instance = new TasksService();
		}
		return TasksService.instance;
	}
}

const tasksService = TasksService.getInstance();
export default tasksService;
