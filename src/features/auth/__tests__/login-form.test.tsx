import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import React from 'react';

import { LoginForm } from '../components/login-form';

describe('LoginForm', () => {
  it('shows validation before submitting invalid credentials', async () => {
    const submit = jest.fn();

    render(<LoginForm initialEmail="" initialRememberMe={false} onSubmit={submit} />);

    fireEvent.press(screen.getByLabelText('Sign in'));

    expect(await screen.findByText('Enter a valid work email.')).toBeTruthy();
    expect(screen.getByText('Password must be at least 8 characters.')).toBeTruthy();
    expect(submit).not.toHaveBeenCalled();
  });

  it('submits valid credentials with remember-me enabled', async () => {
    const submit = jest.fn().mockResolvedValue(undefined);

    render(<LoginForm initialEmail="admin@example.com" initialRememberMe={true} onSubmit={submit} />);

    fireEvent.changeText(screen.getByLabelText('Email'), 'ops@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'enterprise');
    fireEvent.press(screen.getByLabelText('Remember me'));
    fireEvent.press(screen.getByLabelText('Remember me'));
    fireEvent.press(screen.getByLabelText('Sign in'));

    await waitFor(() =>
      expect(submit).toHaveBeenCalledWith({
        email: 'ops@example.com',
        password: 'enterprise',
        rememberMe: true,
      }),
    );
  });

  it('preloads remembered email and remember-me state', () => {
    render(
      <LoginForm initialEmail="admin@example.com" initialRememberMe={true} onSubmit={jest.fn()} />,
    );

    expect(screen.getByDisplayValue('admin@example.com')).toBeTruthy();
    expect(screen.getByLabelText('Remember me')).toBeTruthy();
  });
});
