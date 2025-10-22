import { Label } from "recharts";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const SaveDialog = ({
	open,
	onOpenChange,
	newSearchName,
	setNewSearchName,
	calculateActiveFilters,
	handleSaveCurrent,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	newSearchName: string;
	setNewSearchName: React.Dispatch<React.SetStateAction<string>>;
	calculateActiveFilters: () => number;
	handleSaveCurrent: () => void;
}) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Save Search</DialogTitle>
					<DialogDescription>
						Give your search a name to save it for future use.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label>Search Name</Label>
						<Input
							id="search-name"
							placeholder="e.g., Active Customers in NY"
							value={newSearchName}
							onChange={(e) => setNewSearchName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && newSearchName.trim()) {
									e.preventDefault();
									handleSaveCurrent();
								}
							}}
						/>
					</div>
					<div className="rounded-md bg-muted/50 p-3">
						<p className="text-muted-foreground text-sm">
							This will save your current filter configuration with{" "}
							{calculateActiveFilters()} active filter
							{calculateActiveFilters() !== 1 ? "s" : ""}.
						</p>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSaveCurrent} disabled={!newSearchName.trim()}>
						Save Search
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
