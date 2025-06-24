// src/components/Auth/SignUp.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import OTPInput from 'react-otp-input';
import { toast } from 'react-toastify';

interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [userData, setUserData] = useState<SignUpFormValues | null>(null);

  const initialValues: SignUpFormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Required'),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, 'Must be a 10-digit number')
      .required('Required'),
    address: Yup.string().required('Required'),
  });

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const handleSubmit = async (
  values: SignUpFormValues,
  actions: FormikHelpers<SignUpFormValues>
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, values);
    if (response.data.success) {
      setUserData(values);
      setOtpSent(true);
      toast.success('OTP sent to your email');
    } else {
      console.error('Signup failed (server responded with success: false):', response.data);
      toast.error(response.data.message);
    }
  } catch (error: any) {
    console.error('Registration failed:', error);
    toast.error(error?.response?.data?.message || 'Registration failed');
  } finally {
    actions.setSubmitting(false);
  }
};

const handleOtpSubmit = async () => {
  if (!userData) return;
  try {
    const response = await axios.post(`${API_BASE_URL}/api/otp/verify`, {
      email: userData.email,
      otp,
    });
    if (response.data.success) {
      toast.success('Registration successful');
      navigate('/login');
    } else {
      console.error('OTP verification failed (server responded with success: false):', response.data);
      toast.error('Invalid OTP');
    }
  } catch (error: any) {
    console.error('OTP verification failed:', error);
    toast.error(error?.response?.data?.message || 'OTP verification failed');
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        {!otpSent ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center text-black">Patient Sign Up</h2>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block font-medium text-black">Name</label>
                    <Field
                      name="name"
                      type="text"
                      className="w-full border border-gray-300 px-3 py-2 bg-white text-black focus:bg-white focus:text-black focus:border-blue-500 outline-none"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-medium text-black">Email</label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full border border-gray-300 px-3 py-2 bg-white text-black focus:bg-white focus:text-black focus:border-blue-500 outline-none"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="password" className="block font-medium text-black">Password</label>
                    <Field
                      name="password"
                      type="password"
                      className="w-full border border-gray-300 px-3 py-2 bg-white text-black focus:bg-white focus:text-black focus:border-blue-500 outline-none"
                    />
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block font-medium text-black">Confirm Password</label>
                    <Field
                      name="confirmPassword"
                      type="password"
                      className="w-full border border-gray-300 px-3 py-2 bg-white text-black focus:bg-white focus:text-black focus:border-blue-500 outline-none"
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block font-medium text-black">Phone</label>
                    <Field
                      name="phone"
                      type="text"
                      className="w-full border border-gray-300 px-3 py-2 bg-white text-black focus:bg-white focus:text-black focus:border-blue-500 outline-none"
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />
                  </div>
                  <div>
                    <label htmlFor="address" className="block font-medium text-black">Address</label>
                    <Field
                      name="address"
                      type="text"
                      className="w-full border border-gray-300 px-3 py-2 bg-white text-black focus:bg-white focus:text-black focus:border-blue-500 outline-none"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </Form>
              )}
            </Formik>
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

export default SignUp;