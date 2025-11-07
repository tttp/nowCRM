import type { UseFormReturn } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { AsyncSelect } from "./AsyncSelect";
import type { Option } from "./autoComplete";
import { BaseServiceName } from "@nowcrm/services";

type Props = {
	name: string;
	label?: string;
	serviceName: BaseServiceName;
	form: UseFormReturn<any>;
	useFormClear: boolean;
	filterKey?: string | string[];
	filter?: Object;
	labelBuilder?: (item: any) => string;
	showDefaultCheckbox?: boolean;
	defaultOption?: Option;
	extraOptions?: Record<string, any>;
	deduplicateByLabel?: boolean;
};

export const AsyncSelectField = ({
	name,
	filter,
	filterKey,
	serviceName,
	useFormClear,
	form,
	label,
	labelBuilder,
	defaultOption,
	showDefaultCheckbox = false,
	extraOptions,
	deduplicateByLabel,
}: Props) => {
	const formValue = form.watch(`${name}`);
	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-col">
					<FormLabel className="flex items-center">{label}</FormLabel>
					<FormControl>
						<AsyncSelect
							serviceName={serviceName}
							onValueChange={(option) => field.onChange(option ?? null)}
							formValue={formValue}
							fetchFilters={filter}
							useFormClear={useFormClear}
							presetOption={field.value}
							filterKey={filterKey}
							label={label || ""}
							labelBuilder={labelBuilder}
							showDefaultCheckbox={showDefaultCheckbox}
							defaultOption={defaultOption}
							extraOptions={extraOptions}
							deduplicateByLabel={deduplicateByLabel}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
