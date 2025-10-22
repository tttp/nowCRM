import type {
	Form_FormItemEntity,
	FormItemEntity,
} from "@/lib/types/new_type/form";
import APIRoutes from "../../http/apiRoutes";
import BaseService from "../common/base.service";

class FormItemsService extends BaseService<
	FormItemEntity,
	Form_FormItemEntity
> {
	private static instance: FormItemsService;

	private constructor() {
		super(APIRoutes.FORM_ITEMS);
	}

	/**
	 * Retrieves the singleton instance of FormItemsService.
	 * @returns {FormItemsService} - The singleton instance.
	 */
	public static getInstance(): FormItemsService {
		if (!FormItemsService.instance) {
			FormItemsService.instance = new FormItemsService();
		}
		return FormItemsService.instance;
	}
}

const formItemsService = FormItemsService.getInstance();
export default formItemsService;
