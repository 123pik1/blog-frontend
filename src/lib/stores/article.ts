import { writable } from 'svelte/store';
import type { ArticleDTO } from '$lib/dtos/article-dto';

export const articleList = writable<ArticleDTO[]>([]);
