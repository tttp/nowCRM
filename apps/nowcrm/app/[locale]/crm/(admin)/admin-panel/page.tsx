import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { RouteConfig } from "@/lib/config/RoutesConfig";
export const metadata: Metadata = {
	title: "Settings",
};

export default function Page() {
	redirect(RouteConfig.admin.admin_panel.channels);
}
