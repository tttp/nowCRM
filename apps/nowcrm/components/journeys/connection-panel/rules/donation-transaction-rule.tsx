"use client";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Condition } from "../connection-panel"; // Adjust path if needed

interface FormCompleteRuleProps {
	condition: Condition;
	updateCondition: (id: string, updates: Partial<Condition>) => void;
}

export function DonationTransactionRule({
	condition,
	updateCondition,
}: FormCompleteRuleProps) {
	// Determine if the selected field is amount
	const isAmountSelected = condition.conditionField === "[ammount]";

	// Handler for conditionField change
	const handleFieldChange = (value: string) => {
		const updates: Partial<Condition> = { conditionField: value };

		if (value === "[campaign_name]") {
			updates.conditionOperator = "$eqi"; // force operator for campaign
		} else if (value === "[ammount]") {
			updates.conditionOperator = condition.conditionOperator ?? "$lte"; // keep current or default
		} else {
			updates.conditionOperator = undefined;
		}

		updateCondition(condition.id, {
			...updates,
			additional_data: {
				conditionField: value,
			},
		});
	};

	return (
		<div className="space-y-4">
			{/* Field select */}
			<div>
				<label className="mb-1 block text-muted-foreground text-sm">
					Field
				</label>
				<Select
					value={condition.conditionField}
					onValueChange={handleFieldChange}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select field" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="[campaign_name]">Campaign name</SelectItem>
						<SelectItem value="[ammount]">Amount</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Conditional Operator select */}
			{isAmountSelected && (
				<div>
					<label className="mb-1 block text-muted-foreground text-sm">
						Operator
					</label>
					<Select
						value={condition.conditionOperator}
						onValueChange={(value) =>
							updateCondition(condition.id, {
								conditionOperator: value,
								additional_data: {
									conditionOperator: value,
								},
							})
						}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select operator" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="$lte">Less than or equal to</SelectItem>
							<SelectItem value="$gte">Greater than or equal to</SelectItem>
						</SelectContent>
					</Select>
				</div>
			)}

			{/* Value input + async select */}
			<div>
				<label className="mb-1 block text-muted-foreground text-sm">
					Value
				</label>
				<Input
					defaultValue={condition.value as string}
					onChange={(e) =>
						updateCondition(condition.id, { value: e.target.value })
					}
				/>
			</div>
		</div>
	);
}
