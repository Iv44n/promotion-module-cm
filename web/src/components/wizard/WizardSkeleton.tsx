import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function WizardSkeleton() {
	return (
		<div className="space-y-6">
			{/* Header skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-4 w-96" />
			</div>

			{/* Form fields skeleton */}
			<div className="space-y-6">
				{/* Input field skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-10 w-full" />
				</div>

				{/* Textarea skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-24 w-full" />
				</div>

				{/* Two column fields */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-36" />
						<Skeleton className="h-10 w-full" />
					</div>
				</div>

				{/* Card skeleton (for rules/rewards) */}
				<Card className="border-border">
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>
							<Skeleton className="h-10 w-10 mt-6" />
						</div>
					</CardContent>
				</Card>

				{/* Another card skeleton */}
				<Card className="border-border">
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row gap-4">
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-10 w-full" />
							</div>
							<div className="flex-1 space-y-2">
								<Skeleton className="h-4 w-20" />
								<Skeleton className="h-10 w-full" />
							</div>
							<Skeleton className="h-10 w-10 mt-6" />
						</div>
					</CardContent>
				</Card>

				{/* Switch skeleton */}
				<div className="flex items-center justify-between rounded-lg border border-border p-4">
					<div className="space-y-2">
						<Skeleton className="h-4 w-36" />
						<Skeleton className="h-3 w-48" />
					</div>
					<Skeleton className="h-6 w-11 rounded-full" />
				</div>
			</div>

			{/* Navigation buttons skeleton */}
			<div className="flex justify-between pt-4">
				<Skeleton className="h-10 w-24" />
				<Skeleton className="h-10 w-32" />
			</div>
		</div>
	);
}
