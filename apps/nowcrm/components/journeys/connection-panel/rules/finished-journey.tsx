"use client";

import { AsyncSelect } from "@/components/autoComplete/AsyncSelect";
import type { Option } from "@/components/autoComplete/autoComplete";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Condition } from "../connection-panel"; // adjust the path if your types live elsewhere

interface FormCompleteRuleProps {
	condition: Condition;
	updateCondition: (id: string, updates: Partial<Condition>) => void;
}

export function FinishedJourneyRule({
	condition,
	updateCondition,
}: FormCompleteRuleProps) {
	return (
		<div className="space-y-4">
			{/* Operator dropdown */}
			<div>
				<label className="mb-1 block text-muted-foreground text-sm">
					Operator
				</label>
				<Select
					value={condition.operator}
					onValueChange={(value) =>
						updateCondition(condition.id, { operator: value })
					}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select operator" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="$eq">Equals</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Value dropdown (true / false) */}
			<div>
				<label className="mb-1 block text-muted-foreground text-sm">
					Value
				</label>
				<AsyncSelect
					serviceName="journeysService"
					presetOption={
						condition.additional_data?.journey as Option | undefined
					}
					onValueChange={(value) => {
						updateCondition(condition.id, {
							additionalCondition: `[actions][action_type]/$eq/journey_finished`,
						});
						updateCondition(condition.id, {
							value: value.value,
							additionalCondition: `[actions][action_type]/$eq/journey_finished`,
							additional_data: {
								journey: value,
							},
						});
					}}
					label="select Journey"
					useFormClear={false}
				/>
			</div>
		</div>
	);
}
