"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
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
import { RouteConfig } from "@/lib/config/RoutesConfig";
import type { Condition } from "../connection-panel"; // adjust the path if your types live elsewhere

interface FormCompleteRuleProps {
	condition: Condition;
	updateCondition: (id: string, updates: Partial<Condition>) => void;
}

export function FormAnswerRule({
	condition,
	updateCondition,
}: FormCompleteRuleProps) {
	const [formId, setFormId] = useState<number | undefined>(
		condition.additional_data?.form?.value,
	);
	const [conditionValue, setConditionValue] = useState<string>(
		condition.operator,
	);
	return (
		<div className="space-y-4">
			{/* Operator dropdown */}
			<div>
				<label className="mb-1 block text-muted-foreground text-sm">Form</label>
				<AsyncSelect
					key="form"
					serviceName="formService"
					presetOption={condition.additional_data?.form as Option | undefined}
					onValueChange={(value) => {
						value
							? setFormId(Number.parseInt(value.value))
							: setFormId(undefined);
						updateCondition(condition.id, {
							additional_data: {
								form: value,
							},
						});
					}}
					label="select Form"
					useFormClear={false}
				/>
				{formId != null && (
					<div className="mt-1 text-sm">
						<Link
							href={`${RouteConfig.forms.single(Number(formId))}`}
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center text-yellow-600 hover:underline"
						>
							Preview Form
							<ExternalLink className="ml-1 h-4 w-4" />
						</Link>
					</div>
				)}
			</div>

			<div>
				<label className="mb-1 block text-muted-foreground text-sm">
					Form question
				</label>
				<AsyncSelect
					key="formAnswer"
					serviceName="formItemService"
					presetOption={
						condition?.additional_data?.formAnswer as Option | undefined
					}
					disabled={!formId}
					fetchFilters={{ form: { $eq: formId } }}
					onValueChange={(value) => {
						updateCondition(condition.id, {
							additional_data: {
								formAnswer: value,
								conditionOperator: "$eq",
								conditionField: "[question]",
							},
							conditionOperator: "$eq",
							conditionField: "[question]",
							value: value.label,
						});
						// we use here label because we will find by the name of the question and not id
					}}
					label="select Form question"
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
				<label className="mb-1 block text-muted-foreground text-sm">
					Value
				</label>
				<Input
					value={condition.additionalCondition?.split("/")[2]}
					onChange={(e) => {
						e.preventDefault();
						updateCondition(condition.id, {
							additionalCondition: `[surveys][survey_items][answer]/${conditionValue}/${e.target.value}`,
						});
					}}
				/>
			</div>
		</div>
	);
}
