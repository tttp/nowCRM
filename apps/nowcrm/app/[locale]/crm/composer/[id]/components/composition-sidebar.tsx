"use client";

import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMessages } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getChannelIcon } from "@/lib/static/channel-icons";
import { AddChannelButton } from "./add-channel-button";
import { CommunicationChannelKeys } from "@nowcrm/services";

interface ChannelTab {
	id: string;
	label: string;
	channelName: string;
	status: string;
}

interface CompositionSidebarProps {
	activeTab: string;
	setActiveTab: (tab: string) => void;
	channelTabs: ChannelTab[];
	onAddChannel?: (channel: CommunicationChannelKeys) => void;
	isAddingChannel?: boolean;
}

export function CompositionSidebar({
	activeTab,
	setActiveTab,
	channelTabs,
	onAddChannel,
	isAddingChannel = false,
}: CompositionSidebarProps) {
	const router = useRouter();
	const t = useMessages().Composer.channelContent.overview;
	return (
		<div className="md:col-span-1">
			<Card>
				<CardContent className="p-4">
					<div className="mb-2 flex items-center justify-between">
						<span className="font-semibold">Channels</span>
						<Button
							variant="ghost"
							size="icon"
							aria-label="Refresh"
							onClick={() => router.refresh()}
						>
							<RefreshCcw className="h-4 w-4" />
						</Button>
					</div>
					<div className="space-y-1">
						<Button
							variant={activeTab === "overview" ? "default" : "ghost"}
							className="w-full justify-start"
							onClick={() => setActiveTab("overview")}
							type="button"
						>
							{t.overview}
						</Button>

						{channelTabs.map((tab) => {
							const Icon = getChannelIcon(tab.id);
							return (
								<Button
									key={tab.id}
									variant={activeTab === tab.id ? "default" : "ghost"}
									className="w-full justify-start"
									onClick={() => setActiveTab(tab.id)}
									type="button"
								>
									<Icon className="mr-2 h-4 w-4 shrink-0" />
									<div className="flex w-full min-w-0 items-center justify-between">
										<span className="truncate">{tab.label}</span>
										{tab.status && tab.status !== "None" && (
											<Badge
												variant="outline"
												className={`ml-1 shrink-0 ${
													tab.status === "Published"
														? "border-green-200 bg-green-100 text-green-800"
														: tab.status === "Scheduled"
															? "border-blue-200 bg-blue-100 text-blue-800"
															: "border-gray-200 bg-gray-100 text-gray-800"
												}`}
											>
												{tab.status}
											</Badge>
										)}
									</div>
								</Button>
							);
						})}

						{onAddChannel && (
							<AddChannelButton
								existingChannels={channelTabs.map((tab) => tab.channelName)}
								onAddChannel={onAddChannel}
								isLoading={isAddingChannel}
							/>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
