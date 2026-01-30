import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner"; // <--- Importamos toast
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useWizard } from "@/context/WizardContext";
import { useConditionsMetadata } from "@/hooks/useMetadata";
import { CONDITION_REGISTRY } from "@/lib/componentRegistry";
import { type Step2Data, step2Schema } from "@/lib/promotionSchema";

export function Step2Rules() {
	const { formData, updateFormData, nextStep, prevStep } = useWizard();

	// 1. Obtenemos las reglas disponibles del backend
	const { data: availableConditions = [], isLoading } = useConditionsMetadata();

	const form = useForm<Step2Data>({
		resolver: zodResolver(step2Schema),
		defaultValues: {
			rules: formData.rules?.length ? formData.rules : [],
		},
		mode: "onChange",
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "rules",
	});

	const addRule = () => {
		// Si ya existe 1 regla (o más), mostramos el mensaje y no agregamos nada
		if (fields.length >= 1) {
			toast.info("La funcionalidad de múltiples reglas está en desarrollo 🚧");
			return;
		}

		append({
			id: crypto.randomUUID(),
			type: availableConditions.length > 0 ? availableConditions[0] : "",
			value: "",
		});
	};

	const onSubmit = (data: Step2Data) => {
		updateFormData(data);
		nextStep();
	};

	const handleBack = () => {
		updateFormData({ rules: form.getValues().rules });
		prevStep();
	};

	if (isLoading)
		return (
			<div className="p-8 text-center text-muted-foreground">
				Cargando reglas disponibles...
			</div>
		);

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold text-text-dark">
					Condiciones para activar
				</h2>
				<p className="text-text-gray">
					Define las reglas que deben cumplirse para aplicar esta promoción
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Rules List */}
					<div className="space-y-4">
						{fields.map((field, index) => {
							// 2. Detectamos el tipo seleccionado para esta fila
							const currentType = form.watch(`rules.${index}.type`);
							// 3. Buscamos el componente correspondiente en el registro
							const RegistryEntry = CONDITION_REGISTRY[currentType];
							const DynamicComponent = RegistryEntry?.component;

							return (
								<div key={field.id}>
									{/* AND Connector */}
									{index > 0 && (
										<div className="flex items-center justify-center my-4">
											<div className="flex-1 h-px bg-connector-line" />
											<span className="mx-4 px-3 py-1 text-xs font-medium text-brand-teal bg-brand-teal/10 rounded-full border border-brand-teal/20">
												Y (AND)
											</span>
											<div className="flex-1 h-px bg-connector-line" />
										</div>
									)}

									<Card className="border-border hover:border-brand-teal/40 transition-colors">
										<CardContent className="pt-6">
											<div className="flex flex-col md:flex-row gap-4">
												{/* SELECTOR DE TIPO DE REGLA */}
												<FormField
													control={form.control}
													name={`rules.${index}.type`}
													render={({ field: typeField }) => (
														<FormItem className="flex-1">
															<FormLabel className="text-text-dark font-medium">
																Tipo de regla
															</FormLabel>
															<Select
																value={typeField.value}
																onValueChange={(value) => {
																	typeField.onChange(value);
																	// Reseteamos el valor al cambiar el tipo
																	form.setValue(`rules.${index}.value`, "");
																}}
															>
																<FormControl>
																	<SelectTrigger className="border-border focus:ring-brand-teal">
																		<SelectValue placeholder="Selecciona tipo" />
																	</SelectTrigger>
																</FormControl>
																<SelectContent className="bg-background border-border">
																	{/* Mapeamos lo que viene del BACKEND (availableConditions) */}
																	{availableConditions.map((conditionKey) => (
																		<SelectItem
																			key={conditionKey}
																			value={conditionKey}
																		>
																			{/* Usamos el label del registro o el key si falla */}
																			{CONDITION_REGISTRY[conditionKey]
																				?.label || conditionKey}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
															<FormMessage />
														</FormItem>
													)}
												/>

												{/* CAMPO DE VALOR DINÁMICO */}
												{currentType && DynamicComponent ? (
													<FormField
														control={form.control}
														name={`rules.${index}.value`}
														render={({ field: valueField }) => (
															// Aquí se renderiza el componente específico (MinAmount, Category, etc.)
															// que definimos en componentRegistry.tsx
															<DynamicComponent
																value={valueField.value}
																onChange={valueField.onChange}
															/>
														)}
													/>
												) : (
													// Placeholder si no hay tipo seleccionado
													<div className="flex-1 flex items-center justify-center border border-dashed border-border rounded-md bg-secondary/20 text-muted-foreground text-sm">
														{currentType
															? "Configuración no disponible"
															: "Selecciona una regla primero"}
													</div>
												)}

												{/* Delete Button */}
												<div className="flex items-end">
													<Button
														type="button"
														variant="ghost"
														size="icon"
														className="text-destructive hover:text-destructive hover:bg-destructive/10"
														onClick={() => remove(index)}
														// Evitar borrar si es el único (opcional, quita disabled si prefieres)
														disabled={fields.length === 0}
													>
														<Trash2 className="h-5 w-5" />
													</Button>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>
							);
						})}
					</div>

					{/* Add Rule Button */}
					<Button
						type="button"
						variant="outline"
						className="w-full border-dashed border-brand-teal text-brand-teal hover:bg-brand-teal/5 hover:text-brand-teal"
						onClick={addRule}
					>
						<Plus className="mr-2 h-4 w-4" />
						Añadir Regla
					</Button>

					{form.formState.errors.rules && (
						<p className="text-sm text-destructive">
							{form.formState.errors.rules.message}
						</p>
					)}

					{/* Navigation Buttons */}
					<div className="flex justify-between pt-4">
						<Button
							type="button"
							variant="outline"
							className="border-border text-text-dark hover:bg-secondary"
							onClick={handleBack}
						>
							Anterior
						</Button>
						<Button
							type="submit"
							className="bg-brand-orange hover:bg-brand-orange-hover text-white font-medium px-8"
						>
							Siguiente
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
