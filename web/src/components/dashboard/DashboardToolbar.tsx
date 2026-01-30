import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface DashboardToolbarProps {
	searchQuery: string;
	onSearchChange: (value: string) => void;
	statusFilter: string;
	onStatusFilterChange: (value: string) => void;
}

export const DashboardToolbar = ({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
}: DashboardToolbarProps) => {
	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="relative w-full sm:max-w-xs">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<Input
					placeholder="Buscar por nombre..."
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					className="pl-9"
				/>
			</div>
			<Select value={statusFilter} onValueChange={onStatusFilterChange}>
				<SelectTrigger className="w-full sm:w-[180px]">
					<SelectValue placeholder="Filtrar por estado" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">Todas</SelectItem>
					<SelectItem value="active">Activas</SelectItem>
					<SelectItem value="inactive">Inactivas</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};
