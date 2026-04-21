import { api } from "$lib/apiClient";
import { API_ENDPOINTS } from "$lib/constants/api-endpoints";
import type { CategoryDTO } from "$lib/dtos/section-dto";

export const categoryService = {
    list: () => api.get<CategoryDTO[]>(API_ENDPOINTS.categories.list),
    listFromSection: (sectionId: number) => api.get<CategoryDTO[]>(API_ENDPOINTS.categories.listFromSection(sectionId)),
    add: (cat: CategoryDTO) => api.post<CategoryDTO>(API_ENDPOINTS.categories.create, cat)
}
