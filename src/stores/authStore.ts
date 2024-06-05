import { ref } from "vue";

const authStatus = ref(false);

export const useAuthStore = () => {
    const get = () => {
        return authStatus.value;
    };

    const login = (username: string, password: string) => {
        authStatus.value =
            username === import.meta.env.VITE_USERNAME &&
            password === import.meta.env.VITE_PASSWORD;
    };

    return { get, login };
};
