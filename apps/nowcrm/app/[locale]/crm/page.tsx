import { redirect } from "next/navigation";
import { RouteConfig } from "@/lib/config/RoutesConfig";

export default async function SignIn() {
	redirect(RouteConfig.contacts.base);
}
