import { zodResolver } from "@hookform/resolvers/zod";
import { Gift, Plus, Trash2 } from "lucide-react";
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
// Importamos los hooks y el registro dinámico
import { useActionsMetadata } from "@/hooks/useMetadata";
import { ACTION_REGISTRY } from "@/lib/componentRegistry";
import { type Step3Data, step3Schema } from "@/lib/promotionSchema";

export function Step3Rewards() {
	const { formData, updateFormData, nextStep, prevStep } = useWizard();

	// 1. Obtenemos los tipos de premios disponibles del backend
	const { data: availableActions = [], isLoading } = useActionsMetadata();

	const form = useForm<Step3Data>({
		resolver: zodResolver(step3Schema),
		defaultValues: {
			rewards: formData.rewards?.length ? formData.rewards : [],
		},
		mode: "onChange",
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "rewards",
	});

	const addReward = () => {
		if (fields.length >= 1) {
			toast.info("La funcionalidad de múltiples premios está en desarrollo 🚧");
			return;
		}

		append({
			id: crypto.randomUUID(),
			type: availableActions.length > 0 ? availableActions[0] : "",
			value: "",
		});
	};

	const onSubmit = (data: Step3Data) => {
		updateFormData(data);
		nextStep();
	};

	const handleBack = () => {
		updateFormData({ rewards: form.getValues().rewards });
		prevStep();
	};

	if (isLoading)
		return (
			<div className="p-8 text-center text-muted-foreground">
				Cargando premios disponibles...
			</div>
		);

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold text-text-dark">
					Beneficios a otorgar
				</h2>
				<p className="text-text-gray">
					Define los premios que recibirá el cliente al cumplir las condiciones
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Rewards List */}
					<div className="space-y-4">
						{fields.map((field, index) => {
							// 2. Detectamos el tipo seleccionado
							const currentType = form.watch(`rewards.${index}.type`);
							// 3. Buscamos el componente en el registro
							const RegistryEntry = ACTION_REGISTRY[currentType];
							const DynamicComponent = RegistryEntry?.component;

							return (
								<Card
									key={field.id}
									className="border-border hover:border-brand-teal/40 transition-colors"
								>
									<CardContent className="pt-6">
										<div className="flex items-start gap-3 mb-4">
											<div className="p-2 rounded-lg bg-brand-orange/10">
												<Gift className="h-5 w-5 text-brand-orange" />
											</div>
											<span className="text-sm font-medium text-text-gray mt-2">
												Premio #{index + 1}
											</span>
										</div>

										<div className="flex flex-col md:flex-row gap-4">
											{/* SELECTOR DE TIPO DE PREMIO */}
											<FormField
												control={form.control}
												name={`rewards.${index}.type`}
												render={({ field: typeField }) => (
													<FormItem className="flex-1">
														<FormLabel className="text-text-dark font-medium">
															Tipo de premio
														</FormLabel>
														<Select
															value={typeField.value}
															onValueChange={(value) => {
																typeField.onChange(value);
																// Reseteamos valor al cambiar tipo
																form.setValue(`rewards.${index}.value`, "");
															}}
														>
															<FormControl>
																<SelectTrigger className="border-border focus:ring-brand-teal">
																	<SelectValue placeholder="Selecciona tipo" />
																</SelectTrigger>
															</FormControl>
															<SelectContent className="bg-background border-border">
																{/* Mapeamos availableActions desde el Backend */}
																{availableActions.map((actionKey) => (
																	<SelectItem key={actionKey} value={actionKey}>
																		{/* Usamos el label del registro */}
																		{ACTION_REGISTRY[actionKey]?.label ||
																			actionKey}
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
													name={`rewards.${index}.value`}
													render={({ field: valueField }) => (
														<DynamicComponent
															value={valueField.value}
															onChange={valueField.onChange}
														/>
													)}
												/>
											) : (
												<div className="flex-1 flex items-center justify-center border border-dashed border-border rounded-md bg-secondary/20 text-muted-foreground text-sm h-[74px]">
													{currentType
														? "Configuración no disponible"
														: "Selecciona un premio primero"}
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
													disabled={fields.length === 0}
												>
													<Trash2 className="h-5 w-5" />
												</Button>
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>

					{/* Add Reward Button */}
					<Button
						type="button"
						variant="outline"
						className="w-full border-dashed border-brand-orange text-brand-orange hover:bg-brand-orange/5 hover:text-brand-orange"
						onClick={addReward}
					>
						<Plus className="mr-2 h-4 w-4" />
						Añadir Premio
					</Button>

					{form.formState.errors.rewards && (
						<p className="text-sm text-destructive">
							{form.formState.errors.rewards.message}
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
