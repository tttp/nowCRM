"use client";

import { Plus, Trash2 } from "lucide-react";
import * as React from "react";
import { type Control, type UseFormReturn, useWatch } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { FilterGroup, FilterValues } from "./advancedFilters";
import FilterField from "./FilterField";
import { getOperatorsForField } from "./filtersShared";
import { FIELD_TYPES, FILTER_CATEGORIES } from "./filterTypes";

const FilterGroupComponent = ({
	// group,
	form,
	groupIndex,
	control,
	onUpdateGroup,
	onRemoveGroup,
}: {
	// group: FilterGroup
	form: UseFormReturn<FilterValues>;
	groupIndex: number;
	control: Control<FilterValues>;
	onUpdateGroup: (updates: Partial<FilterGroup>) => void;
	onRemoveGroup: () => void;
}) => {
	const [selectedCategory, setSelectedCategory] = React.useState<string>("");
	const [selectedField, setSelectedField] = React.useState<string>("");

	// this is the key: always read the live group from RHF state
	const watchedGroup = useWatch({
		control,
		name: `groups.${groupIndex}`,
	}) as FilterGroup;
	const group = watchedGroup ?? { id: "", logic: "AND", filters: {} };

	const filtersPath = `groups.${groupIndex}.filters` as const;
	const currentFilters = () =>
		(form.getValues(filtersPath) ?? {}) as Record<string, any>;

	// watch only what we need for dependencies
	const selectedSurveyValue = useWatch({
		control,
		name: `groups.${groupIndex}.filters.surveys.value` as const,
	});
	const selectedQuestionValue = useWatch({
		control,
		name: `groups.${groupIndex}.filters.survey_items_question.value` as const,
	});
	React.useEffect(() => {
		if (!selectedSurveyValue) return;
		const f = currentFilters();
		// Only clear if the survey really changed
		if (selectedSurveyValue !== f.surveys?.value) {
			if ("survey_items_question" in f) {
				form.setValue(
					`groups.${groupIndex}.filters.survey_items_question` as const,
					undefined,
				);
			}
			if ("survey_items_answer" in f) {
				form.setValue(
					`groups.${groupIndex}.filters.survey_items_answer` as const,
					undefined,
				);
			}
		}
	}, [selectedSurveyValue]);

	React.useEffect(() => {
		if (!selectedQuestionValue) return;
		const f = currentFilters();
		// Only clear if the question really changed
		if (selectedQuestionValue !== f.survey_items_question?.value) {
			if ("survey_items_answer" in f) {
				form.setValue(
					`groups.${groupIndex}.filters.survey_items_answer` as const,
					undefined,
				);
			}
		}
	}, [selectedQuestionValue]);

	const addFilter = () => {
		if (!selectedField) return;
		const current = group.filters || {};
		const newFilters = { ...current };

		newFilters[selectedField] = "";

		// only for non-relation fields
		if (FIELD_TYPES[selectedField] !== "relation") {
			newFilters[`${selectedField}_operator`] =
				getOperatorsForField(selectedField)[0].value;
		}

		onUpdateGroup({ filters: newFilters });
		setSelectedField("");
		setSelectedCategory("");
	};

	const updateFilter = (fieldName: string, value: any, isOperator = false) => {
		const current = group.filters || {};
		const key = isOperator ? `${fieldName}_operator` : fieldName;
		const newFilters = { ...current, [key]: value };
		onUpdateGroup({ filters: newFilters });
	};

	const removeFilter = (fieldName: string) => {
		const current = { ...(group.filters || {}) };
		delete current[fieldName];
		delete current[`${fieldName}_operator`];
		onUpdateGroup({ filters: current });

		// also unregister so RHF forgets it entirely
		form.unregister(`groups.${groupIndex}.filters.${fieldName}` as const);
		form.unregister(
			`groups.${groupIndex}.filters.${fieldName}_operator` as const,
		);
	};

	// show everything the user added
	const displayFilters = Object.keys(group.filters || {}).filter(
		(key) => !key.endsWith("_operator"),
	);

	// count only the ones that are effectively active
	const activeFiltersCount = displayFilters.filter((key) => {
		const val = group.filters?.[key];
		const op = group.filters?.[`${key}_operator`];
		const isNullOp = op === "$null" || op === "$notNull";
		return isNullOp || (val !== "" && val != null);
	}).length;

	return (
		<Card className="position-relative border">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="font-medium text-sm">
						Filter Group {groupIndex + 1}
						{activeFiltersCount > 0 && (
							<Badge variant="secondary" className="ml-2">
								{activeFiltersCount} filter{activeFiltersCount !== 1 ? "s" : ""}
							</Badge>
						)}
					</CardTitle>

					<div className="flex items-center gap-2">
						{displayFilters.length > 1 && (
							<div className="flex items-center gap-2">
								<span className="text-muted-foreground text-xs">
									Combine with:
								</span>
								<Select
									value={group.logic}
									onValueChange={(value: "AND" | "OR") =>
										onUpdateGroup({ logic: value })
									}
								>
									<SelectTrigger className="h-7 w-20">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="AND">AND</SelectItem>
										<SelectItem value="OR">OR</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}

						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={onRemoveGroup}
							className="h-7 w-7 p-0 text-destructive hover:text-destructive"
						>
							<Trash2 className="h-3 w-3" />
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-3">
				{/* Active filters */}
				{displayFilters.map((fieldName) => (
					<FilterField
						key={`${groupIndex}-${fieldName}`}
						fieldName={fieldName}
						value={group.filters?.[fieldName]}
						operator={
							group.filters?.[`${fieldName}_operator`] ||
							getOperatorsForField(fieldName)[0].value
						}
						onValueChange={(value) => updateFilter(fieldName, value)}
						onOperatorChange={(operator) =>
							updateFilter(fieldName, operator, true)
						}
						onRemove={() => removeFilter(fieldName)}
						form={form}
						groupIndex={groupIndex}
					/>
				))}

				{/* Add new filter */}
				<div className="flex items-center gap-2 rounded-lg border-2 border-dashed p-3">
					<Select value={selectedCategory} onValueChange={setSelectedCategory}>
						<SelectTrigger className="h-8">
							<SelectValue placeholder="Select category..." />
						</SelectTrigger>
						<SelectContent>
							{Object.entries(FILTER_CATEGORIES).map(([key, category]) => (
								<SelectItem key={key} value={key}>
									{category.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					<Select
						value={selectedField}
						onValueChange={setSelectedField}
						disabled={!selectedCategory}
					>
						<SelectTrigger className="h-8">
							<SelectValue placeholder="Select field..." />
						</SelectTrigger>
						<SelectContent>
							{selectedCategory &&
								FILTER_CATEGORIES[
									selectedCategory as keyof typeof FILTER_CATEGORIES
								]?.fields.map((field) => (
									<SelectItem key={field} value={field}>
										{field
											.replace(/_/g, " ")
											.replace(/\b\w/g, (l) => l.toUpperCase())}
									</SelectItem>
								))}
						</SelectContent>
					</Select>

					<Button
						type="button"
						size="sm"
						onClick={addFilter}
						disabled={!selectedField}
						className="h-8"
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default FilterGroupComponent;
