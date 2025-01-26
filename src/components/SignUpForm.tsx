// src/components/SignUpForm.tsx
import React from 'react';
import { Formik, Form, Field } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import * as Yup from 'yup';
import { AuthService } from '../api/AuthService';

const SignUpSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email')
        .required('Required'),
    name: Yup.string()
        .required('Required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Za-z]/, 'Password must contain at least 1 letter')
        .matches(/[0-9]/, 'Password must contain at least 1 number')
        .matches(/[!@#$%^&*]/, 'Password must contain at least 1 special character')
        .required('Required'),
});

export const SignUpForm: React.FC = () => {
    const navigate = useNavigate();
    const authService = AuthService.getInstance();

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Sign Up</h2>
            <Formik
                initialValues={{ email: '', name: '', password: '' }}
                validationSchema={SignUpSchema}
                onSubmit={async (values, { setSubmitting, setErrors }) => {
                    try {
                        await authService.signUp(values);
                        
                        alert('Account created successfully! Please sign in.');
                        navigate('/signin');
                    } catch (error: any) {
                        if (error.response?.data?.message) {
                            setErrors({ email: error.response.data.message });
                        } else if (error.message) {
                            setErrors({ email: error.message });
                        } else {
                            setErrors({ email: 'An unexpected error occurred' });
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
                                name="name"
                                type="text"
                                placeholder="Name"
                                className="w-full p-2 border rounded"
                            />
                            {errors.name && touched.name && (
                                <div className="text-red-500 text-sm">{errors.name}</div>
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
                            <div className="mt-1 text-xs text-gray-500">
                                Password must be at least 8 characters long, contain a letter, 
                                a number, and a special character (!@#$%^&*).
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            Sign Up
                        </button>

                        <div className="mt-6 text-center border-t pt-6">
                            <p className="text-gray-600">Already have an account?</p>
                            <Link 
                                to="/signin" 
                                className="inline-block mt-2 text-blue-500 hover:text-blue-700 font-medium transition-colors duration-200"
                            >
                                Sign in to your account
                            </Link>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};