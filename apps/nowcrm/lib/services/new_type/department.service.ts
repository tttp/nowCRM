import type {
	Department,
	Form_Department,
} from "@/lib/types/new_type/department";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class DepartmentService extends BaseService<Department, Form_Department> {
	private static instance: DepartmentService;

	private constructor() {
		super(APIRoutes.DEPARTMENTS);
	}

	/**
	 * Retrieves the singleton instance of DepartmentService.
	 * @returns {DepartmentService} - The singleton instance.
	 */
	public static getInstance(): DepartmentService {
		if (!DepartmentService.instance) {
			DepartmentService.instance = new DepartmentService();
		}
		return DepartmentService.instance;
	}
}

const departmentService = DepartmentService.getInstance();
export default departmentService;
