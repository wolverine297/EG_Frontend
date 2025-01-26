import React from 'react';
import { Formik, Form, Field } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthService } from '../api/AuthService';

interface SignInResponse {
    user: {
        id: string;
        email: string;
        name: string;
    };
    token: string;
}

export const SignInForm: React.FC = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const authService = AuthService.getInstance();

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Sign In</h2>
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                    try {
                        const response: SignInResponse = await authService.signIn(values);
                    
                        if (response.token) {
                            localStorage.setItem('authToken', response.token);
                            
                            setUser({
                                id: response.user.id,
                                email: response.user.email,
                                name: response.user.name,
                                password: ''
                            });
                            
                            // Navigate to dashboard
                            navigate('/home');
                        } else {
                            throw new Error('Authentication failed');
                        }
                    } catch (error: any) {
                        if (error.response?.data?.message) {
                            setErrors({ email: error.response.data.message });
                        } else {
                            setErrors({ email: error.message || 'Sign in failed' });
                        }
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ errors, touched, isSubmitting }) => (
                    <Form className="space-y-4">
                        <div>
                            <Field
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="w-full p-2 border rounded"
                            />
                            {errors.email && touched.email && (
                                <div className="text-red-500 text-sm">{errors.email}</div>
                            )}
                        </div>

                        <div>
                            <Field
                                name="password"
                                type="password"
                                placeholder="Password"
                                className="w-full p-2 border rounded"
                            />
                            {errors.password && touched.password && (
                                <div className="text-red-500 text-sm">{errors.password}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            Sign In
                        </button>

                        <div className="mt-6 text-center border-t pt-6">
                            <p className="text-gray-600">New to our platform?</p>
                            <Link 
                                to="/signup" 
                                className="inline-block mt-2 text-blue-500 hover:text-blue-700 font-medium"
                            >
                                Create an account
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};