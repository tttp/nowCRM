"use client";
import { DateTimePicker } from "@/components/dateTimePicker";
import { TypographyH2 } from "@/components/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function ExamplePage() {
	return (
		<div className="container mx-auto max-w-3xl py-10">
			<Card>
				<CardHeader>
					<CardTitle>Date time picker example</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<TypographyH2>Day</TypographyH2>
					<DateTimePicker granularity="day" />

					<TypographyH2>Hour</TypographyH2>
					<DateTimePicker granularity="hour" />

					<TypographyH2>Minute</TypographyH2>
					<DateTimePicker granularity="minute" />

					<TypographyH2>Second</TypographyH2>
					<DateTimePicker granularity="second" />
				</CardContent>
			</Card>
		</div>
	);
}
