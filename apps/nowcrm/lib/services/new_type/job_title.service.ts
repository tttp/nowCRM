import type { Form_JobTitle, JobTitle } from "@/lib/types/new_type/job_title";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class JobTitleService extends BaseService<JobTitle, Form_JobTitle> {
	private static instance: JobTitleService;

	private constructor() {
		super(APIRoutes.JOB_TITLES);
	}

	/**
	 * Retrieves the singleton instance of JobTitleService.
	 * @returns {JobTitleService} - The singleton instance.
	 */
	public static getInstance(): JobTitleService {
		if (!JobTitleService.instance) {
			JobTitleService.instance = new JobTitleService();
		}
		return JobTitleService.instance;
	}
}

const jobTitleService = JobTitleService.getInstance();
export default jobTitleService;
