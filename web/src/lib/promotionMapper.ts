import type { CreatePromotionPayload } from "@/api/promotions"; // <--- 1. Importamos el tipo compartido
import type { PromotionFormData } from "@/lib/promotionSchema";

export const mapFormDataToBackend = (
	formData: Partial<PromotionFormData>,
): CreatePromotionPayload => {
	// 1. Validaciones de seguridad
	if (!formData.rules?.[0] || !formData.rewards?.[0]) {
		throw new Error("La promoción debe tener al menos una regla y un premio.");
	}

	// Validación de fecha (asegura que dateRange y from existan)
	if (!formData.dateRange?.from) {
		throw new Error("La fecha de inicio es requerida.");
	}

	// Tomamos la PRIMERA regla y el PRIMER premio
	const rule = formData.rules[0];
	const reward = formData.rewards[0];

	// 2. Configuración Dinámica de la CONDICIÓN
	let conditionConfig: Record<string, any> = {};

	switch (rule.type) {
		case "TARGET_CATEGORY":
			conditionConfig = { categoryId: rule.value };
			break;
		case "MIN_AMOUNT":
			conditionConfig = { amount: Number(rule.value) };
			break;
		default:
			// Fallback para tipos futuros
			conditionConfig = { value: rule.value };
	}

	// 3. Configuración Dinámica de la ACCIÓN
	let actionConfig: Record<string, any> = {};

	switch (reward.type) {
		case "PERCENTAGE_DISCOUNT":
			actionConfig = { discountPercentage: Number(reward.value) };
			break;
		case "FIXED_DISCOUNT":
			actionConfig = { discountFixed: Number(reward.value) };
			break;
		// OJO: Si usas "freeProduct", verifica si el backend pide 'productId' o 'value'
		// case "freeProduct":
		//   actionConfig = { giftProductId: reward.value };
		//   break;
		default:
			actionConfig = { value: reward.value };
	}

	// 4. Retorno final usando los datos validados
	return {
		name: formData.name || "",
		description: formData.description || "",
		// Usamos el operador ! porque ya validamos arriba que dateRange.from existe
		startDate: formData.dateRange!.from.toISOString(),
		endDate: formData.dateRange!.to
			? formData.dateRange!.to.toISOString()
			: new Date(
					new Date().setFullYear(new Date().getFullYear() + 1),
				).toISOString(),
		isActive: formData.activateImmediately || false,
		condition: {
			conditionType: rule.type, // "TARGET_CATEGORY" | "MIN_AMOUNT"
			configuration: conditionConfig,
		},
		action: {
			actionType: reward.type, // "PERCENTAGE_DISCOUNT" | "FIXED_DISCOUNT"
			configuration: actionConfig,
		},
	};
};
