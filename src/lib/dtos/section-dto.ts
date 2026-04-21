
export interface CategoryDTO {
    id: number | null;
    name: string;
    description: string;
    sectionId: number;
};



export interface SectionDTO {
    id: number | null;
    name: string;
    description: string;
    categories: CategoryDTO[] | null;
};
