import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
import { Contact } from "./contact";
import { User } from "./user";
export interface Campaign extends Omit<BaseType,"name"> {
    action: string;
    description: string;
    contact: Contact;
    user:  User
}

export interface Form_Campaign extends Omit<BaseFormType,"name"> {
    action: string;
    description: string;
    contact: DocumentId;
    /**
     * User from user permissions user isnt migrated to document id so ensure that here you use default number id
     */
    user:  number
}
