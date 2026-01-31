import type { PromotionBackendDTO } from "../lib/promotionSchema";
import { api } from "./axios";

// 1. Interfaz para lo que RECIBES en la lista (GET)
export interface PromotionListItem {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

// 2. Interfaz para lo que ENVÍAS al crear (POST)
export interface CreatePromotionPayload {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  condition: {
    conditionType: string;
    configuration: Record<string, any>;
  };
  action: {
    actionType: string;
    configuration: Record<string, any>;
  };
}

export const promotionApi = {
  // GET: Listar promociones
  getAll: async () => {
    const { data } = await api.get<PromotionListItem[]>("/promotions");
    return data;
  },

  // GET: Detalle
  getById: async (id: string) => {
    const { data } = await api.get<PromotionBackendDTO>(`/promotions/${id}`);
    return data;
  },

  // POST: Crear promoción
  create: async (payload: CreatePromotionPayload) => {
    const { data } = await api.post<PromotionListItem>("/promotions", payload);
    return data;
  },

  // PUT: Actualizar completa (si lo necesitas)
  update: async (id: string, payload: Partial<CreatePromotionPayload>) => {
    const { data } = await api.put<PromotionBackendDTO>(`/promotions/${id}`, payload);
    return data;
  },

  // PATCH: Actualizar parcialmente (Ideal para activar/desactivar)
  // --- NUEVO MÉTODO ---
  patch: async (id: string, payload: Partial<PromotionListItem>) => {
    const { data } = await api.patch<PromotionListItem>(`/promotions/${id}`, payload);
    return data;
  },

  // DELETE: Eliminar
  delete: async (id: string) => {
    await api.delete(`/promotions/${id}`);
  },
};