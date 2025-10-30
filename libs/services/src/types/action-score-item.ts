import type { Action } from "./action";
import type { BaseFormType, BaseType, DocumentId } from "./common/base_type";
export interface Action_ScoreItem extends BaseType {
	value: number;
	action: Action;
}

export interface Form_Action_ScoreItem extends BaseFormType {
	value: number;
	action: DocumentId;
}
