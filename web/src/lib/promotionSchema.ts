import { z } from "zod";

// --- MOCK DATA PARA REFERENCIA (Ya no se usan para validar estrictamente) ---
export const ruleTypes = [
	{ value: "MIN_AMOUNT", label: "Monto Mínimo de Venta" },
	{ value: "TARGET_CATEGORY", label: "Categoría Específica" },
] as const;

export const categories = [
	{ value: "073e7bb2-fd8d-4868-aa8c-b18d2ed16538", label: "Lácteos" },
	{ value: "073e7bb2-fd8d-4868-aa8c-b18d2ed16539", label: "Bebidas" },
	{ value: "073e7bb2-fd8d-4868-aa8c-b18d2ed16540", label: "Snacks" },
] as const;

export const customerTags = [
	{ value: "vip", label: "VIP" },
	{ value: "new", label: "Nuevo" },
] as const;

export const rewardTypes = [
	{ value: "PERCENTAGE_DISCOUNT", label: "Descuento Porcentual" },
	{ value: "FIXED_DISCOUNT", label: "Descuento Monto Fijo" },
] as const;

export const giftProducts = [
	{ value: "chocolate", label: "Barra de Chocolate" },
	{ value: "water", label: "Agua Mineral 500ml" },
] as const;

// --- SCHEMAS DINÁMICOS ---

// 1. Rule Schema (Actualizado para aceptar strings dinámicos)
const ruleSchema = z.object({
	id: z.string(),
	// CAMBIO CLAVE: Usamos string() en lugar de enum() para aceptar lo que venga del backend
	type: z.string().min(1, "Debes seleccionar un tipo de regla"),
	value: z.union([z.string(), z.number()]).refine((val) => {
		if (typeof val === "number") return val >= 0;
		return val.length > 0;
	}, "El valor es obligatorio"),
});

// 2. Reward Schema (Actualizado)
const rewardSchema = z.object({
	id: z.string(),
	// CAMBIO CLAVE: Igual aquí, aceptamos cualquier string del backend
	type: z.string().min(1, "Debes seleccionar un tipo de premio"),
	value: z.union([z.string(), z.number()]).refine((val) => {
		if (typeof val === "number") return val > 0;
		return val.length > 0;
	}, "El valor es obligatorio"),
});

// Step 1: General Configuration Schema
export const step1Schema = z.object({
	name: z.string().min(1, "El nombre de la promoción es obligatorio"),
	description: z.string().optional(),
	priority: z.coerce.number().min(1, "Mínimo 1").max(10, "Máximo 10"),
	dateRange: z
		.object({
			from: z.date({ required_error: "Fecha inicio requerida" }),
			to: z.date({ required_error: "Fecha fin requerida" }).optional(),
		})
		.refine((data) => !data.to || data.to > data.from, {
			message: "La fecha fin debe ser posterior a la fecha inicio",
			path: ["to"],
		}),
	activateImmediately: z.boolean().default(false),
});

// Step 2: Rules Schema
export const step2Schema = z.object({
	rules: z.array(ruleSchema).min(1, "Agrega al menos una regla"),
});

// Step 3: Rewards Schema
export const step3Schema = z.object({
	rewards: z.array(rewardSchema).min(1, "Agrega al menos un premio"),
});

// Complete Form Schema
export const promotionSchema = z.object({
	...step1Schema.shape,
	...step2Schema.shape,
	...step3Schema.shape,
});

export type Rule = z.infer<typeof ruleSchema>;
export type Reward = z.infer<typeof rewardSchema>;
export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;
export type PromotionFormData = z.infer<typeof promotionSchema>;

// Helpers para etiquetas legibles (Opcional: puedes actualizarlos o dejarlos)
export const getRuleTypeLabel = (type: string) =>
	ruleTypes.find((r) => r.value === type)?.label || type;

export const getRewardTypeLabel = (type: string) =>
	rewardTypes.find((r) => r.value === type)?.label || type;

export const getCategoryLabel = (value: string) =>
	categories.find((c) => c.value === value)?.label || value;

export const getCustomerTagLabel = (value: string) =>
	customerTags.find((c) => c.value === value)?.label || value;

export const getGiftProductLabel = (value: string) =>
	giftProducts.find((p) => p.value === value)?.label || value;
