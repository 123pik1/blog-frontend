import { api } from "$lib/apiClient";
import { API_ENDPOINTS } from "$lib/constants/api-endpoints";
import type { SectionDTO } from "$lib/dtos/section-dto";
import { sectionList } from "$lib/stores/structure";

async function getSections() {
    let sections = await api.get<SectionDTO[]>(API_ENDPOINTS.sections.list);
    if (sections) {
        sectionList.set(sections);
    }
    return sections;
}



export const sectionService = {
    list: () => getSections(),
    add: (section: SectionDTO) => api.post<SectionDTO[]>(API_ENDPOINTS.sections.create, section),
};
