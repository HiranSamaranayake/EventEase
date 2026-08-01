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

    try {

        const decoded =
            jwtDecode(token);

        return decoded.exp * 1000 <
            Date.now();

    } catch {

        return true;
    }
};

export const isAuthenticated = () => {

    return (
        getToken() &&
        !isTokenExpired()
    );
};