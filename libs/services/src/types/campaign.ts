import { Action } from "./action";
import { CampaignCategory } from "./campaign-category";
import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import { StrapiConnect } from "./common/StrapiQuery";
import { Composition } from "./composition";
import { DonationTransaction } from "./donation-transaction";
import { Journey } from "./journey";
export interface Campaign extends BaseType {
    description: string;
    campaign_category: CampaignCategory
    actions: Action[]
    donation_transactions: DonationTransaction[]
    compositions: Composition[]
    journeys: Journey[]
}

export interface Form_Campaign extends BaseFormType {
    description: string;
    campaign_category: DocumentId
    actions: StrapiConnect
    donation_transactions: StrapiConnect
    compositions: StrapiConnect
    journeys: StrapiConnect
}
