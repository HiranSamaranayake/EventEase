import axios from 'axios';

const API_URL = 'http://localhost/backend/api';

export const loginUser = async (email, password) => {
    try {
        const formData = new FormData();

        formData.append('email', email);
        formData.append('password', password);

        const response = await axios.post(
            `${API_URL}/login.php`,
            formData
        );

        return response.data;
    }
    catch (error) {
        console.error(error);
        return 'Login Failed';
    }
};