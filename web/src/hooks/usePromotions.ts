import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//import type { Promotion } from '../lib/promotionSchema';
import { toast } from "sonner"; // O usa el hook use-toast.ts que tienes
import { promotionApi, type PromotionListItem } from "../api/promotions";

export const usePromotions = () => {
	return useQuery({
		queryKey: ["promotions"],
		queryFn: promotionApi.getAll,
	});
};

export const usePromotion = (id: string) => {
	return useQuery({
		queryKey: ["promotions", id],
		queryFn: () => promotionApi.getById(id),
		enabled: !!id, // Solo se ejecuta si hay ID
	});
};

export const useCreatePromotion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: promotionApi.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["promotions"] });
			toast.success("Promoción creada correctamente");
		},
		onError: () => {
			toast.error("Error al crear la promoción");
		},
	});
};

// --- NUEVO HOOK PARA PATCH (Actualizar estado) ---
export const useUpdatePromotion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// Recibimos ID y los datos a cambiar (ej: { isActive: true })
		mutationFn: ({
			id,
			data,
		}: { id: string; data: Partial<PromotionListItem> }) =>
			promotionApi.patch(id, data),
		onSuccess: () => {
			// Recargamos la tabla automáticamente
			queryClient.invalidateQueries({ queryKey: ["promotions"] });
			toast.success("Promoción actualizada");
		},
		onError: (error) => {
			console.error(error);
			toast.error("Error al actualizar la promoción");
		},
	});
};

export const useDeletePromotion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: promotionApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["promotions"] });
			toast.success("Promoción eliminada");
		},
		onError: () => {
			toast.error("Error al eliminar la promoción");
		},
	});
};