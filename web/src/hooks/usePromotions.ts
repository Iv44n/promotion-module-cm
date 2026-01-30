import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//import type { Promotion } from '../lib/promotionSchema';
import { toast } from "sonner"; // O usa el hook use-toast.ts que tienes
import { promotionApi } from "../api/promotions";

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

export const useDeletePromotion = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: promotionApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["promotions"] });
			toast.success("Promoción eliminada");
		},
	});
};
