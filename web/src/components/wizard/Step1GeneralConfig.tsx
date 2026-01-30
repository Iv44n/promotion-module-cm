import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useWizard } from "@/context/WizardContext";
import { type Step1Data, step1Schema } from "@/lib/promotionSchema";
import { cn } from "@/lib/utils";

export function Step1GeneralConfig() {
	const { formData, updateFormData, nextStep } = useWizard();

	const form = useForm<Step1Data>({
		resolver: zodResolver(step1Schema),
		defaultValues: {
			name: formData.name || "",
			description: formData.description || "",
			priority: formData.priority || 5,
			dateRange: formData.dateRange,
			activateImmediately: formData.activateImmediately || false,
		},
		mode: "onChange",
	});

	const onSubmit = (data: Step1Data) => {
		updateFormData(data);
		nextStep();
	};

	return (
		<div className="space-y-6">
			<div className="space-y-2">
				<h2 className="text-2xl font-semibold text-text-dark">
					Detalles de la Campaña
				</h2>
				<p className="text-text-gray">
					Configura la información básica de tu promoción
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* Nombre de la promoción */}
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-text-dark font-medium">
									Nombre de la promoción *
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Ej: Promo Verano 2024"
										className="border-border focus:border-brand-teal focus:ring-brand-teal"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Descripción */}
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-text-dark font-medium">
									Descripción
								</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Describe los detalles de esta promoción..."
										className="min-h-[100px] border-border focus:border-brand-teal focus:ring-brand-teal resize-none"
										{...field}
									/>
								</FormControl>
								<FormDescription className="text-text-gray text-sm">
									Esta descripción será visible para el equipo interno
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Date Range Picker */}
					<FormField
						control={form.control}
						name="dateRange"
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel className="text-text-dark font-medium">
									Período de vigencia *
								</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant="outline"
												className={cn(
													"w-full md:w-[340px] justify-start text-left font-normal border-border",
													!field.value && "text-text-gray",
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4 text-brand-teal" />
												{field.value?.from ? (
													field.value.to ? (
														<>
															{format(field.value.from, "dd MMM yyyy", {
																locale: es,
															})}{" "}
															-{" "}
															{format(field.value.to, "dd MMM yyyy", {
																locale: es,
															})}
														</>
													) : (
														format(field.value.from, "dd MMM yyyy", {
															locale: es,
														})
													)
												) : (
													<span>Selecciona las fechas</span>
												)}
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent
										className="w-auto p-0 bg-background"
										align="start"
									>
										<Calendar
											initialFocus
											mode="range"
											defaultMonth={field.value?.from}
											selected={
												field.value?.from
													? { from: field.value.from, to: field.value.to }
													: undefined
											}
											onSelect={field.onChange}
											numberOfMonths={2}
											className="pointer-events-auto"
											disabled={(date) => {
												// Bloquea cualquier fecha menor al inicio del día de hoy (00:00:00)
												return date < new Date(new Date().setHours(0, 0, 0, 0));
											}}
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Activar inmediatamente */}
					<FormField
						control={form.control}
						name="activateImmediately"
						render={({ field }) => (
							<FormItem className="flex items-center justify-between rounded-lg border border-border p-4 bg-secondary/30">
								<div className="space-y-0.5">
									<FormLabel className="text-text-dark font-medium">
										Activar inmediatamente
									</FormLabel>
									<FormDescription className="text-text-gray text-sm">
										La promoción estará activa al guardarla
									</FormDescription>
								</div>
								<FormControl>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
										className="data-[state=checked]:bg-brand-teal"
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					{/* Submit Button */}
					<div className="flex justify-end pt-4">
						<Button
							type="submit"
							className="bg-brand-orange hover:bg-brand-orange-hover text-white font-medium px-8 py-2"
						>
							Siguiente
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
