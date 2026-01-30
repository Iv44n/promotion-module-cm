import type React from "react";
import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// --- MOCK DATA PARA CATEGORÍAS ---
const MOCK_CATEGORIES = [
	{ id: "073e7bb2-fd8d-4868-aa8c-b18d2ed16538", name: "Lácteos" },
	{ id: "073e7bb2-fd8d-4868-aa8c-b18d2ed16539", name: "Bebidas" },
	{ id: "073e7bb2-fd8d-4868-aa8c-b18d2ed16540", name: "Snacks" },
];

// --- INTERFAZ COMÚN PARA TODOS LOS CAMPOS ---
interface DynamicFieldProps {
	value: any;
	onChange: (value: any) => void;
}

// ==========================================
// 1. COMPONENTES DE REGLAS (CONDITIONS)
// ==========================================

const MinAmountInput = ({ value, onChange }: DynamicFieldProps) => (
	<FormItem className="flex-1">
		<FormLabel className="text-text-dark font-medium">
			Monto mínimo ($)
		</FormLabel>
		<FormControl>
			<Input
				type="number"
				min={0}
				placeholder="Ej: 50"
				className="border-border focus:border-brand-teal focus:ring-brand-teal"
				value={value || ""}
				onChange={(e) => onChange(Number(e.target.value))}
			/>
		</FormControl>
		<FormMessage />
	</FormItem>
);

const CategorySelect = ({ value, onChange }: DynamicFieldProps) => (
	<FormItem className="flex-1">
		<FormLabel className="text-text-dark font-medium">
			Categoría Específica
		</FormLabel>
		<Select value={value} onValueChange={onChange}>
			<FormControl>
				<SelectTrigger className="border-border focus:ring-brand-teal">
					<SelectValue placeholder="Selecciona categoría" />
				</SelectTrigger>
			</FormControl>
			<SelectContent>
				{MOCK_CATEGORIES.map((cat) => (
					<SelectItem key={cat.id} value={cat.id}>
						{cat.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
		<FormMessage />
	</FormItem>
);

// ==========================================
// 2. COMPONENTES DE PREMIOS (ACTIONS)
// ==========================================

const PercentageDiscountInput = ({ value, onChange }: DynamicFieldProps) => (
	<FormItem className="flex-1">
		<FormLabel className="text-text-dark font-medium">
			Porcentaje de Descuento (%)
		</FormLabel>
		<FormControl>
			<Input
				type="number"
				min={1}
				max={100}
				placeholder="Ej: 10"
				className="border-border focus:border-brand-teal focus:ring-brand-teal"
				value={value || ""}
				onChange={(e) => {
					const val = Math.min(100, Math.max(0, Number(e.target.value)));
					onChange(val);
				}}
			/>
		</FormControl>
		<FormMessage />
	</FormItem>
);

const FixedDiscountInput = ({ value, onChange }: DynamicFieldProps) => (
	<FormItem className="flex-1">
		<FormLabel className="text-text-dark font-medium">
			Descuento Monto Fijo ($)
		</FormLabel>
		<FormControl>
			<Input
				type="number"
				min={1}
				placeholder="Ej: 500"
				className="border-border focus:border-brand-teal focus:ring-brand-teal"
				value={value || ""}
				onChange={(e) => onChange(Number(e.target.value))}
			/>
		</FormControl>
		<FormMessage />
	</FormItem>
);

// ==========================================
// 3. REGISTROS (MAPAS)
// ==========================================

// Aquí mapeas: "LO_QUE_MANDA_EL_BACKEND" : { etiqueta, componente }
export const CONDITION_REGISTRY: Record<
	string,
	{ label: string; component: React.FC<DynamicFieldProps> }
> = {
	MIN_AMOUNT: {
		label: "Monto Mínimo de Venta",
		component: MinAmountInput,
	},
	TARGET_CATEGORY: {
		label: "Categoría Específica",
		component: CategorySelect,
	},
	// ¡Aquí agregarías futuras reglas fácilmente!
};

export const ACTION_REGISTRY: Record<
	string,
	{ label: string; component: React.FC<DynamicFieldProps> }
> = {
	PERCENTAGE_DISCOUNT: {
		label: "Descuento Porcentual",
		component: PercentageDiscountInput,
	},
	FIXED_DISCOUNT: {
		label: "Descuento Fijo",
		component: FixedDiscountInput,
	},
};
