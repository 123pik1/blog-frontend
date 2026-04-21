import { api } from "$lib/apiClient";
import { API_ENDPOINTS } from "$lib/constants/api-endpoints";
import type { ArticleDTO } from "$lib/dtos/article-dto";
import { articleList } from "$lib/stores/article";


export const articleService = {
    getAll: async () => {
        const data = await api.get<ArticleDTO[]>(API_ENDPOINTS.articles.list);
        if (data)
            articleList.set(data);
        return data;
    },
    getById: (id: string | number) => api.get<ArticleDTO>(API_ENDPOINTS.articles.details(id)),
    add: (article: ArticleDTO) => api.post(API_ENDPOINTS.articles.create, article),
    delete: (id: string | number) => api.delete(API_ENDPOINTS.articles.delete(id)),
    update: (artilce: ArticleDTO) => api.put<ArticleDTO>(API_ENDPOINTS.articles.edit(artilce.id!), artilce)
};
