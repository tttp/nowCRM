import APIRoutes from "../../http/apiRoutes";
import type {
	Form_SettingCredential,
	SettingCredential,
} from "../../types/new_type/settings";
import BaseService from "../common/base.service";

class SettingsCredentialsService extends BaseService<
	SettingCredential,
	Form_SettingCredential
> {
	private static instance: SettingsCredentialsService;

	private constructor() {
		super(APIRoutes.SETTING_CREDENTIALS);
	}

	/**
	 * Retrieves the singleton instance of SettingsCredentialsService.
	 * @returns {SettingsCredentialsService} - The singleton instance.
	 */
	public static getInstance(): SettingsCredentialsService {
		if (!SettingsCredentialsService.instance) {
			SettingsCredentialsService.instance = new SettingsCredentialsService();
		}
		return SettingsCredentialsService.instance;
	}
}

const settingsCredentialsService = SettingsCredentialsService.getInstance();
export default settingsCredentialsService;
