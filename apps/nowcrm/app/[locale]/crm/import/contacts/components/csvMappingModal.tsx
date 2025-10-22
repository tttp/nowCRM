"use client";

import { AlertCircle, ChevronDown, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { contactCSVTemplateFields } from "../templates/contactCSVFields";

interface CSVMappingModalProps {
	isOpen: boolean;
	onClose: () => void;
	fileName: string;
	csvHeaders: string[];
	onImport: (
		mappings: Record<string, string>,
		fileName: string,
		deletedColumns: string[],
	) => void;
}

function findBestMatch(
	header: string,
	templateFields: string[],
): string | null {
	const lowerHeader = header.toLowerCase();
	const exactMatch = templateFields.find(
		(field) => field.toLowerCase() === lowerHeader,
	);
	if (exactMatch) return exactMatch;

	for (const field of templateFields) {
		if (
			lowerHeader.includes(field.toLowerCase()) ||
			field.toLowerCase().includes(lowerHeader)
		) {
			return field;
		}
	}

	return null;
}

export function CSVMappingModal({
	isOpen,
	onClose,
	fileName,
	csvHeaders,
	onImport,
}: CSVMappingModalProps) {
	const [editedFileName, setEditedFileName] = useState(fileName);
	const [mappings, setMappings] = useState<Record<string, string>>({});
	const [deletedColumns, setDeletedColumns] = useState<string[]>([]);
	const [validationErrors, setValidationErrors] = useState<string[]>([]);
	const [duplicateMappings, setDuplicateMappings] = useState<
		Record<string, string[]>
	>({});

	useEffect(() => {
		if (csvHeaders.length > 0) {
			const initialMappings: Record<string, string> = {};

			for (const header of csvHeaders) {
				const matchedField = findBestMatch(header, contactCSVTemplateFields);
				initialMappings[header] = matchedField || "";
			}

			setMappings(initialMappings);
			setDeletedColumns([]);
			validateMappings(initialMappings);
		}
	}, [csvHeaders, isOpen]);

	const validateMappings = (
		currentMappings: Record<string, string>,
		currentDeletedColumns: string[] = deletedColumns,
	) => {
		const errors: string[] = [];
		const duplicates: Record<string, string[]> = {};
		const templateFieldCounts: Record<string, string[]> = {};

		Object.entries(currentMappings).forEach(([csvField, templateField]) => {
			if (currentDeletedColumns.includes(csvField)) return;
			if (templateField && templateField !== "") {
				if (!templateFieldCounts[templateField]) {
					templateFieldCounts[templateField] = [];
				}
				templateFieldCounts[templateField].push(csvField);
			}
		});

		Object.entries(templateFieldCounts).forEach(
			([templateField, csvFields]) => {
				if (csvFields.length > 1) {
					duplicates[templateField] = csvFields;
					errors.push(
						`Template field "${templateField}" is mapped to multiple CSV fields: ${csvFields.join(", ")}`,
					);
				}
			},
		);

		setValidationErrors(errors);
		setDuplicateMappings(duplicates);

		return errors.length === 0;
	};

	const handleFieldChange = (key: string, value: string) => {
		const newMappings = {
			...mappings,
			[key]: value,
		};
		setMappings(newMappings);
		validateMappings(newMappings);
	};

	const handleToggleField = (key: string) => {
		let newDeletedColumns: string[];
		if (deletedColumns.includes(key)) {
			newDeletedColumns = deletedColumns.filter((c) => c !== key);
		} else {
			newDeletedColumns = [...deletedColumns, key];
		}
		setDeletedColumns(newDeletedColumns);
		validateMappings(mappings, newDeletedColumns);
	};

	const handleImport = () => {
		if (validateMappings(mappings)) {
			onImport(mappings, editedFileName, deletedColumns);
			onClose();
		}
	};

	const isDuplicateMapping = (csvField: string, templateField: string) => {
		if (deletedColumns.includes(csvField)) return false;
		return duplicateMappings[templateField]?.includes(csvField) || false;
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[800px]">
				<DialogHeader>
					<DialogTitle className="font-semibold text-xl">
						Quick Import - CSV
					</DialogTitle>
				</DialogHeader>

				<div className="mt-4 overflow-hidden rounded-md border">
					<div className="flex items-center border-b p-4">
						<ChevronDown className="mr-2 h-5 w-5" />
						<Input
							value={editedFileName}
							onChange={(e) => setEditedFileName(e.target.value)}
							className="border-0 p-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
						/>
					</div>

					<div className="bg-muted/50 p-4">
						<div className="grid grid-cols-3 gap-3 pb-2 font-medium text-muted-foreground">
							<div>Field Name</div>
							<div>Map To Template Field</div>
							<div className="text-center">Action</div>
						</div>
					</div>

					<div className="space-y-3 p-3">
						{Object.keys(mappings).map((key) => (
							<div key={key} className="grid grid-cols-3 items-center gap-3">
								<div>
									<div
										className={`w-full rounded-md border p-2 ${
											deletedColumns.includes(key)
												? "bg-gray-100 text-gray-400 line-through"
												: "bg-muted/20"
										}`}
									>
										{key}
									</div>
								</div>
								<div>
									<Select
										value={mappings[key]}
										onValueChange={(value) => handleFieldChange(key, value)}
										disabled={deletedColumns.includes(key)}
									>
										<SelectTrigger
											className={
												isDuplicateMapping(key, mappings[key]) &&
												!deletedColumns.includes(key)
													? "border-red-300 bg-red-50"
													: ""
											}
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{contactCSVTemplateFields.map((field) => (
												<SelectItem key={field} value={field}>
													{field}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{isDuplicateMapping(key, mappings[key]) &&
										!deletedColumns.includes(key) && (
											<p className="mt-1 text-red-500 text-xs">
												Duplicate mapping
											</p>
										)}
								</div>
								<div className="flex justify-center">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => handleToggleField(key)}
									>
										{deletedColumns.includes(key) ? (
											<RotateCcw className="h-5 w-5 text-green-500" />
										) : (
											<Trash2 className="h-5 w-5 text-muted-foreground" />
										)}
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>

				{validationErrors.length > 0 && (
					<div className="mt-4 space-y-2">
						{validationErrors.map((error, index) => (
							<Alert key={index} variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						))}
					</div>
				)}

				<DialogFooter className="mt-4 flex justify-between sm:justify-between">
					<Button onClick={handleImport} disabled={validationErrors.length > 0}>
						Configure
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
