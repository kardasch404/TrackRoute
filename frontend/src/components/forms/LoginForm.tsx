import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../utils/validationSchemas';
import type { LoginFormData } from '../../utils/validationSchemas';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuth();
  const [error, setError] = useState('');

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
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
      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
