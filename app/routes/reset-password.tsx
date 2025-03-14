import { json, LoaderFunction, ActionFunction, redirect } from '@remix-run/node';
import { useLoaderData, useSearchParams } from '@remix-run/react';
import { findUserByEmail, updateUser } from '~/services/appwrite';
import { useEffect, useState } from 'react';

type LoaderData = {
  token: string;
};

type ActionData = {
  success?: string;
  error?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  if (!token) {
    return redirect('/login'); 
  }
  return json<LoaderData>({ token });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const token = formData.get('token') as string;

  if (!email || !newPassword || !confirmPassword || !token) {
    return json<ActionData>({ error: 'All fields are required' }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return json<ActionData>({ error: 'Passwords do not match' }, { status: 400 });
  }

  try {
    const user = await findUserByEmail(email);
    if (!user || user.recoveryToken !== token) {
      return json<ActionData>({ error: 'Invalid token' }, { status: 400 });
    }

    await updateUser(user.$id, { password: newPassword, recoveryToken: null });
    return redirect("/login");
  } catch (error: any) {
    return json<ActionData>({ error: 'Error resetting password: ' + error.message }, { status: 500 });
  }
};

export default function ResetPassword() {
  const { token } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();

    let formData = new FormData();
    formData.append('email', email);
    formData.append('newPassword', newPassword);
    formData.append('confirmPassword', confirmPassword);
    formData.append('token', token);

    let response = await fetch('/reset-password', {
      method: 'POST',
      body: formData,
    });

    let result: ActionData = await response.json();

    if (result.error) {
      alert(result.error);
    } else {
      alert('Password reset successfully');
      window.location.href = '/login'; // Redirect to login page
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      <form onSubmit={handlePasswordReset}>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
