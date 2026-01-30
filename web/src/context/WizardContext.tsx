import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import type { PromotionFormData } from "@/lib/promotionSchema";

type WizardStep = 1 | 2 | 3 | 4;

interface WizardContextType {
	currentStep: WizardStep;
	formData: Partial<PromotionFormData>;
	setStep: (step: WizardStep) => void;
	nextStep: () => void;
	prevStep: () => void;
	updateFormData: (data: Partial<PromotionFormData>) => void;
	canGoNext: boolean;
	setCanGoNext: (can: boolean) => void;
	isEditing: boolean;
	promotionId: string | null;
	isDirty: boolean;
	setIsDirty: (dirty: boolean) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const initialFormData: Partial<PromotionFormData> = {
	name: "",
	description: "",
	priority: 5,
	dateRange: undefined,
	activateImmediately: false,
	rules: [],
	rewards: [],
};

interface WizardProviderProps {
	children: React.ReactNode;
	initialData?: Partial<PromotionFormData>;
	isEditing?: boolean;
	promotionId?: string | null;
}

export function WizardProvider({
	children,
	initialData,
	isEditing = false,
	promotionId = null,
}: WizardProviderProps) {
	const [currentStep, setCurrentStep] = useState<WizardStep>(1);
	const [formData, setFormData] = useState<Partial<PromotionFormData>>(
		initialData || initialFormData,
	);
	const [canGoNext, setCanGoNext] = useState(false);
	const [isDirty, setIsDirty] = useState(false);

	// Reset form data when initialData changes (for edit mode)
	useEffect(() => {
		if (initialData) {
			setFormData(initialData);
			setIsDirty(false);
		}
	}, [initialData]);

	const setStep = useCallback((step: WizardStep) => {
		setCurrentStep(step);
	}, []);

	const nextStep = useCallback(() => {
		setCurrentStep((prev) => Math.min(prev + 1, 4) as WizardStep);
	}, []);

	const prevStep = useCallback(() => {
		setCurrentStep((prev) => Math.max(prev - 1, 1) as WizardStep);
	}, []);

	const updateFormData = useCallback((data: Partial<PromotionFormData>) => {
		setFormData((prev) => ({ ...prev, ...data }));
		setIsDirty(true);
	}, []);

	return (
		<WizardContext.Provider
			value={{
				currentStep,
				formData,
				setStep,
				nextStep,
				prevStep,
				updateFormData,
				canGoNext,
				setCanGoNext,
				isEditing,
				promotionId,
				isDirty,
				setIsDirty,
			}}
		>
			{children}
		</WizardContext.Provider>
	);
}

export function useWizard() {
	const context = useContext(WizardContext);
	if (!context) {
		throw new Error("useWizard must be used within a WizardProvider");
	}
	return context;
}
