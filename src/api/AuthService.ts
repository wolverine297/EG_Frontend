import axios from 'axios';
import { ILoginCredentials, IUser } from '../types/auth.type';

interface SignInResponse {
    user: {
        id: string;
        email: string;
        name: string;
    };
    token: string;
}

export class AuthService {
    private static instance: AuthService;
    private readonly API_URL = process.env.REACT_APP_BACKEND_API_URL;
    
    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public async signUp(user: IUser): Promise<boolean> {
        try {
            const response = await axios.post(`${this.API_URL}/signup`, user);     
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
            }
            
            return true;
        } catch (error) {
            // Handle specific error cases
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    throw new Error('User already exists');
                }
                throw new Error(error.response?.data?.message || 'Signup failed');
            }
            throw error;
        }
    }

    public async signIn(credentials: ILoginCredentials): Promise<SignInResponse> {
        try {
            const response = await axios.post(`${this.API_URL}/signin`, credentials);
            return {
                user: {
                    id: response.data.user.id,
                    email: response.data.user.email,
                    name: response.data.user.name
                },
                token: response.data.token
            };
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error(error.response?.data?.message || 'Sign in failed');
            }
            throw error;
        }
    }

    public async getUserData(userId: string): Promise<IUser> {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await axios.get(`${this.API_URL}/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    localStorage.removeItem('authToken');
                    throw new Error('Authentication token expired');
                }
                throw new Error(error.response?.data?.message || 'Failed to fetch user data');
            }
            throw error;
        }
    }

    // Helper method to check if user is authenticated
    public isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }

    // Method to handle logout
    public logout(): void {
        localStorage.removeItem('authToken');
    }
}