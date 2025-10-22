// Define a standardized response interface
export interface StandardResponse<T> {
	data: T | null;
	status: number;
	success: boolean;
	errorMessage?: string;
	meta?: {
		pagination: {
			page: number;
			pageSize: number;
			pageCount: number;
			total: number;
		};
	};
}

function processItem(item: any): any {
	if (item === null || item === undefined) {
		return item;
	} else if (Array.isArray(item)) {
		return item.map(processItem);
	} else if (typeof item === "object") {
		if ("id" in item && "attributes" in item) {
			const { id, attributes } = item;
			return { id, ...processItem(attributes) };
		} else if ("data" in item) {
			return processItem(item.data);
		} else {
			const processedItem: any = {};
			for (const key in item) {
				processedItem[key] = processItem(item[key]);
			}
			return processedItem;
		}
	} else {
		return item;
	}
}

// Handle successful responses
export async function handleResponse<T>(
	response: Response,
): Promise<StandardResponse<T>> {
	const status = response.status;
	const success = response.ok;
	try {
		const json = await response.json();
		let data: T | null = null;
		let meta: any;
		let errorMessage: any;
		if (json.data) {
			data = processItem(json.data) as T;
			meta = json.meta;
		} else {
			data = processItem(json) as T;
		}
		if (json.error) {
			// Extract detailed error information
			const errorDetails = json.error.details || json.error.detail;
			let detailedMessage = json.error.message || "Unknown error";

			// If there are detailed validation errors, extract them
			if (errorDetails) {
				if (typeof errorDetails === "string") {
					detailedMessage += ` - ${errorDetails}`;
				} else if (Array.isArray(errorDetails?.errors)) {
					// Handle array of validation errors
					const fieldErrors = errorDetails.errors
						.map((err: any) => {
							const field = err.path?.join(".") || err.field || "unknown field";
							const message = err.message || "validation failed";
							return `${field}: ${message}`;
						})
						.join("; ");
					detailedMessage += ` - ${fieldErrors}`;
				} else if (typeof errorDetails === "object") {
					// Handle object with error details
					const errorInfo = Object.entries(errorDetails)
						.map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
						.join("; ");
					detailedMessage += ` - ${errorInfo}`;
				}
			}

			errorMessage = `${json.error.status} - ${detailedMessage}`;
		}

		return {
			data,
			status,
			success,
			meta,
			errorMessage,
		};
	} catch (_error) {
		return {
			data: null,
			status,
			success: false,
			errorMessage: "Failed to parse response JSON.",
		};
	}
}

// Handle errors
export function handleError<T>(error: any): StandardResponse<T> {
	return {
		data: null,
		status: error.status || 500,
		success: false,
		errorMessage: error.message || "An unknown error occurred.",
	};
}
