'use client';

import { useActionState } from 'react';

import { Button, Input, Label } from '@yc/ui';

import { requestSignInLink } from './actions';
import type { SignInState } from './actions';

const INITIAL_STATE: SignInState = { status: 'idle', message: '' };

type LoginFormProps = {
  next: string;
};

export const LoginForm = ({ next }: LoginFormProps) => {
  const [state, formAction, isPending] = useActionState(
    requestSignInLink,
    INITIAL_STATE
  );

  return (
    <form action={formAction} className='flex flex-col gap-4'>
      <input name='next' type='hidden' value={next} />

      <div className='flex flex-col gap-2'>
        <Label htmlFor='email'>E-mail</Label>
        <Input
          required
          autoComplete='email'
          disabled={isPending}
          id='email'
          name='email'
          placeholder='you@example.com'
          type='email'
        />
      </div>

      <Button disabled={isPending} type='submit'>
        {isPending ? 'Sending…' : 'Send sign-in link'}
      </Button>

      {state.status !== 'idle' && (
        <p
          aria-live='polite'
          className={
            state.status === 'error'
              ? 'text-sm text-accent-2'
              : 'text-sm text-text/70'
          }
          role='status'
        >
          {state.message}
        </p>
      )}
    </form>
  );
};
