import type { Session } from "next-auth";
import { RowData } from "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    session: Session | null;
	step_id?: number;
	refreshData?: () => void;
  }
}