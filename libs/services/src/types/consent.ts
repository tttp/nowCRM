import type { BaseFormType, BaseType } from "./common/base_type";
export interface Contact extends Omit<BaseType,'name'> {
    title: string;
    version: string;
    text: string;
    active: boolean
}

export interface Form_Contact extends Omit<BaseFormType,"name"> {
    title: string;
    version: string;
    text: string;
    active: boolean
}
