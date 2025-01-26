// src/App.tsx
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

const SignUpForm = React.lazy(() => 
    import('./components/SignUpForm').then(module => ({ 
        default: module.SignUpForm 
    }))
);
const SignInForm = React.lazy(() => 
    import('./components/SignInForm').then(module => ({ 
        default: module.SignInForm 
    }))
);
const DashboardPage = React.lazy(() => 
    import('./components/Dashboard').then(module => ({ 
        default: module.DashboardPage 
    }))
);

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
);

// Protected Route Component with proper typing
interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        <Route path="/signup" element={<SignUpForm />} />
                        <Route path="/signin" element={<SignInForm />} />
                        <Route
                            path="/home"
                            element={
                                <ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/signin" />} />
                        <Route path="*" element={<Navigate to="/signin" />} />
                    </Routes>
                </Suspense>
            </Router>
        </AuthProvider>
    );
};

export default App;