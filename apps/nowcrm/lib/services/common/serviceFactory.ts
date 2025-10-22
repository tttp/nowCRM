import actionTypeService from "../new_type/action_type.service";
// services/ServiceFactory.ts
import channelService from "../new_type/channel.service";
import composerService from "../new_type/composer.service";
import compositionService from "../new_type/composition.service";
import contactInterestsService from "../new_type/contact_interests.service";
import contactSalutationsService from "../new_type/contact_salutation";
import contactTitlesService from "../new_type/contact_title";
import contactTypeService from "../new_type/contact_type.service";
import contactsService from "../new_type/contacts.service";
import departmentService from "../new_type/department.service";
import eventsService from "../new_type/events.service";
import formItemsService from "../new_type/form_items.service";
import formsService from "../new_type/forms.service";
import frequencyService from "../new_type/frequency.service";
import identityService from "../new_type/identity.service";
import industryService from "../new_type/industry.service";
import jobTitleService from "../new_type/job_title.service";
import journeyStepsService from "../new_type/journeySteps.service";
import journeysService from "../new_type/journeys.service";
import listsService from "../new_type/lists.service";
import mediaTypeService from "../new_type/media_type.service";
import organizationTypeService from "../new_type/ogranization_type.service";
import organizationService from "../new_type/organizations.service";
import rankService from "../new_type/rank.service";
import scheduledCompositionService from "../new_type/scheduledComposition.service";
import sourceService from "../new_type/source.service";
import subscriptionsService from "../new_type/subscriptions.service";
import surveyItemsService from "../new_type/surveyItems.service";
import surveysService from "../new_type/surveys.service";
import tagService from "../new_type/tag.service";
import unipleIdentityService from "../new_type/unipile_identity.service";
import userService from "../new_type/users.service";

// TODO: Move ServiceName type ?
export type ServiceName =
	| "contactService"
	| "listService"
	| "contactInterestsService"
	| "contactTypeService"
	| "contactTitlesService"
	| "contactSalutationsService"
	| "channelService"
	| "organizationService"
	| "organizationTypeService"
	| "frequencyService"
	| "composerService"
	| "compositionService"
	| "identityService"
	| "unipileIdentityService"
	| "formItemService"
	| "departmentService"
	| "jobTitleService"
	| "subscriptionService"
	| "formService"
	| "formItemsService"
	| "industryService"
	| "userService"
	| "mediaTypeService"
	| "actionTypeService"
	| "journeysService"
	| "journeyStepsService"
	| "surveysService"
	| "surveyItemsService"
	| "sourceService"
	| "rankService"
	| "scheduledCompositionService"
	| "eventsService"
	| "tagService"
	| "";

const ServiceFactory = {
	getService(serviceName: ServiceName) {
		switch (serviceName) {
			case "contactService":
				return contactsService;
			case "listService":
				return listsService;
			case "contactTypeService":
				return contactTypeService;
			case "contactInterestsService":
				return contactInterestsService;
			case "compositionService":
				return compositionService;
			case "channelService":
				return channelService;
			case "rankService":
				return rankService;
			case "composerService":
				return composerService;
			case "organizationService":
				return organizationService;
			case "organizationTypeService":
				return organizationTypeService;
			case "subscriptionService":
				return subscriptionsService;
			case "journeysService":
				return journeysService;
			case "departmentService":
				return departmentService;
			case "jobTitleService":
				return jobTitleService;
			case "formItemService":
				return formItemsService;
			case "journeyStepsService":
				return journeyStepsService;
			case "mediaTypeService":
				return mediaTypeService;
			case "actionTypeService":
				return actionTypeService;
			case "formService":
				return formsService;
			case "formItemsService":
				return formItemsService;
			case "frequencyService":
				return frequencyService;
			case "industryService":
				return industryService;
			case "sourceService":
				return sourceService;
			case "userService":
				return userService;
			case "identityService":
				return identityService;
			case "unipileIdentityService":
				return unipleIdentityService;
			case "surveysService":
				return surveysService;
			case "surveyItemsService":
				return surveyItemsService;
			case "scheduledCompositionService":
				return scheduledCompositionService;
			case "eventsService":
				return eventsService;
			case "tagService":
				return tagService;
			case "contactTitlesService":
				return contactTitlesService;
			case "contactSalutationsService":
				return contactSalutationsService;
			default:
				throw new Error(`Unknown service: ${serviceName}`);
		}
	},
};

export default ServiceFactory;
