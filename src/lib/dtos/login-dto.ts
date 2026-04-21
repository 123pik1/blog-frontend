export interface LoginDTO {
    username: string,
    password: string
};

export interface LoginResponse {
    token: string,
    username: string
};

export interface RegisterDTO {
    username: string,
    password: string
}
