/**
 * Fetch methodes for user api calls
 * @author Peter Rutschmann
 */


export const getUsers = async () => {
    const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
    const host = process.env.REACT_APP_API_HOST; // "localhost"
    const port = process.env.REACT_APP_API_PORT; // "8080"
    const path = process.env.REACT_APP_API_PATH; // "/api"
    const portPart = port ? `:${port}` : ''; // port is optional
    const API_URL = `${protocol}://${host}${portPart}${path}`;
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'Get',
            headers: {
                'Accept': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to get user:', error.message);
        throw new Error('Failed to get user. ' + error.message);
    }
}

export const postUser = async (content, recaptchaToken) => {
    const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
    const host = process.env.REACT_APP_API_HOST; // "localhost"
    const port = process.env.REACT_APP_API_PORT; // "8080"
    const path = process.env.REACT_APP_API_PATH; // "/api"
    const portPart = port ? `:${port}` : ''; // port is optional
    const API_URL = `${protocol}://${host}${portPart}${path}`;

    try {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: `${content.firstName}`,
                lastName: `${content.lastName}`,
                email: `${content.email}`,
                password: `${content.password}`,
                passwordConfirmation: `${content.passwordConfirmation}`,
                recaptchaToken: recaptchaToken
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Server response failed.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to post user:', error.message);
        throw new Error('Failed to save user. ' + error.message);
    }
};

export const postUserRegister = async (content) => {
    const protocol = process.env.REACT_APP_API_PROTOCOL; // "http"
    const host = process.env.REACT_APP_API_HOST; // "localhost"
    const port = process.env.REACT_APP_API_PORT; // "8080"
    const path = process.env.REACT_APP_API_PATH; // "/api"
    const portPart = port ? `:${port}` : ''; // port is optional
    const API_URL = `${protocol}://${host}${portPart}${path}`;

    try {
        const response = await fetch(`${API_URL}/users/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: `${content.firstName}`,
                lastName: `${content.lastName}`,
                email: `${content.email}`,
                password: `${content.password}`,
                passwordConfirmation: `${content.passwordConfirmation}`,
                recaptchaToken: `${content.recaptchaToken}`
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.message || 'Server response failed.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to post user:', error.message);
        throw new Error(error.message || 'Failed to save user.');
    }
};