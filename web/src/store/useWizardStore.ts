import { create } from "zustand";
import type { PromotionFormData } from "../lib/promotionSchema";

interface WizardState {
	currentStep: number;
	formData: Partial<PromotionFormData>;
	isEditing: boolean;

	// Acciones
	setStep: (step: number) => void;
	updateFormData: (data: Partial<PromotionFormData>) => void;
	resetWizard: () => void;
	initializeWizard: (data?: PromotionFormData) => void; // Para modo edición
}

export const useWizardStore = create<WizardState>((set) => ({
	currentStep: 1,
	isEditing: false,
	formData: {
		rules: [],
		isActive: true,
		// Inicializa aquí valores por defecto si es necesario
	},

	setStep: (step) => set({ currentStep: step }),

	updateFormData: (newData) =>
		set((state) => ({
			formData: { ...state.formData, ...newData },
		})),

	resetWizard: () =>
		set({
			currentStep: 1,
			isEditing: false,
			formData: { rules: [], activateImmediately: true },
		}),

	initializeWizard: (data) => {
		if (data) {
			set({ formData: data, isEditing: true, currentStep: 1 });
		} else {
			set({
				formData: { rules: [], activateImmediately: true },
				isEditing: false,
				currentStep: 1,
			});
		}
	},
}));
