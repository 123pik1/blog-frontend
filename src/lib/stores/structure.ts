import type { SectionDTO } from "$lib/dtos/section-dto";
import { writable } from "svelte/store";

export const sectionList = writable<SectionDTO[]>([]);
export const currentSection = writable<number | null>(null);

