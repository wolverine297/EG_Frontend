import { useAuth } from "../context/AuthContext";
import React from "react";
import { useNavigate } from "react-router-dom";

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Check if user is authenticated
    React.useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token || !user) {
            navigate('/signin');
        }
    }, [user, navigate]);

    // Show loading state while checking authentication
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold">Welcome to the application, {user.name}!</h1>
            <button 
                onClick={() => {
                    localStorage.removeItem('authToken');
                    navigate('/signin');
                }}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Sign Out
            </button>
        </div>
    );
};