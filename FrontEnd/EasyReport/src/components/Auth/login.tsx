// src/components/Auth/Login.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().required('Required'),
  });

  const handleLoginSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, values);

      if (response.data.success) {
        const { token, refreshToken } = response.data.data;

        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken);

        toast.success('Login successful');
        navigate('/home');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-white px-4">
      {/* ✅ Admin Login Link at top-right */}
      <button
        onClick={() => navigate('/admin/login')}
        className="absolute top-4 right-4 bg-white border border-blue-600 text-blue-600 px-4 py-1 rounded hover:bg-blue-50 transition"
      >
        Admin Login
      </button>

      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          Patient Login
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleLoginSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="email" className="block font-medium text-black">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className="w-full border border-gray-300 px-3 py-2 bg-white text-black focus:border-blue-500 outline-none"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block font-medium text-black">
                  Password
                </label>
                <Field
                  name="password"
                  type="password"
                  className="w-full border border-gray-300 px-3 py-2 bg-white text-black focus:border-blue-500 outline-none"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;