import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import { useState } from 'react';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      // Don't send confirmPassword to API
      const { confirmPassword, ...registerData } = data;
      await authApi.register(registerData);
      navigate('/pending-approval');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">First Name</label>
        <input {...register('firstName')} className="w-full px-3 py-2 border rounded-md" />
        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Last Name</label>
        <input {...register('lastName')} className="w-full px-3 py-2 border rounded-md" />
        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input {...register('email')} type="email" className="w-full px-3 py-2 border rounded-md" />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input {...register('password')} type="password" className="w-full px-3 py-2 border rounded-md" />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <input {...register('confirmPassword')} type="password" className="w-full px-3 py-2 border rounded-md" />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
        {isSubmitting ? 'Registering...' : 'Create Account'}
      </button>
      <p className="text-sm text-gray-600 text-center">
        Your account will be reviewed by an administrator before you can access the system.
      </p>
    </form>
  );
}
