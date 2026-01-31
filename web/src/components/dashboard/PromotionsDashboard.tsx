import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
// Asegúrate de que este tipo coincida con el que exportas en tu API o Schema
import type { PromotionListItem } from "@/api/promotions";
import {
	useDeletePromotion,
	usePromotions,
	useUpdatePromotion,
} from "@/hooks/usePromotions";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardToolbar } from "./DashboardToolbar";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { PromotionsTable } from "./PromotionsTable";

// 1. Ya no necesitamos recibir props desde fuera
export const PromotionsDashboard = () => {
	const navigate = useNavigate();

	// HOOKS: Datos del servidor
	const { data: promotions, isLoading, isError } = usePromotions();
	const deleteMutation = useDeletePromotion();
	const updateMutation = useUpdatePromotion(); // <--- Inicializamos el hook
	// ESTADO: UI Local
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	// Ajusta el tipo aquí al que devuelve tu API (PromotionListItem)
	const [promotionToDelete, setPromotionToDelete] =
		useState<PromotionListItem | null>(null);

	// LÓGICA: Filtrado
	const filteredPromotions = useMemo(() => {
		const data = promotions || [];

		return data.filter((promo) => {
			// Filtro de Búsqueda
			const matchesSearch = promo.name
				.toLowerCase()
				.includes(searchQuery.toLowerCase());

			// Filtro de Estado
			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "active" && promo.isActive === true) ||
				(statusFilter === "inactive" && promo.isActive === false);

			return matchesSearch && matchesStatus;
		});
	}, [promotions, searchQuery, statusFilter]);


// --- ACCIONES CONECTADAS ---

	// 1. Activar / Desactivar (PATCH)
	const handleToggleStatus = (id: string, active: boolean) => {
		// Llamamos al hook con el ID y el dato que cambió
		updateMutation.mutate({
			id,
			data: { isActive: active },
		});
	};

	const handleEdit = (promotion: PromotionListItem) => {
		navigate(`/edit/${promotion.id}`);
	};

	const handleDuplicate = (_promotion: PromotionListItem) => {
		toast.info("Duplicar próximamente 🚧");
	};

	const handleDeleteClick = (promotion: PromotionListItem) => {
		setPromotionToDelete(promotion);
		setDeleteDialogOpen(true);
	};

	// 2. Confirmar Eliminación (DELETE)
	const handleConfirmDelete = () => {
		if (promotionToDelete) {
			deleteMutation.mutate(promotionToDelete.id);
			setDeleteDialogOpen(false);
			setPromotionToDelete(null);
		}
	};
	// RENDERIZADO CONDICIONAL (Loading/Error)
	if (isLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center">
				<Loader2 className="h-10 w-10 animate-spin text-brand-teal" />
				<span className="ml-3 text-lg font-medium text-gray-600">
					Cargando promociones...
				</span>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex h-screen w-full flex-col items-center justify-center text-red-500">
				<p>Hubo un error al conectar con el servidor.</p>
				<button
					type="button"
					onClick={() => window.location.reload()}
					className="mt-4 underline"
				>
					Reintentar
				</button>
			</div>
		);
	}

	// RENDERIZADO PRINCIPAL
	return (
		<div className="min-h-screen bg-background">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="space-y-8">
					{/* 2. Eliminamos la prop onNewPromotion aquí también */}
					<DashboardHeader />

					<DashboardToolbar
						searchQuery={searchQuery}
						onSearchChange={setSearchQuery}
						statusFilter={statusFilter}
						onStatusFilterChange={setStatusFilter}
					/>

					<PromotionsTable
						promotions={filteredPromotions}
						onToggleStatus={handleToggleStatus}
						onEdit={handleEdit}
						onDuplicate={handleDuplicate}
						onDelete={handleDeleteClick}
					/>
				</div>
			</div>

			<DeleteConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				promotionName={promotionToDelete?.name || ""}
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
};
