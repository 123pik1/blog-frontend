

async function request<T>(url: string, method: string = 'GET', body?: any): Promise<T | null> {

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options: RequestInit = {
        method,
        headers
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);

        if (response.status === 401) {
            console.warn("Sesja wygasła lub brak dostępu");
            if (typeof window !== 'undefined')
                localStorage.removeItem('token');
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Błąd HTTP: ${response.status}`);
        }

        if (response.status === 204)
            return null;
        return await response.json();
    } catch (error) {
        console.error("Bład sieci/API: ", error);
        throw error;
    }
}


export const api = {
    get: <T>(url: string) => request<T>(url, 'GET'),
    post: <T>(url: string, body: any) => request<T>(url, 'POST', body),
    put: <T>(url: string, body: any) => request<T>(url, 'PUT', body),
    patch: <T>(url: string, body: any) => request<T>(url, 'PATCH', body),
    delete: <T>(url: string) => request<T>(url, 'DELETE')
}
