import type { PromotionFormData } from "./promotionSchema";

export interface Promotion extends PromotionFormData {
	id: string;
	createdAt: Date;
}

export const mockPromotions: Promotion[] = [
	{
		id: "promo-1",
		name: "Descuento Lácteos VIP",
		description: "Descuento especial en productos lácteos para clientes VIP",
		priority: 1,
		dateRange: {
			from: new Date("2026-01-15"),
			to: new Date("2026-02-15"),
		},
		activateImmediately: true,
		rules: [
			{ id: "rule-1", type: "category", value: "dairy" },
			{ id: "rule-2", type: "customerTag", value: "vip" },
		],
		rewards: [{ id: "reward-1", type: "percentDiscount", value: 15 }],
		createdAt: new Date("2026-01-10"),
	},
	{
		id: "promo-2",
		name: "Compra Mínima $100",
		description: "Descuento fijo en compras mayores a $100",
		priority: 2,
		dateRange: {
			from: new Date("2026-01-01"),
			to: new Date("2026-01-31"),
		},
		activateImmediately: true,
		rules: [{ id: "rule-3", type: "minAmount", value: 100 }],
		rewards: [{ id: "reward-2", type: "fixedDiscount", value: 10 }],
		createdAt: new Date("2026-01-05"),
	},
	{
		id: "promo-3",
		name: "Regalo Bebidas",
		description: "Agua gratis en compras de snacks para clientes frecuentes",
		priority: 3,
		dateRange: {
			from: new Date("2026-02-01"),
			to: new Date("2026-03-01"),
		},
		activateImmediately: false,
		rules: [
			{ id: "rule-4", type: "category", value: "snacks" },
			{ id: "rule-5", type: "customerTag", value: "frequent" },
		],
		rewards: [{ id: "reward-3", type: "freeProduct", value: "water" }],
		createdAt: new Date("2026-01-20"),
	},
	{
		id: "promo-4",
		name: "Mayoristas Premium",
		description: "25% en panadería para clientes mayoristas",
		priority: 1,
		dateRange: {
			from: new Date("2026-01-20"),
			to: new Date("2026-04-20"),
		},
		activateImmediately: true,
		rules: [
			{ id: "rule-6", type: "customerTag", value: "wholesale" },
			{ id: "rule-7", type: "category", value: "bakery" },
		],
		rewards: [{ id: "reward-4", type: "percentDiscount", value: 25 }],
		createdAt: new Date("2026-01-18"),
	},
	{
		id: "promo-5",
		name: "Nuevos Clientes",
		description: "Chocolate de regalo en primera compra mayor a $50",
		priority: 5,
		dateRange: {
			from: new Date("2026-01-10"),
			to: undefined,
		},
		activateImmediately: false,
		rules: [
			{ id: "rule-8", type: "customerTag", value: "new" },
			{ id: "rule-9", type: "minAmount", value: 50 },
		],
		rewards: [{ id: "reward-5", type: "freeProduct", value: "chocolate" }],
		createdAt: new Date("2026-01-08"),
	},
];
