import { ArrowLeft, Pencil, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom"; // <--- Para navegar al salir
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWizard, WizardProvider } from "@/context/WizardContext"; // <--- Importamos el Provider
import { Step1GeneralConfig } from "./Step1GeneralConfig";
import { Step2Rules } from "./Step2Rules";
import { Step3Rewards } from "./Step3Rewards";
import { Step4Summary } from "./Step4Summary";
import { WizardProgress } from "./WizardProgress";
import { WizardSkeleton } from "./WizardSkeleton";

interface PromotionWizardProps {
	onBack?: () => void;
	isLoading?: boolean;
}

// 1. Componente INTERNO: Contiene la lógica visual y usa el hook useWizard
function WizardContent({ onBack, isLoading = false }: PromotionWizardProps) {
	const { currentStep, isEditing, promotionId } = useWizard();
	const navigate = useNavigate();

	// Función para manejar el botón de volver
	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			navigate("/"); // Si no hay prop onBack, navegamos al home
		}
	};

	return (
		<div className="min-h-screen bg-background py-8 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<Button
						variant="ghost"
						onClick={handleBack}
						className="mb-4 text-muted-foreground hover:text-foreground"
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Volver al Dashboard
					</Button>

					<div className="text-center">
						<div className="inline-flex items-center justify-center gap-2 mb-4">
							<div
								className={`p-2 rounded-lg ${isEditing ? "bg-brand-orange/10" : "bg-brand-teal/10"}`}
							>
								{isEditing ? (
									<Pencil className="h-6 w-6 text-brand-orange" />
								) : (
									<Sparkles className="h-6 w-6 text-brand-teal" />
								)}
							</div>
							<h1 className="text-3xl font-bold text-foreground">
								{isEditing ? "Editar Promoción" : "Motor de Promociones"}
							</h1>
							{isEditing && promotionId && (
								<Badge
									variant="outline"
									className="ml-2 text-muted-foreground border-border"
								>
									#{promotionId}
								</Badge>
							)}
						</div>
						<p className="text-muted-foreground">
							{isEditing
								? "Modifica los detalles de tu promoción existente"
								: "Crea promociones inteligentes para tu minimarket"}
						</p>
					</div>
				</div>

				{/* Progress Bar */}
				<WizardProgress />

				{/* Step Content */}
				<Card className="mt-8 border-border shadow-sm">
					<CardContent className="p-6 md:p-8">
						{isLoading ? (
							<WizardSkeleton />
						) : (
							<>
								{currentStep === 1 && <Step1GeneralConfig />}
								{currentStep === 2 && <Step2Rules />}
								{currentStep === 3 && <Step3Rewards />}
								{currentStep === 4 && <Step4Summary />}
							</>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

// 2. Componente PRINCIPAL: Envuelve todo con el Provider
export function PromotionWizard(props: PromotionWizardProps) {
	return (
		<WizardProvider>
			<WizardContent {...props} />
		</WizardProvider>
	);
}
