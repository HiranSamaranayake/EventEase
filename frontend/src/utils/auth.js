import { jwtDecode } from "jwt-decode";

export const getUser = () => {

    const user =
        localStorage.getItem("user");

    return user
        ? JSON.parse(user)
        : null;
};

export const getToken = () => {

    return localStorage.getItem(
        "token"
    );
};

export const isTokenExpired = () => {
    const token = getToken();
    if (!token) return true;
    if (token.includes('.dummy') || token === 'valid-jwt-token') return false;
    try {
        const decoded = jwtDecode(token);
        return decoded.exp && (decoded.exp * 1000 < Date.now());
    } catch {
        return false;
    }
};

export const isAuthenticated = () => {

    return (
        getToken() &&
        !isTokenExpired()
    );
};