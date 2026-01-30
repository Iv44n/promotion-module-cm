import { useQuery } from "@tanstack/react-query";
import { getActionsMetadata, getConditionsMetadata } from "@/api/metadataApi";

export const useConditionsMetadata = () => {
	return useQuery({
		queryKey: ["metadata", "conditions"],
		queryFn: getConditionsMetadata,
		staleTime: 1000 * 60 * 60, // 1 hora en caché
	});
};

export const useActionsMetadata = () => {
	return useQuery({
		queryKey: ["metadata", "actions"],
		queryFn: getActionsMetadata,
		staleTime: 1000 * 60 * 60,
	});
};
