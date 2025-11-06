export interface FailedContact {
	email: string;
	reason: string;
}

export interface ImportRecord {
	id: string;
	filename: string;
	createdAt: string;
	status: string;
	progressPercent?: number;
	failedContacts?: FailedContact[];
	failedOrgs?: FailedOrg[];
	jobId: string;
	type?: string;
	massAction?: string | null;
	listName?: string | null;
	listField?: string | null;
	parsedSearchMask?: string;
}

export interface FailedOrg {
	name: string;
	reason: string;
}
