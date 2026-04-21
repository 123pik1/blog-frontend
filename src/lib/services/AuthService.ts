import { api } from "$lib/apiClient";
import { API_ENDPOINTS } from "$lib/constants/api-endpoints";
import type { LoginDTO, LoginResponse, RegisterDTO } from "$lib/dtos/login-dto";
import type { UserDTO } from "$lib/dtos/user-dto";
import { currentUser, token, username } from "$lib/stores/auth";



async function login(credientals: LoginDTO): Promise<boolean> {
    try {
        const response = await api.post<LoginResponse>(API_ENDPOINTS.auth.login, credientals);


        if (response?.token) {
            token.set(response.token);
            username.set(response.username);
            getMe();
            return true;
        }

        return false;
    } catch (error) {
        console.error("Error during log in: ", error);
        return false;
    }
}

function logout() {
    token.set(null);
    username.set(null);
    currentUser.set(null);
    window.location.href = '/';
}

async function register(credientals: RegisterDTO) {
    try {
        const response = await api.post<LoginResponse>(API_ENDPOINTS.auth.register, credientals)

        if (response?.token) {
            token.set(response.token);
            username.set(response.username);
            getMe();
            return true;
        }

        return false;
    } catch (error) {
        console.error("Error during registration: ", error);
        return false;
    }
}

async function getMe() {
    try {
        const response = await api.get<UserDTO>(API_ENDPOINTS.users.me);

        currentUser.set(response);
        return true;
    } catch (error) {
        console.error("Error with getting user details: ", error);
        return false;
    }
}


export const authService = {
    login: (credientals: LoginDTO) => login(credientals),
    logout: () => logout(),
    register: (credientals: RegisterDTO) => register(credientals),
    me: () => getMe(),
}
