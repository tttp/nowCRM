"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { AsyncSelect } from "@/components/autoComplete/AsyncSelect";
import type { Option } from "@/components/autoComplete/autoComplete";
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

export function FormCompleteRule({
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
					serviceName="formService"
					presetOption={condition.additional_data?.form as Option | undefined}
					onValueChange={(value) =>
						updateCondition(condition.id, {
							value: value ? value.value : undefined,
							additional_data: {
								form: value,
							},
						})
					}
					label="select Form"
					useFormClear={false}
				/>
				{condition.value != null && (
					<div className="mt-1 text-sm">
						<Link
							href={`${RouteConfig.forms.single(Number(condition.value))}`}
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
		</div>
	);
}
