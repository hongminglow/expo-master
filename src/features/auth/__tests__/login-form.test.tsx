import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import { LoginForm } from '../components/login-form';

describe('LoginForm', () => {
  it('shows validation before submitting invalid credentials', async () => {
    const submit = jest.fn();

    render(<LoginForm initialEmail="" initialRememberMe={false} onSubmit={submit} />);

    fireEvent.press(screen.getByLabelText('Continue'));

    expect(await screen.findByText('Enter a valid work email.')).toBeTruthy();
    expect(screen.getByText('Password must be at least 8 characters.')).toBeTruthy();
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits valid credentials with remember-me enabled', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);

    render(<LoginForm initialEmail="admin@example.com" initialRememberMe={true} onSubmit={submit} />);

    fireEvent.changeText(screen.getByLabelText('Email'), 'ops@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'password');
    fireEvent.press(screen.getByLabelText('Remember me'));
    fireEvent.press(screen.getByLabelText('Remember me'));
    fireEvent.press(screen.getByLabelText('Continue'));

    await waitFor(() =>
      expect(submit).toHaveBeenCalledWith({
        email: 'ops@example.com',
        password: 'password',
        rememberMe: true,
      }),
    );
  });

  it('lets users show and hide the password value', () => {
    render(<LoginForm initialEmail="admin@example.com" initialRememberMe={false} onSubmit={jest.fn()} />);

    const passwordInput = screen.getByLabelText('Password');
    expect(passwordInput.props.secureTextEntry).toBe(true);
    expect(screen.queryByText('Show')).toBeNull();
    expect(screen.queryByText('Hide')).toBeNull();

    fireEvent.press(screen.getByLabelText('Show password'));
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(false);

    fireEvent.press(screen.getByLabelText('Hide password'));
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(true);
  });

  it('preloads remembered email and remember-me state', () => {
    render(
      <LoginForm initialEmail="admin@example.com" initialRememberMe={true} onSubmit={jest.fn()} />,
    );

    expect(screen.getByDisplayValue('admin@example.com')).toBeTruthy();
    expect(screen.getByLabelText('Remember me')).toBeTruthy();
  });

  it('keeps login copy concise without product-facing implementation labels', () => {
    render(<LoginForm initialEmail="" initialRememberMe={false} onSubmit={jest.fn()} />);

    expect(screen.getByLabelText('Continue')).toBeTruthy();
    expect(screen.queryByText('Enterprise Expo')).toBeNull();
    expect(screen.queryByText('Sign in')).toBeNull();
  });
});
