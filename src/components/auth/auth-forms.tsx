'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login, signup } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form';
import { FormAlert, applyServerErrors } from '@/components/ui/form-feedback';
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from '@/lib/validations';

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    startTransition(async () => {
      setFormError(applyServerErrors(await login(values, redirectTo), setError));
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormAlert message={formError} />
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
      </Field>
      <Button type="submit" loading={pending} className="mt-2 w-full">
        Masuk
      </Button>
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Belum punya akun?{' '}
        <Link href="/register" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Daftar
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = handleSubmit((values) => {
    setFormError(null);
    startTransition(async () => {
      setFormError(applyServerErrors(await signup(values), setError));
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <FormAlert message={formError} />
      <Field label="Nama" htmlFor="name" error={errors.name?.message}>
        <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register('name')} />
      </Field>
      <Field label="Email" htmlFor="email" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
      </Field>
      <Field label="Password" htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register('password')}
        />
      </Field>
      <Field
        label="Konfirmasi password"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
      </Field>
      <Button type="submit" loading={pending} className="mt-2 w-full">
        Buat akun
      </Button>
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Masuk
        </Link>
      </p>
    </form>
  );
}
