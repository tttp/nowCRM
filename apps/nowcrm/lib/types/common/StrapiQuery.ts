type StandardKeys<T> = {
	[K in keyof T]: T[K] extends object ? never : K; // Only keep keys that are not objects (primitive fields)
}[keyof T]; // This produces a union of keys that are not objects (i.e., primitive fields)

type RelationalKeys<T> = {
	[K in keyof T]: T[K] extends object ? K : never; // Only keep keys that map to objects
}[keyof T]; // This produces a union of keys that map to objects (i.e., relationships)

export type Operator = { value: string; label: string };
export const TEXT_OPERATORS: Operator[] = [
	{ value: "$eqi", label: "Equal" },
	{ value: "$nei", label: "Not equal" },
	{ value: "$containsi", label: "Contains" },
	{ value: "$notContainsi", label: "Does not contain" },
	{ value: "$startsWithi", label: "Starts with" },
	{ value: "$endsWithi", label: "Ends with" },
	{ value: "$null", label: "Is empty" },
	{ value: "$notNull", label: "Is not empty" },
];
export const NUMBER_OPERATORS: Operator[] = [
	{ value: "$eq", label: "Equal" },
	{ value: "$ne", label: "Not equal" },
	{ value: "$lt", label: "Less than" },
	{ value: "$lte", label: "Less than or equal to" },
	{ value: "$gt", label: "Greater than" },
	{ value: "$gte", label: "Greater than or equal to" },
	{ value: "$null", label: "Is empty" },
	{ value: "$notNull", label: "Is not empty" },
];
export const DATE_OPERATORS = NUMBER_OPERATORS;

type FilterOperators =
	| "$eq"
	| "$eqi"
	| "$ne"
	| "$nei"
	| "$lt"
	| "$lte"
	| "$gt"
	| "$gte"
	| "$in"
	| "$notIn"
	| "$contains"
	| "$notContains"
	| "$containsi"
	| "$notContainsi"
	| "$null"
	| "$notNull"
	| "$between"
	| "$startsWith"
	| "$startsWithi"
	| "$endsWith"
	| "$endsWithi";

type FilterOperatorsAndValues<T> = Partial<
	Record<Exclude<FilterOperators, "$null" | "$notNull">, T | (T | null)[]>
> & {
	$null?: true;
	$notNull?: true;
};

type FilterCondition<T> = {
	[K in keyof T]?: T[K] extends Array<infer U>
		? FilterCondition<U>
		: NonNullable<T[K]> extends object
			? FilterCondition<NonNullable<T[K]>>
			: FilterOperatorsAndValues<T[K]>;
};

type Filters<T> = {
	$or?: FilterCondition<T>[]; // Logical OR
	$and?: FilterCondition<T>[]; // Logical AND
	$not?: FilterCondition<T>[]; // Logical NOT
} & FilterCondition<T>;

type StrapiQuery<T> = {
	filters?: Filters<T>;
	fields?: Array<Extract<keyof T, string>>;
	sort?: Array<`${Extract<StandardKeys<T>, string>}:${"asc" | "desc"}`>;
	//TODO: remove any for deep populating cases
	populate?: Array<RelationalKeys<T>> | "*" | any;
	pagination?: {
		page?: number;
		pageSize?: number;
		total?: number;
		limit?: number;
		start?: number;
	};
	locale?: string;
};

export type StrapiConnect =
	| {
			connect?: number[];
			disconnect?: number[];
	  }
	| number[];

export default StrapiQuery;
