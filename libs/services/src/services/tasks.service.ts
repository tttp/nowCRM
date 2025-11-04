import API_ROUTES_STRAPI from "../api-routes/api-routes-strapi";
import type { Form_Task, Task } from "../types/task";
import BaseService from "./common/base.service";

class TagsService extends BaseService<Task, Form_Task> {
	public constructor() {
		super(API_ROUTES_STRAPI.TASKS);
	}
}

export const tagsService = new TagsService();
