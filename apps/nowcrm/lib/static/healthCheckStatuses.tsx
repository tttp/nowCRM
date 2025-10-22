import { AlertCircle, CheckCircle, Mail, PauseCircle } from "lucide-react";

export const getStatusIcon = (status: string) => {
	switch (status) {
		case "active":
			return <CheckCircle className="h-5 w-5 text-green-500" />;
		case "disabled":
			return <PauseCircle className="h-5 w-5 text-gray-500" />;
		case "invalid":
			return <AlertCircle className="h-5 w-5 text-red-500" />;
		default:
			return <Mail className="h-5 w-5 text-gray-500" />;
	}
};

export const getStatusColor = (status: string) => {
	switch (status) {
		case "active":
			return "bg-green-100 text-green-800";
		case "disabled":
			return "bg-gray-100 text-gray-800";
		case "invalid":
			return "bg-red-100 text-red-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};
