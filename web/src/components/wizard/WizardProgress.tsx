import { Check } from "lucide-react";
import { useWizard } from "@/context/WizardContext";
import { cn } from "@/lib/utils";

const steps = [
	{ number: 1, title: "Configuración" },
	{ number: 2, title: "Reglas" },
	{ number: 3, title: "Premios" },
	{ number: 4, title: "Resumen" },
];

export function WizardProgress() {
	const { currentStep } = useWizard();

	return (
		<div className="w-full px-4 py-6">
			<div className="flex items-center justify-between max-w-2xl mx-auto">
				{steps.map((step, index) => {
					const isCompleted = currentStep > step.number;
					const isActive = currentStep === step.number;
					const isLast = index === steps.length - 1;

					return (
						<div key={step.number} className="flex items-center flex-1">
							{/* Step Circle */}
							<div className="flex flex-col items-center">
								<div
									className={cn(
										"w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300",
										isCompleted
											? "bg-step-complete text-white"
											: isActive
												? "bg-step-active text-white ring-4 ring-step-active/20"
												: "bg-step-inactive text-text-gray",
									)}
								>
									{isCompleted ? <Check className="h-5 w-5" /> : step.number}
								</div>
								<span
									className={cn(
										"mt-2 text-xs font-medium whitespace-nowrap",
										isActive || isCompleted
											? "text-brand-teal"
											: "text-text-gray",
									)}
								>
									{step.title}
								</span>
							</div>

							{/* Connector Line */}
							{!isLast && (
								<div className="flex-1 mx-2">
									<div
										className={cn(
											"h-1 rounded-full transition-all duration-300",
											isCompleted ? "bg-step-complete" : "bg-connector-line",
										)}
									/>
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
