import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
// Importamos el tipo real que definimos para el backend
import type { PromotionBackendDTO } from "@/lib/promotionSchema";

interface PromotionsTableProps {
	promotions: PromotionBackendDTO[];
	onToggleStatus: (id: string, active: boolean) => void;
	onEdit: (promotion: PromotionBackendDTO) => void;
	onDuplicate: (promotion: PromotionBackendDTO) => void;
	onDelete: (promotion: PromotionBackendDTO) => void;
}

export const PromotionsTable = ({
	promotions,
	onToggleStatus,
	onEdit,
	onDuplicate,
	onDelete,
}: PromotionsTableProps) => {
	const formatDateRange = (
		startDate: string | Date,
		endDate: string | Date,
	) => {
		// 1. Intentar convertir a objetos Date
		const start = new Date(startDate);
		const end = endDate ? new Date(endDate) : null;

		// 2. VERIFICACIÓN DE SEGURIDAD
		// isValid verifica si la fecha es real. Si start.getTime() es NaN, es inválida.
		const isStartValid = !Number.isNaN(start.getTime());
		const isEndValid = end ? !Number.isNaN(end.getTime()) : true; // Si es null se considera válido (sin fin)

		if (!isStartValid) {
			console.error("Fecha de inicio inválida:", startDate);
			return "Fecha inválida"; // Retorno seguro para no romper la app
		}

		// 3. Formateo seguro
		const fromStr = format(start, "dd MMM", { locale: es });

		if (!end || !isEndValid) {
			return `${fromStr} - Sin fin`;
		}

		const toStr = format(end, "dd MMM", { locale: es });
		return `${fromStr} - ${toStr}`;
	};

	if (promotions.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
				<p className="text-muted-foreground">No se encontraron promociones</p>
			</div>
		);
	}
	console.log("Datos recibidos en tabla:", promotions);
	return (
		<div className="rounded-lg border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="min-w-[200px]">Nombre</TableHead>
						<TableHead>Estado</TableHead>
						<TableHead>Vigencia</TableHead>
						<TableHead className="text-center">Activa</TableHead>
						<TableHead className="text-right">Acciones</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{promotions.map((promotion) => (
						<TableRow key={promotion.id}>
							<TableCell>
								<div>
									<p className="font-medium text-foreground">
										{promotion.name}
									</p>
									{promotion.description && (
										<p className="text-sm text-muted-foreground line-clamp-1">
											{promotion.description}
										</p>
									)}
								</div>
							</TableCell>
							<TableCell>
								<Badge
									// CAMBIO: Usamos isActive
									variant={promotion.isActive ? "default" : "secondary"}
									className={
										promotion.isActive
											? "bg-brand-teal hover:bg-brand-teal/90"
											: ""
									}
								>
									{/* CAMBIO: Usamos isActive */}
									{promotion.isActive ? "Activa" : "Inactiva"}
								</Badge>
							</TableCell>
							<TableCell className="text-muted-foreground">
								{formatDateRange(promotion.startDate, promotion.endDate)}
							</TableCell>

							<TableCell className="text-center">
								<Switch
									checked={promotion.isActive}
									onCheckedChange={(checked) =>
										onToggleStatus(promotion.id, checked)
									}
									className="data-[state=checked]:bg-brand-teal"
								/>
							</TableCell>
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<MoreHorizontal className="h-4 w-4" />
											<span className="sr-only">Abrir menú</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => onEdit(promotion)}>
											<Pencil className="mr-2 h-4 w-4" />
											Editar
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => onDuplicate(promotion)}>
											<Copy className="mr-2 h-4 w-4" />
											Duplicar
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => onDelete(promotion)}
											className="text-destructive focus:text-destructive"
										>
											<Trash2 className="mr-2 h-4 w-4" />
											Eliminar
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};
