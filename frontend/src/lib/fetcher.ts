import { apiRequest } from "../services/api";

export const fetcher = <T>(url: string) => apiRequest<T>(url);
