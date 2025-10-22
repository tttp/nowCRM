import APIRoutes from "../../http/apiRoutes";
import type { Form_Settings, Settings } from "../../types/new_type/settings";
import BaseService from "../common/base.service";

class SettingsService extends BaseService<Settings, Form_Settings> {
	private static instance: SettingsService;

	private constructor() {
		super(APIRoutes.SETTINGS);
	}

	/**
	 * Retrieves the singleton instance of SettingsService.
	 * @returns {SettingsService} - The singleton instance.
	 */
	public static getInstance(): SettingsService {
		if (!SettingsService.instance) {
			SettingsService.instance = new SettingsService();
		}
		return SettingsService.instance;
	}
}

const settingsService = SettingsService.getInstance();
export default settingsService;
