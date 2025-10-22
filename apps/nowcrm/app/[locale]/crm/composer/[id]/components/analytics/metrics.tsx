import { CheckCircle, Clock, Eye, Mail, MousePointer } from "lucide-react";
import type { MetricConfig } from "@/lib/types/new_type/composition";

export interface ChannelAnalyticsConfig {
	channelName: string;
	title: string;
	metrics: MetricConfig[];
}

type MetricThreshold = {
	level: string;
	range: string;
	note?: string;
};

const metricThresholds: Record<string, MetricThreshold[]> = {
	"Delivery Rate": [
		{ level: "Excellent / Good", range: "≥ 95%" },
		{ level: "Satisfactory", range: "90% – 94.9%" },
		{ level: "Needs Improvement", range: "80% – 89.9%" },
		{
			level: "Poor / Bad",
			range: "< 80%",
			note: "Targets high deliverability; poor if below 80%.",
		},
	],
	"Hard Bounce Rate": [
		{ level: "Excellent / Good", range: "≤ 1.5%" },
		{ level: "Satisfactory", range: "1.6% – 3%" },
		{ level: "Needs Improvement", range: "3.1% – 5%" },
		{
			level: "Poor / Bad",
			range: "> 5%",
			note: "Above 5% indicates list problems.",
		},
	],
	"Soft Bounce Rate": [
		{ level: "Excellent / Good", range: "≤ 1.5%" },
		{ level: "Satisfactory", range: "1.6% – 3%" },
		{ level: "Needs Improvement", range: "3.1% – 5%" },
		{
			level: "Poor / Bad",
			range: "> 5%",
			note: "Above 5% indicates list problems.",
		},
	],
	"Open Rate": [
		{ level: "Excellent / Good", range: "≥ 30%" },
		{ level: "Satisfactory", range: "25% – 29.9%" },
		{ level: "Needs Improvement", range: "15% – 24.9%" },
		{
			level: "Poor / Bad",
			range: "< 15%",
			note: "Reflects engagement; poor below 15%.",
		},
	],
	"Click-Through Rate": [
		{ level: "Excellent / Good", range: "≥ 4.5%" },
		{ level: "Satisfactory", range: "2% - 2.99%" },
		{ level: "Needs Improvement", range: "1% - 1.99%" },
		{
			level: "Poor / Bad",
			range: "< 1%",
			note: "CTR gauges content relevance; critical if under 1%.",
		},
	],
	"Click-Open Rate": [
		{ level: "Excellent / Good", range: "≥ 20%" },
		{ level: "Satisfactory", range: "15% - 19.9%" },
		{ level: "Needs Improvement", range: "10% - 14.9%" },
		{
			level: "Poor / Bad",
			range: "< 10%",
			note: "CTOR reflects content value after opening; below 10% indicates issues.",
		},
	],
	"Unsubscribe Rate": [
		{ level: "Excellent / Good", range: "≤ 0.5%" },
		{ level: "Satisfactory", range: "0.51% – 1%" },
		{ level: "Needs Improvement", range: "1.01% – 1.5%" },
		{
			level: "Poor / Bad",
			range: "> 1.5%",
			note: "Poor indicates dissatisfaction.",
		},
	],
	Sent: [
		{ level: "Excellent / Good", range: "≥ 95%" },
		{ level: "Satisfactory", range: "95% – 80%" },
		{ level: "Needs Improvement", range: "80% – 70%" },
		{
			level: "Poor / Bad",
			range: "< 70%",
			note: "Measures sending success.",
		},
	],
	"Published (of Total)": [
		{ level: "Excellent / Good", range: "≥ 98%" },
		{ level: "Satisfactory", range: "95% – 97.9%" },
		{ level: "Needs Improvement", range: "90% – 94.9%" },
		{
			level: "Poor / Bad",
			range: "< 90%",
			note: "Measures technical deployment success.",
		},
	],
};

export const getMetricDescription = (label: string): string => {
	switch (label) {
		case "Published (of Total)":
			return "Number of messages accepted by the system for publishing, out of the total expected to be sent.";
		case "Sent":
			return "The total number of messages successfully sent.";
		case "Delivery Rate":
			return "The percentage of sent messages that were successfully delivered.";
		case "Open Rate":
			return "The percentage of delivered messages that were opened by recipients.";
		case "Hard Bounce Rate":
			return "The percentage of messages that failed to deliver. 𝗣𝗲𝗿𝗺𝗮𝗻𝗲𝗻𝘁 - the recipient's email provider indicated the email will never be delivered.";
		case "Soft Bounce Rate":
			return "The percentage of messages that failed to deliver. 𝗧𝗿𝗮𝗻𝘀𝗶𝗲𝗻𝘁 - the recipient's email provider indicated a temporary failure. 𝗨𝗻𝗱𝗲𝘁𝗲𝗿𝗺𝗶𝗻𝗲𝗱 - the recipient's email provider sent a bounce message, but SES couldn't determine the exact reason.";
		case "Click-Through Rate":
			return "The percentage of sent messages where a recipient clicked a link.";
		case "Click-Open Rate":
			return "The percentage of opened messages where a recipient clicked a link.";
		case "Unsubscribe Rate":
			return "The percentage of people who unsubscribed after the campaign was delivered.";
		default:
			return "";
	}
};

export const renderMetricThresholds = (label: string) => {
	const thresholds = metricThresholds[label];
	if (!thresholds) return null;

	return (
		<div className="mt-2 text-xs">
			<table className="w-full border-collapse border border-gray-300 text-left">
				<thead>
					<tr>
						<th className="border border-gray-300 px-2 py-1">Level</th>
						<th className="border border-gray-300 px-2 py-1">Range</th>
					</tr>
				</thead>
				<tbody>
					{thresholds.map((t, i) => (
						<tr key={i}>
							<td className="border border-gray-300 px-2 py-1">{t.level}</td>
							<td className="border border-gray-300 px-2 py-1">{t.range}</td>
						</tr>
					))}
				</tbody>
			</table>
			{thresholds.some((t) => t.note) && (
				<div className="mt-2 text-gray-600">
					{thresholds.map((t, i) => t.note && <div key={i}>• {t.note}</div>)}
				</div>
			)}
		</div>
	);
};

export const emailMetrics: MetricConfig[] = [
	{
		label: "Published (of Total)",
		actionTypes: "publish",
		mode: "fraction",
		denominatorActionTypes: ["publish", "unpublish"],
		Icon: <Mail className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
		bgColor: "bg-blue-100 dark:bg-blue-200",
		fgColor: "bg-blue-200 dark:bg-blue-300",
		textColor: "text-black",
	},
	{
		label: "Sent",
		actionTypes: "Send",
		mode: "percentage",
		denominatorActionTypes: "publish",
		threshold: 95,
		Icon: (
			<CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
		),
		bgColor: "bg-green-100 dark:bg-green-200",
		fgColor: "bg-green-200 dark:bg-green-300",
		textColor: "text-black",
	},
	{
		label: "Delivery Rate",
		actionTypes: "Delivery",
		mode: "percentage",
		denominatorActionTypes: "Send",
		threshold: 95,
		Icon: (
			<CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
		),
		bgColor: "bg-green-100 dark:bg-green-200",
		fgColor: "bg-green-200 dark:bg-green-300",
		textColor: "text-black",
	},
	{
		label: "Open Rate",
		actionTypes: "Open",
		mode: "percentage",
		denominatorActionTypes: "Delivery",
		threshold: 20,
		Icon: <Eye className="h-5 w-5 text-purple-600 dark:text-purple-500" />,
		bgColor: "bg-purple-100 dark:bg-purple-200",
		fgColor: "bg-purple-200 dark:bg-purple-300",
		textColor: "text-black",
	},
	{
		label: "Hard Bounce Rate",
		actionTypes: "Permanent Bounce",
		mode: "percentage",
		denominatorActionTypes: "Send",
		threshold: 2,
		invert: true,
		Icon: <Clock className="h-5 w-5 text-red-600 dark:text-red-500" />,
		bgColor: "bg-red-100 dark:bg-red-200",
		fgColor: "bg-red-200 dark:bg-red-300",
		textColor: "text-black",
	},
	{
		label: "Soft Bounce Rate",
		actionTypes: ["Transient Bounce", "Undetermined Bounce", "Bounce"],
		mode: "percentage",
		denominatorActionTypes: "Send",
		threshold: 3,
		invert: true,
		Icon: <Clock className="h-5 w-5 text-orange-600 dark:text-orange-500" />,
		bgColor: "bg-orange-100 dark:bg-orange-200",
		fgColor: "bg-orange-200 dark:bg-orange-300",
		textColor: "text-black",
	},
	{
		label: "Click-Through Rate",
		actionTypes: "Click",
		mode: "percentage",
		denominatorActionTypes: "Send",
		threshold: 2.5,
		Icon: <MousePointer className="h-5 w-5 text-cyan-600 dark:text-cyan-500" />,
		bgColor: "bg-cyan-100 dark:bg-cyan-200",
		fgColor: "bg-cyan-200 dark:bg-cyan-300",
		textColor: "text-black",
	},
	{
		label: "Click-Open Rate",
		actionTypes: "Click",
		mode: "percentage",
		denominatorActionTypes: "Open",
		threshold: 2.5,
		Icon: (
			<MousePointer className="h-5 w-5 text-purple-600 dark:text-purple-500" />
		),
		bgColor: "bg-purple-100 dark:bg-purple-200",
		fgColor: "bg-purple-200 dark:bg-purple-300",
		textColor: "text-black",
	},
	{
		label: "Unsubscribe Rate",
		actionTypes: "unsubscribe",
		mode: "percentage",
		denominatorActionTypes: "Delivery",
		threshold: 5,
		invert: true,
		Icon: <Mail className="h-5 w-5 text-red-600 dark:text-red-500" />,
		bgColor: "bg-red-100 dark:bg-red-200",
		fgColor: "bg-red-200 dark:bg-red-300",
		textColor: "text-black",
	},
];

const totalPublishedMetric: MetricConfig = {
	label: "Total Published",
	actionTypes: "publish",
	mode: "count",
	Icon: <Mail className="h-5 w-5 text-blue-600 dark:text-blue-500" />,
	bgColor: "bg-blue-100 dark:bg-blue-200",
	fgColor: "bg-blue-200 dark:bg-blue-300",
	textColor: "text-black",
};

export const channelAnalyticsConfigs: ChannelAnalyticsConfig[] = [
	{
		channelName: "email",
		title: "Email Analytics",
		metrics: emailMetrics,
	},
	{
		channelName: "sms",
		title: "SMS Analytics",
		metrics: [totalPublishedMetric],
	},
	{
		channelName: "linkedin",
		title: "LinkedIn Analytics",
		metrics: [totalPublishedMetric],
	},
	{
		channelName: "whatsapp",
		title: "WhatsApp Analytics",
		metrics: [totalPublishedMetric],
	},
	{
		channelName: "telegram",
		title: "Telegram Analytics",
		metrics: [totalPublishedMetric],
	},
	{
		channelName: "twitter",
		title: "Twitter Analytics",
		metrics: [totalPublishedMetric],
	},
	// {
	// 	channelName: "linkedin_messaging",
	// 	title: "LinkedIn Messaging Analytics",
	// 	metrics: [totalPublishedMetric],
	// },
	{
		channelName: "linkedin_invitations",
		title: "LinkedIn Invitations Analytics",
		metrics: [totalPublishedMetric],
	},
	{
		channelName: "blog",
		title: "Blog Analytics",
		metrics: [totalPublishedMetric],
	},
];

export const metricColorVariants = {
	blue: {
		icon: "text-blue-600 dark:text-blue-500",
		bg: "bg-blue-100 dark:bg-blue-200",
		fg: "bg-blue-200 dark:bg-blue-300",
		text: "text-black",
		border: "border-blue-200 dark:border-blue-300",
	},
	indigo: {
		icon: "text-indigo-600 dark:text-indigo-500",
		bg: "bg-indigo-100 dark:bg-indigo-200",
		fg: "bg-indigo-200 dark:bg-indigo-300",
		text: "text-black",
		border: "border-indigo-200 dark:border-indigo-300",
	},
	green: {
		icon: "text-green-600 dark:text-green-500",
		bg: "bg-green-100 dark:bg-green-200",
		fg: "bg-green-200 dark:bg-green-300",
		text: "text-black",
		border: "border-green-200 dark:border-green-300",
	},
	purple: {
		icon: "text-purple-600 dark:text-purple-500",
		bg: "bg-purple-100 dark:bg-purple-200",
		fg: "bg-purple-200 dark:bg-purple-300",
		text: "text-black",
		border: "border-purple-200 dark:border-purple-300",
	},
	orange: {
		icon: "text-orange-600 dark:text-orange-500",
		bg: "bg-orange-100 dark:bg-orange-200",
		fg: "bg-orange-200 dark:bg-orange-300",
		text: "text-black",
		border: "border-orange-200 dark:border-orange-300",
	},
	cyan: {
		icon: "text-cyan-600 dark:text-cyan-500",
		bg: "bg-cyan-100 dark:bg-cyan-200",
		fg: "bg-cyan-200 dark:bg-cyan-300",
		text: "text-black",
		border: "border-cyan-200 dark:border-cyan-300",
	},
	yellow: {
		icon: "text-yellow-600 dark:text-yellow-500",
		bg: "bg-yellow-100 dark:bg-yellow-200",
		fg: "bg-yellow-200 dark:bg-yellow-300",
		text: "text-black",
		border: "border-yellow-200 dark:border-yellow-300",
	},
	pink: {
		icon: "text-pink-600 dark:text-pink-500",
		bg: "bg-pink-100 dark:bg-pink-200",
		fg: "bg-pink-200 dark:bg-pink-300",
		text: "text-black",
		border: "border-pink-200 dark:border-pink-300",
	},
} as const;
