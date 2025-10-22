"use client";

import { HelpCircle } from "lucide-react";
import { useState } from "react";
import { AsyncSelect } from "@/components/autoComplete/AsyncSelect";
import type { Option } from "@/components/autoComplete/autoComplete";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Condition } from "../connection-panel"; // adjust the path if your types live elsewhere

interface FormCompleteRuleProps {
	condition: Condition;
	updateCondition: (id: string, updates: Partial<Condition>) => void;
}

export function ActionRule({
	condition,
	updateCondition,
}: FormCompleteRuleProps) {
	const [conditionValue, setConditionValue] = useState<string>("");

	return (
		<div className="space-y-4">
			<div>
				<label className="mb-1 block text-muted-foreground text-sm">
					Action Type
				</label>
				<AsyncSelect
					serviceName="actionTypeService"
					presetOption={
						condition.additional_data?.action_type as Option | undefined
					}
					onValueChange={(value) =>
						updateCondition(condition.id, {
							value: value ? value.label : undefined,
							additional_data: {
								action_type: value,
							},
						})
					}
					label="select action type"
					useFormClear={false}
				/>
			</div>

			<div>
				<label className="mb-1 block text-muted-foreground text-sm">
					Operator
				</label>
				<Select
					value={condition.operator}
					onValueChange={(value) => {
						updateCondition(condition.id, { operator: value });
						setConditionValue(value);
					}}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select operator" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="$eqi">Equals</SelectItem>
						<SelectItem value="$nei">Not Equals</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div>
				<label className="mb-1 flex items-center text-muted-foreground text-sm">
					External id
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild className="ml-3">
								<div className="cursor-help">
									<HelpCircle className="h-4 w-4 text-muted-foreground" />
								</div>
							</TooltipTrigger>
							<TooltipContent className="w-120 p-2">
								<p className="mb-1 font-medium">
									External id - id which is related to action with selected
									action type
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</label>
				<Input
					value={condition.additionalCondition?.split("/")[2]}
					onChange={(e) => {
						e.preventDefault();
						updateCondition(condition.id, {
							additionalCondition: `[actions][external_id]/${conditionValue}/${e.target.value}`,
						});
					}}
				/>
			</div>
		</div>
	);
}
