import "@tanstack/react-table"; //or vue, svelte, solid, qwik, etc.

declare module "@tanstack/react-table" {
	interface ColumnMeta<_TData extends RowData, _TValue> {
		hidden: boolean;
	}
}
