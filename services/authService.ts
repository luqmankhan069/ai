import { User } from '../types';

/*
NOTE: This service is now configured to make network requests to a backend API.
A direct connection from a frontend application to a database like MongoDB is not
secure as it would expose your database credentials to anyone using the browser.

The correct architecture is:
React Frontend <--> Backend API (e.g., Node.js/Express) <--> MongoDB Database

You will need to create a backend server that provides the following endpoints:
- POST /api/auth/login
- POST /api/auth/signup
- POST /api/auth/social

This server would be responsible for connecting to your MongoDB database,
validating user data, and managing user sessions.
*/

const API_BASE_URL = '/api/auth'; // Using a relative path for proxying in development

/**
 * Makes an API call to log in a user.
 * @param username The username to log in with.
 * @param password The password for the user.
 * @returns A Promise that resolves with the User object on success, or rejects with an error on failure.
 */
export const login = async (username: string, password: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        // Try to parse a JSON error message from the backend, otherwise throw a generic error.
        const errorData = await response.json().catch(() => ({ message: `Request failed with status ${response.status}` }));
        throw new Error(errorData.message || 'Login failed.');
    }

    return response.json();
};

/**
 * Makes an API call to sign up a new user.
 * @param username The username to register.
 * @param password The password for the new user.
 * @returns A Promise that resolves with the new User object on success, or rejects with an error.
 */
export const signup = async (username: string, password: string): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Request failed with status ${response.status}` }));
        throw new Error(errorData.message || 'Signup failed.');
    }

    return response.json();
};

/**
 * Makes an API call to handle social login.
 * @param provider The social provider being used (e.g., 'Google' or 'GitHub').
 * @returns A Promise that resolves with a User object.
 */
export const socialLogin = async (provider: 'Google' | 'GitHub'): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/social`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Request failed with status ${response.status}` }));
        throw new Error(errorData.message || `Social login with ${provider} failed.`);
    }

    return response.json();
};
