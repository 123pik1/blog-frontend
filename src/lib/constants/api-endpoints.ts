
export const BASE_API_URL = "https://api-blog.123pik1.ovh/api" as const;

const ARTICLE_SUB_URL = `${BASE_API_URL}/articles`;
const AUTH_SUB_URL = `${BASE_API_URL}/auth`;
const CATEGORIES_SUB_URL = `${BASE_API_URL}/categories`;
const SECTIONS_SUB_URL = `${BASE_API_URL}/sections`;
const USERS_SUB_URL = `${BASE_API_URL}/users`;


export const API_ENDPOINTS = {
    articles: {
        list: `${ARTICLE_SUB_URL}/all`,
        create: `${ARTICLE_SUB_URL}`,
        details: (id: number | string) => `${ARTICLE_SUB_URL}/${id}`,
        delete: (id: number | string) => `${ARTICLE_SUB_URL}/delete/${id}`,
        edit: (id: number | string) => `${ARTICLE_SUB_URL}/${id}`,
    },
    auth: {
        login: `${AUTH_SUB_URL}/login`,
        register: `${AUTH_SUB_URL}/register`
    },
    sections: {
        list: `${SECTIONS_SUB_URL}/all`,
        create: `${SECTIONS_SUB_URL}`
    },
    categories: {
        list: `${CATEGORIES_SUB_URL}/all`,
        listFromSection: (sectionid: number | string) => `${CATEGORIES_SUB_URL}/${sectionid}/categories`,
        create: `${CATEGORIES_SUB_URL}`
    },
    users: {
        me: `${USERS_SUB_URL}/me`,
    }
} as const;
