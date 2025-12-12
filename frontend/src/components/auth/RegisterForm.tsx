import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import { AUTH_ENDPOINTS } from '../../services/endpoints';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await api.post(AUTH_ENDPOINTS.REGISTER, data);
      alert('Registration successful! Please login.');
      window.location.href = '/login';
    } catch (error: any) {
      alert(error.response?.data?.message || 'Registration failed');
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
      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
