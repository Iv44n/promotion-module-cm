import { api } from "./axios";
export const getConditionsMetadata = async (): Promise<string[]> => {
	const { data } = await api.get("/promotions/metadata/conditions");
	return data; // Retorna ["TARGET_CATEGORY", "MIN_AMOUNT", ...]
};

export const getActionsMetadata = async (): Promise<string[]> => {
	const { data } = await api.get("/promotions/metadata/actions");
	return data; // Retorna ["PERCENTAGE_DISCOUNT", "FIXED_DISCOUNT", ...]
};
