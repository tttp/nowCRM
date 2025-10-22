import type { Session } from "next-auth";

declare module "@tanstack/table-core" {
	interface TableMeta<_TData extends RowData> {
		session: Session | null;
		//both are needed for client data table inside journeys
		step_id?: number;
		refreshData: () => void;
	}
}
