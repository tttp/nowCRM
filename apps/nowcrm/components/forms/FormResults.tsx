"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FormResultsProps {
	formId: number | string;
	results?: boolean;
}

const FormResults: React.FC<FormResultsProps> = ({ formId }) => {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-2xl">Form Results</h2>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Survey Results Placeholder</CardTitle>
				</CardHeader>
				<CardContent>
					<Alert>
						<AlertDescription>
							This is a placeholder for the form results visualization. Form ID:{" "}
							{formId}
						</AlertDescription>
					</Alert>
					<div className="mt-4 flex h-64 items-center justify-center rounded-md border border-dashed">
						<p className="text-muted-foreground">
							Charts will be displayed here
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
export default FormResults;
