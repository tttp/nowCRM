// contactsapp/lib/config/RoutesConfig.ts

const BASE_URL = "/crm";

export const RouteConfig = {
	home: `${BASE_URL}`,

	auth: {
		login: "/auth",
		unauthorized: "/unauthorized",
		register: "/auth/register",
		reset_password: "/auth/reset-password",
		forgot_password: "/auth/forgot-password",
		verify_otp: "/auth/verify-otp",
	},

	user: {
		profile: `${BASE_URL}/profile`,
		settings: `${BASE_URL}/settings`,
		edit_profile: `${BASE_URL}/profile/edit`,
	},
	contacts: {
		base: `${BASE_URL}/contacts`,
		single: {
			base: (id: number) => `${BASE_URL}/contacts/${id}/details`,
			subscriptions: (id: number) => `${BASE_URL}/contacts/${id}/subscriptions`,
			lists: (id: number) => `${BASE_URL}/contacts/${id}/lists`,
			transactions: (id: number) => `${BASE_URL}/contacts/${id}/transactions`,
			transaction_subscriptions: (id: number) =>
				`${BASE_URL}/contacts/${id}/transaction-subscriptions`,
			surveys: (id: number) => `${BASE_URL}/contacts/${id}/surveys`,
			events: (id: number) => `${BASE_URL}/contacts/${id}/events`,
			tasks: (id: number) => `${BASE_URL}/contacts/${id}/tasks`,
			actions: (id: number) => `${BASE_URL}/contacts/${id}/actions`,
			activity_logs: (id: number) => `${BASE_URL}/contacts/${id}/activity_logs`,
			documents: (id: number) => `${BASE_URL}/contacts/${id}/documents`,
		},
	},
	lists: {
		base: `${BASE_URL}/lists`,
		single: (id: number) => `${BASE_URL}/lists/${id}`,
	},
	organizations: {
		base: `${BASE_URL}/organizations`,
		single: {
			base: (id: number) => `${BASE_URL}/organizations/${id}`,
			contacts: (id: number) => `${BASE_URL}/organizations/${id}/contacts`,
		},
	},
	forms: {
		base: `${BASE_URL}/forms`,
		single: (id: number) => `${BASE_URL}/forms/${id}`,
		results: (id: number) => `${BASE_URL}/forms/results/${id}`,
	},
	import: {
		base: `${BASE_URL}/import`,
	},
	admin: {
		admin_panel: {
			base: `${BASE_URL}/admin-panel`,
			industry: `${BASE_URL}/admin-panel/industries`,
			campaigns: `${BASE_URL}/admin-panel/campaigns`,
			campaign_categories: `${BASE_URL}/admin-panel/campaign-categories`,
			job_titles: `${BASE_URL}/admin-panel/job-titles`,
			contact_titles: `${BASE_URL}/admin-panel/contact-titles`,
			contact_salutations: `${BASE_URL}/admin-panel/contact-salutations`,
			channels: `${BASE_URL}/admin-panel/channels`,
			identities: `${BASE_URL}/admin-panel/identities`,
			unipile_identities: `${BASE_URL}/admin-panel/unipile-identities`,
			text_blocks: `${BASE_URL}/admin-panel/text-blocks`,
			tags: `${BASE_URL}/admin-panel/tags`,
			organization: {
				organization_type: `${BASE_URL}/admin-panel/organization-types`,
				frequency: `${BASE_URL}/admin-panel/frequencies`,
				media_type: `${BASE_URL}/admin-panel/media-types`,
			},
			action_types: `${BASE_URL}/admin-panel/action-types`,
		},
	},
	composer: {
		base: `${BASE_URL}/composer`,
		calendar: `${BASE_URL}/composer/calendar`,
		single: (id: number) => `${BASE_URL}/composer/${id}`,
	},
	journeys: {
		base: `${BASE_URL}/journeys`,
		single: (id: number) => `${BASE_URL}/journeys/${id}`,
	},
	terms: "/terms",
	policy: {
		base: "/policy",
		single: (id: number) => `/policy/${id}`,
	},
	signup: "/subscribe",
	userguide: "/userguide",
	action_result: "/action-result",
};
