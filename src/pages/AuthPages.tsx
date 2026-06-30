import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import { Button, Input } from '@/components/ui';
import { useUserStore } from '@/stores';
import { useTranslation } from '@/i18n';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export function LoginPage() {
  const { t } = useTranslation();
  const { login } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    login({
      id: '1',
      name: 'John Doe',
      email: data.email,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100',
    });
    toast.success('Welcome back!');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.login')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                {...register('email')}
                type="email"
                placeholder={t('auth.email')}
                error={errors.email?.message}
                className="pl-12"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.password')}
                error={errors.password?.message}
                className="pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-primary-600 hover:underline">
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            {t('auth.signIn')}
          </Button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">
            {t('auth.signUp')}
          </Link>
        </p>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-950 text-gray-500">Or continue with</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" className="flex-1" type="button">
            Google
          </Button>
          <Button variant="outline" className="flex-1" type="button">
            Apple
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export function RegisterPage() {
  const { t } = useTranslation();
  const { login } = useUserStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    login({
      id: '1',
      name: data.name,
      email: data.email,
      avatar: '',
    });
    toast.success('Account created successfully!');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('auth.register')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                {...register('name')}
                type="text"
                placeholder={t('auth.name')}
                error={errors.name?.message}
                className="pl-12"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                {...register('email')}
                type="email"
                placeholder={t('auth.email')}
                error={errors.email?.message}
                className="pl-12"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.password')}
                error={errors.password?.message}
                className="pl-12 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                {...register('confirmPassword')}
                type={showPassword ? 'text' : 'password'}
                placeholder={t('auth.confirmPassword')}
                error={errors.confirmPassword?.message}
                className="pl-12"
              />
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input type="checkbox" className="rounded mt-1" required />
            <span>
              I agree to the{' '}
              <Link to="#" className="text-primary-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="#" className="text-primary-600 hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>

          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            {t('auth.signUp')}
          </Button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            {t('auth.signIn')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}