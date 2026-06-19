import { Navigate }
from "react-router-dom";

import {
    getUser,
    getToken,
    isTokenExpired
}
from "../utils/auth";

import { logout }
from "../utils/logout";

function ProtectedRoute({
    children,
    allowedRole
}) {

    const user = getUser();
    const token = getToken();

    if (!token || !user) {

        return (
            <Navigate to="/login" />
        );
    }

    if (isTokenExpired()) {

        logout();

        return null;
    }

    if (
        allowedRole &&
        user.role !== allowedRole
    ) {

        return (
            <Navigate to="/" />
        );
    }

    return children;
}

export default ProtectedRoute;