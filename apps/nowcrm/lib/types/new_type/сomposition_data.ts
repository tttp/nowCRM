// lib/types/new_type/composition.ts
import type { BaseFormType, BaseType } from "../common/base_type";

export interface CompositionData extends BaseType {
	composition_id: number;
	channel: string;
	payload: Record<string, unknown>;
	status: "queued" | "processing" | "completed" | "failed";
	result?: Record<string, unknown>;
	error_message?: string;
}

export interface Form_CompositionData extends BaseFormType {
	composition_id: number;
	channel: string;
	payload: Record<string, unknown>;
}
