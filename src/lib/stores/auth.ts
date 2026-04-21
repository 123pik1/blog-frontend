import type { UserDTO } from "$lib/dtos/user-dto";
import { writable } from "svelte/store";

const isBrowser = typeof window !== 'undefined';

const initialToken = isBrowser ? localStorage.getItem('token') : null;
const initialUsername = isBrowser ? localStorage.getItem('username') : null;


export const token = writable<string | null>(initialToken)
export const username = writable<string | null>(initialUsername);

export const currentUser = writable<UserDTO | null>(null);


if (isBrowser) {
    token.subscribe((value) => {
        if (value)
            localStorage.setItem('token', value);
        else
            localStorage.removeItem('token');
    });
    username.subscribe((value) => {
        if (value)
            localStorage.setItem('username', value);
        else
            localStorage.removeItem('username');
    });
}
