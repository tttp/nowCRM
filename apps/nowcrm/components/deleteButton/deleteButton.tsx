"use client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { DeleteData } from "./deleteData";
import { BaseServiceName } from "@nowcrm/services/client";
import { DocumentId } from "@nowcrm/services";

interface deleteButtonProps {
	label: string;
	successMessage: string;
	redirectURL: string;
	serviceName: BaseServiceName;
	id: DocumentId;
}

export default function DeleteButton({
	label,
	successMessage,
	redirectURL,
	serviceName,
	id,
}: deleteButtonProps) {
	const router = useRouter();
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="destructive">{label}</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					onClick={async () => {
						await DeleteData(serviceName, id);
						toast.success(successMessage);
						router.replace(redirectURL);
					}}
				>
					Confirm
				</DropdownMenuItem>
				<DropdownMenuItem>Cancel</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
