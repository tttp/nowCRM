import type { Core } from '@strapi/strapi';
import {
  populateStartupEntry,
  populateStartupEntryWithAdjustments,
} from './seeding';

export async function bootstrapData(
  strapi: Core.Strapi,
  data: any,
  publishedAt: number
) {
  await populateStartupEntryWithAdjustments(strapi, 'api::channel.channel', data.channels);
  await populateStartupEntryWithAdjustments(strapi, 'api::contact-interest.contact-interest', data.contact_interest);
  await populateStartupEntryWithAdjustments(strapi, 'api::media-type.media-type', data.media_type);
  await populateStartupEntryWithAdjustments(strapi, 'api::frequency.frequency', data.frequency);
  await populateStartupEntryWithAdjustments(strapi, 'api::department.department', data.department);
  await populateStartupEntryWithAdjustments(strapi, 'api::contact-rank.contact-rank', data.rank);
  await populateStartupEntryWithAdjustments(strapi, 'api::keyword.keyword', data.keyword);
  await populateStartupEntry(strapi, 'api::contact.contact', data.contact);
  await populateStartupEntry(strapi, 'api::action.action', data.action);
  await populateStartupEntry(strapi, 'api::action-type.action-type', data.action_types);
  await populateStartupEntry(strapi, 'api::action-score-item.action-score-item', data.action_score_item);
  await populateStartupEntryWithAdjustments(strapi, 'api::contact-type.contact-type', data.contact_type);
  await populateStartupEntryWithAdjustments(strapi, 'api::organization-type.organization-type', data.organization_type);
  await populateStartupEntryWithAdjustments(strapi, 'api::subscription-type.subscription-type', data.subsctiption_type);
  await populateStartupEntryWithAdjustments(strapi, 'api::contact-title.contact-title', data.contact_title);
  await populateStartupEntryWithAdjustments(strapi, 'api::contact-salutation.contact-salutation', data.contact_salutation);
  await populateStartupEntryWithAdjustments(strapi, 'api::text-block.text-block', data.text_block);
  await populateStartupEntryWithAdjustments(strapi, 'api::task.task', data.task);
  await populateStartupEntryWithAdjustments(strapi, 'api::tag.tag', data.tag);
  await populateStartupEntryWithAdjustments(strapi, 'api::source.source', data.source);
  await populateStartupEntry(strapi, 'api::setting.setting', data.setting);
  await populateStartupEntry(strapi, 'api::contact-document.contact-document', data.contact_document);
  await populateStartupEntry(strapi, 'api::contact-note.contact-note', data.contact_note);
  await populateStartupEntry(strapi, 'api::donation-subscription.donation-subscription', data.donation_subscription);
  await populateStartupEntry(strapi, 'api::donation-transaction.donation-transaction', data.donation_transaction);
  await populateStartupEntry(strapi, 'api::event.event', data.event);
  await populateStartupEntry(strapi, 'api::form.form', data.form);
  await populateStartupEntry(strapi, 'api::form-item.form-item', data.form_item);
  await populateStartupEntry(strapi, 'api::identity.identity', data.identity);
  await populateStartupEntry(strapi, 'api::organization.organization', data.organization);
  await populateStartupEntry(strapi, 'api::survey.survey', data.survey);
  await populateStartupEntry(strapi, 'api::survey-item.survey-item', data.survey_item);
  await populateStartupEntry(strapi, 'api::list.list', data.list);
}
