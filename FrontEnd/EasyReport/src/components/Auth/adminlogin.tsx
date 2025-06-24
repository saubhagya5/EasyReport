import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import OTPInput from 'react-otp-input';
import { toast } from 'react-toastify';

interface AdminLoginValues {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [adminEmail, setAdminEmail] = useState<string>('');

  const initialValues: AdminLoginValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
  });

  const handleLoginSubmit = async (
    values: AdminLoginValues,
    actions: FormikHelpers<AdminLoginValues>
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/admin/login`, values);
      if (response.data.success) {
        setAdminEmail(values.email);
        setOtpSent(true);
        toast.success('OTP sent to your email');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Login request failed');
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/demo`);
      if (response.data.success) {
        toast.success('Logged in as Demo Admin');
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        localStorage.setItem('isDemo', 'true');
        navigate('/admin/dashboard');
      } else {
        toast.error('Demo login failed');
      }
    } catch (error) {
      toast.error('Demo login failed');
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/otp/verify`, {
        email: adminEmail,
        otp,
      });
      if (response.data.success) {
        toast.success('Admin login successful');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid OTP');
      }
    } catch (error) {
      toast.error('OTP verification failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4 relative">
      {/* ✅ Demo Button outside card, top-right */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleDemoLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
        >
          Try Demo
        </button>
      </div>

      {/* ✅ Login Card */}
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        {!otpSent ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Admin Login</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLoginSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block font-medium text-black">Email</label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full border border-gray-300 px-3 py-2 bg-white text-black focus:border-blue-500 outline-none"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="password" className="block font-medium text-black">Password</label>
                    <Field
                      name="password"
                      type="password"
                      className="w-full border border-gray-300 px-3 py-2 bg-white text-black focus:border-blue-500 outline-none"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
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
            <button
              onClick={() => navigate('/login')}
              className="mt-4 w-full bg-white border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50 transition"
            >
              Login as Patient
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Enter OTP</h2>
            <div className="flex justify-center mb-4">
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                inputStyle={{
                  width: '2.5rem',
                  height: '2.5rem',
                  fontSize: '1rem',
                  margin: '0 0.25rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  color: 'black',
                  background: 'white',
                }}
                renderInput={(props) => <input {...props} />}
              />
            </div>
            <button
              onClick={handleOtpSubmit}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;